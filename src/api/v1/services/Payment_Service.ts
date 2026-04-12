import * as firestoreRepository from "../repositories/Payment_Repository";
import { Payment } from "../models/Payment_Model";
import { getOrderService, updateOrderService } from "../services/Order_Service";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../../../../config/firebaseConfig";

// ===== CRUD =====
// Generate IDs like pay_000001
let paymentCounter = 0;
const generatePaymentId = (): string => {
    paymentCounter += 1;
    return `pay_${paymentCounter.toString().padStart(6, "0")}`;
};

/**
 * Create a new payment
 */
export const createPayment = async (data: Partial<Payment>): Promise<Payment> => {
    try {
        const newId = generatePaymentId();

        const paymentData: Payment = {
            id: newId,
            orderId: data.orderId ?? "",
            userId: data.userId ?? "",
            amount: data.amount ?? 0,
            method: data.method ?? "other",
            status: data.status ?? "success",
            timestamp: data.timestamp ?? Timestamp.now(),
        };

        // Changed 'payments' to 'Payments'
        await firestoreRepository.createPayment<Payment>("Payments", paymentData, newId);

        return paymentData;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to create payment: ${error.message}`);
        } else {
            throw new Error("Failed to create payment: Unknown error");
        }
    }
};

/**
 * Retrieve all payments
 */
export const getAllPayments = async (): Promise<Payment[]> => {
    try {
        // Changed 'payments' to 'Payments'
        const allPayments = await firestoreRepository.getPayments("Payments");

        return allPayments.docs.map((doc) => {
            const data = doc.data();

            return {
                id: doc.id,
                orderId: data.orderId,
                userId: data.userId,
                amount: data.amount,
                method: data.method,
                status: data.status,
                timestamp:
                    data.timestamp instanceof Timestamp
                        ? data.timestamp.toDate().toISOString()
                        : data.timestamp,
            } as Payment;
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to retrieve payments: ${error.message}`);
        } else {
            throw new Error("Failed to retrieve payments: Unknown error");
        }
    }
};

/**
 * Retrieve a single payment by ID
 */
export const getPayment = async (id: string): Promise<Payment | null> => {
    try {
        // Changed 'payments' to 'Payments'
        const doc = await firestoreRepository.getPaymentById("Payments", id);
        if (!doc || !doc.exists) return null;

        const data = doc.data();
        if (!data) return null;

        return {
            id: doc.id,
            orderId: data.orderId,
            userId: data.userId,
            amount: data.amount,
            method: data.method,
            status: data.status,
            timestamp:
                data.timestamp instanceof Timestamp
                    ? data.timestamp.toDate().toISOString()
                    : data.timestamp,
        } as Payment;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to retrieve payment: ${error.message}`);
        } else {
            throw new Error("Failed to retrieve payment: Unknown error");
        }
    }
};

/**
 * Update a payment by ID
 */
export const updatePayment = async (
  id: string,
  data: Partial<Payment>
): Promise<Payment | null> => {
    try {
        // Changed 'payments' to 'Payments'
        const doc = await firestoreRepository.getPaymentById("Payments", id);
        if (!doc || !doc.exists) return null;

        const existing = doc.data()!;

        const updatedPayment: Payment = {
            id: doc.id,
            orderId: data.orderId ?? existing.orderId,
            userId: data.userId ?? existing.userId,
            amount: data.amount ?? existing.amount,
            method: data.method ?? existing.method,
            status: data.status ?? existing.status,
            timestamp: data.timestamp ?? Timestamp.now(),
        };

        // Changed 'payments' to 'Payments'
        await firestoreRepository.updatePayment<Payment>("Payments", id, updatedPayment);

        return updatedPayment;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to update payment: ${error.message}`);
        } else {
            throw new Error("Failed to update payment: Unknown error");
        }
    }
};

/**
 * Delete a payment by ID
 */
export const deletePayment = async (id: string): Promise<Payment | null> => {
    try {
        // Changed 'payments' to 'Payments'
        const doc = await firestoreRepository.getPaymentById("Payments", id);
        if (!doc || !doc.exists) return null;

        const data = doc.data()!;

        const deletedPayment: Payment = {
            id: doc.id,
            orderId: data.orderId,
            userId: data.userId,
            amount: data.amount,
            method: data.method,
            status: data.status,
            timestamp:
                data.timestamp instanceof Timestamp
                    ? data.timestamp.toDate()
                    : data.timestamp,
        };

        // Changed 'payments' to 'Payments'
        await firestoreRepository.deletePayment("Payments", id);

        return deletedPayment;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to delete payment: ${error.message}`);
        } else {
            throw new Error("Failed to delete payment: Unknown error");
        }
    }
};

// ===== Business Logic =====
/**
 * Pay order (industrial version)
 */
export async function payOrderService(orderId: string, userId: string) {
    try {
        // 1. Get order
        const order = await getOrderService(orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        // 2. Check ownership
        if (order.userId !== userId) {
            throw new Error("Unauthorized payment attempt");
        }

        // 3. Prevent duplicate payment
        if (order.status === "paid") {
            throw new Error("Order already paid");
        }

        // 4. Update order status → paid
        const updatedOrder = await updateOrderService(orderId, {
            paymentId: "pay_000001",
            status: "paid",
            updatedAt: Timestamp.now()
        });

        if (!updatedOrder) {
            throw new Error("Failed to update order");
        }

        // Remove product paid
        const cartQuery = await db.collection("carts").where("userId", "==", userId).get();
        if (!cartQuery.empty) {
            const cartDoc = cartQuery.docs[0];
            const cartData = cartDoc.data();
            const cartItems = cartData?.items || [];

            // Get product id in order
            const orderedProductIds = order.items.map((item: any) => item.productId);

            // keep product that has not paid
            const remainingItems = cartItems.filter(
                (item: any) => !orderedProductIds.includes(item.productId)
            );

            // Update cart
            await cartDoc.ref.update({ items: remainingItems });
        }

        // 6. Return result
        return {
            message: "Payment successful",
            order: updatedOrder
        };

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Payment failed: ${error.message}`);
        } else {
            throw new Error("Payment failed: Unknown error");
        }
    }
}
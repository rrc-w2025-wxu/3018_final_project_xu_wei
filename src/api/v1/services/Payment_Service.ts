import * as firestoreRepository from "../repositories/Payment_Repository";
import { Payment } from "../models/Payment_Model";
import { getOrderService, updateOrderService } from "../services/Order_Service"
import { Timestamp } from "firebase-admin/firestore";

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

        await firestoreRepository.createPayment<Payment>("payments", paymentData, newId);

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
        const allPayments = await firestoreRepository.getPayments("payments");

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
        const doc = await firestoreRepository.getPaymentById("payments", id);
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
        const doc = await firestoreRepository.getPaymentById("payments", id);
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

        await firestoreRepository.updatePayment<Payment>("payments", id, updatedPayment);

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
        const doc = await firestoreRepository.getPaymentById("payments", id);
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

        await firestoreRepository.deletePayment("payments", id);

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
export async function payOrderService(orderId: string) {
    // Get order
    const order = await getOrderService(orderId);
    if (!order) throw new Error("Order not found");

    // Check status
    if (order.status === "paid") {
        throw new Error("Order already paid");
    }

    // Update status
    const updatedOrder = await updateOrderService(orderId, {
        status: "paid",
        updatedAt: Timestamp.now()
    });

    return {
        message: "Payment successful",
        order: updatedOrder
    };
}
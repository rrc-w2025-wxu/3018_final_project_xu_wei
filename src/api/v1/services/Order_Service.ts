import * as firestoreRepository from "../repositories/Order_Repository";
import { Order } from "../models/Order_Model";
import { Timestamp } from "firebase-admin/firestore";
import { getProductById } from "../repositories/Product_Repository";
import { getByUserId as getCartByUserId } from "../repositories/Cart_Repository";
import { getByCartId } from "../repositories/CartItem_Repository";

// ===== ID Generator =====
let orderCounter = 0;
const generateOrderId = (): string => {
    orderCounter += 1;
    return `order_${orderCounter.toString().padStart(6, "0")}`;
};

// ===== CREATE ORDER =====
export const createOrderService = async (
    data: Partial<Order>
): Promise<Order> => {
    try {
        const newId = generateOrderId();

        if (!data.userId) throw new Error("userId is required");
        if (!data.items || data.items.length === 0) {
            throw new Error("items are required");
        }

        const total = data.items.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

        const orderData: Order = {
            id: newId,
            userId: data.userId,
            items: data.items,
            total,
            status: "pending",
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            // ❗ paymentId 不写（避免 undefined bug）
        };

        await firestoreRepository.createOrder<Order>(
            "Orders",
            orderData,
            newId
        );

        return orderData;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to create order: ${error.message}`);
        }
        throw new Error("Failed to create order: Unknown error");
    }
};

// ===== GET ALL =====
export const getAllOrdersService = async (): Promise<Order[]> => {
    try {
        const allOrders = await firestoreRepository.getOrders("Orders");

        return allOrders.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            } as Order;
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to retrieve orders: ${error.message}`);
        }
        throw new Error("Failed to retrieve orders: Unknown error");
    }
};

// ===== GET ONE =====
export const getOrderService = async (id: string): Promise<Order | null> => {
    try {
        const doc = await firestoreRepository.getOrderById("Orders", id);

        if (!doc || !doc.exists) return null;

        const data = doc.data();
        if (!data) return null;

        return {
            id: doc.id,
            ...data,
        } as Order;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to retrieve order: ${error.message}`);
        }
        throw new Error("Failed to retrieve order: Unknown error");
    }
};

// ===== UPDATE =====
export const updateOrderService = async (
    id: string,
    data: Partial<Order>
): Promise<Order | null> => {
    try {
        const doc = await firestoreRepository.getOrderById("Orders", id);

        if (!doc || !doc.exists) return null;

        const existing = doc.data()!;

        const updatedOrder: Order = {
            id: doc.id,
            userId: data.userId ?? existing.userId,
            items: data.items ?? existing.items,
            total: data.total ?? existing.total,
            status: data.status ?? existing.status,
            paymentId: data.paymentId ?? existing.paymentId,
            createdAt: existing.createdAt,
            updatedAt: Timestamp.now(),
        };

        await firestoreRepository.updateOrder<Order>(
            "Orders",
            id,
            updatedOrder
        );

        return updatedOrder;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to update order: ${error.message}`);
        }
        throw new Error("Failed to update order: Unknown error");
    }
};

// ===== DELETE =====
export const deleteOrderService = async (
    id: string
): Promise<Order | null> => {
    try {
        const doc = await firestoreRepository.getOrderById("Orders", id);

        if (!doc || !doc.exists) return null;

        const data = doc.data()!;

        const deletedOrder: Order = {
            id: doc.id,
            userId: data.userId,
            items: data.items,
            total: data.total,
            status: data.status,
            paymentId: data.paymentId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };

        await firestoreRepository.deleteOrder("Orders", id);

        return deletedOrder;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to delete order: ${error.message}`);
        }
        throw new Error("Failed to delete order: Unknown error");
    }
};

// ===== CART → ORDER =====
export async function createOrderFromCartService(
    userId: string
): Promise<Order> {
    try {
        const cart = await getCartByUserId(userId);
        if (!cart) throw new Error("Cart not found");

        const cartItems = await getByCartId(cart.id);

        if (!cartItems || cartItems.length === 0) {
            throw new Error("Cart is empty");
        }

        const orderItems = await Promise.all(
            cartItems.map(async (item: any) => {
                const product = await getProductById(item.productId);

                if (!product) {
                    throw new Error(
                        `Product not found: ${item.productId}`
                    );
                }

                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price,
                };
            })
        );

        return await createOrderService({
            userId,
            items: orderItems,
            status: "pending",
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to create order: ${error.message}`);
        }
        throw new Error("Failed to create order: Unknown error");
    }
}
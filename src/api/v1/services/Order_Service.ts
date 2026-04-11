import * as firestoreRepository from "../repositories/Order_Repository";
import { Order } from "../models/Order_Model";
import { Timestamp } from "firebase-admin/firestore";

/**
 * Generate IDs like order_000001
 */
let orderCounter = 0;
const generateOrderId = (): string => {
  orderCounter += 1;
  return `order_${orderCounter.toString().padStart(6, "0")}`;
};

/**
 * Create a new order
 * @param data - Partial order data
 * @returns Complete Order object
 * @throws Error if creation fails
 */
export const createOrderService = async (data: Partial<Order>): Promise<Order> => {
  try {
    const newId = generateOrderId();
    const timestamp = data.createdAt ?? Timestamp.now();

    const orderData: Order = {
      id: newId,
      userId: data.userId ?? "unknown_user",
      items: data.items ?? [],
      total: data.total ?? 0,
      status: data.status ?? "pending",
      paymentId: data.paymentId ?? undefined,
      createdAt: timestamp,
      updatedAt: data.updatedAt ?? timestamp,
    };

    await firestoreRepository.createOrder<Order>("orders", orderData, newId);

    return orderData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create order: ${error.message}`);
    } else {
      throw new Error("Failed to create order: Unknown error");
    }
  }
};

/**
 * Retrieve all orders
 * @returns Array of Order objects
 * @throws Error if retrieval fails
 */
export const getAllOrdersService = async (): Promise<Order[]> => {
  try {
    const allOrders = await firestoreRepository.getOrders("orders");

    return allOrders.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt,
        updatedAt:
          data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate().toISOString()
            : data.updatedAt,
      } as Order;
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to retrieve orders: ${error.message}`);
    } else {
      throw new Error("Failed to retrieve orders: Unknown error");
    }
  }
};

/**
 * Retrieve a single order by ID
 * @param id - Order ID
 * @returns Order object or null
 * @throws Error if retrieval fails
 */
export const getOrderService = async (id: string): Promise<Order | null> => {
  try {
    const doc = await firestoreRepository.getOrderById("orders", id);
    if (!doc || !doc.exists) return null;

    const data = doc.data();
    if (!data) return null;

    return {
      id: doc.id,
      ...data,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
      updatedAt:
        data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt,
    } as Order;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to retrieve order: ${error.message}`);
    } else {
      throw new Error("Failed to retrieve order: Unknown error");
    }
  }
};

/**
 * Update an order by ID
 * @param id - Order ID
 * @param data - Partial order data
 * @returns Updated Order object or null
 * @throws Error if update fails
 */
export const updateOrderService = async (
  id: string,
  data: Partial<Order>
): Promise<Order | null> => {
  try {
    const doc = await firestoreRepository.getOrderById("orders", id);
    if (!doc || !doc.exists) return null;

    const existing = doc.data()!;

    const updatedOrder: Order = {
      id: doc.id,
      userId: data.userId ?? existing.userId,
      items: data.items ?? existing.items,
      total: data.total ?? existing.total,
      status: data.status ?? existing.status,
      paymentId: data.paymentId ?? existing.paymentId,
      createdAt: existing.createdAt ?? Timestamp.now(),
      updatedAt: data.updatedAt ?? Timestamp.now(),
    };

    await firestoreRepository.updateOrder<Order>("orders", id, updatedOrder);

    return updatedOrder;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to update order: ${error.message}`);
    } else {
      throw new Error("Failed to update order: Unknown error");
    }
  }
};

/**
 * Delete an order by ID
 * @param id - Order ID
 * @returns Deleted Order object or null
 * @throws Error if deletion fails
 */
export const deleteOrderService = async (id: string): Promise<Order | null> => {
  try {
    const doc = await firestoreRepository.getOrderById("orders", id);
    if (!doc || !doc.exists) return null;

    const data = doc.data();
    if (!data) return null;

    const deletedOrder: Order = {
    id: doc.id,
    userId: data.userId ?? "",           
    items: data.items ?? [],             
    total: data.total ?? 0,            
    status: data.status ?? "pending",    
    paymentId: data.paymentId,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : undefined,
    };

    await firestoreRepository.deleteOrder("orders", id);

    return deletedOrder;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete order: ${error.message}`);
    } else {
      throw new Error("Failed to delete order: Unknown error");
    }
  }
};
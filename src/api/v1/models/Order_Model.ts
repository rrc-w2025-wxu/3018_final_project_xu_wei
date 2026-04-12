import { Timestamp } from "firebase-admin/firestore";
import { OrderItem } from "../models/Order_Item_Model";

/**
 * Order model
 *
 * Represents a customer order in the system.
 * Contains order items, pricing, status, and payment information.
 *
 * Fields:
 * - id: Firestore document ID (auto-generated)
 * - userId: ID of the user who placed the order
 * - items: List of products included in the order
 * - total: Total price of the order
 * - status: Current order status (pending, paid, shipped)
 * - paymentId: Payment transaction ID (if the order is paid)
 * - createdAt: Timestamp when the order was created
 * - updatedAt: Timestamp when the order was last updated
 */
export interface Order {
    id?: string;              // Firestore document ID (auto-generated)
    userId: string;           // ID of the user who placed the order
    items: OrderItem[];       // List of products in the order
    total: number;            // Total price of the order
    status: "pending" | "paid" | "shipped"; // Order status
    paymentId?: string;       // Payment transaction ID (if paid)
    createdAt?: Timestamp;    // Timestamp when the order was created
    updatedAt?: Timestamp;    // Timestamp when the order was last updated
}
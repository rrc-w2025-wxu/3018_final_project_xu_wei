import { Timestamp } from "firebase-admin/firestore";
import { OrderItem } from "./OrderItem";

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
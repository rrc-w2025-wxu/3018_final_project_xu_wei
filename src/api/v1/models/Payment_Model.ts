import { Timestamp } from "firebase-admin/firestore";

export interface Payment {
  id?: string;            // Firestore document ID (auto-generated)
  orderId: string;        // ID of the corresponding order
  userId: string;         // ID of the user who made the payment
  amount: number;         // Payment amount
  method: "paypal" | "credit_card" | "other"; // Payment method
  status: "success" | "failed";  // Payment status
  timestamp?: Timestamp;  // Timestamp when the payment was made
}
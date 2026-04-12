import { Timestamp } from "firebase-admin/firestore";

/**
 * Payment model
 *
 * Represents a payment transaction for an order.
 * Stores payment details, method, and status.
 *
 * Fields:
 * - id: Firestore document ID (auto-generated)
 * - orderId: ID of the related order
 * - userId: ID of the user who made the payment
 * - amount: Total payment amount
 * - method: Payment method used (PayPal, credit card, or other)
 * - status: Result of the payment (success or failed)
 * - timestamp: Time when the payment was created
 */
export interface Payment {
    id?: string;            // Firestore document ID (auto-generated)
    orderId: string;        // ID of the corresponding order
    userId: string;         // ID of the user who made the payment
    amount: number;         // Payment amount
    method: "paypal" | "credit_card" | "other"; // Payment method
    status: "success" | "failed";  // Payment status
    timestamp?: Timestamp;  // Timestamp when the payment was made
  }
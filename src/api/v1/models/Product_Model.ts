import { Timestamp } from "firebase-admin/firestore";

/**
 * Product model
 *
 * Represents a product in the system that can be purchased by users.
 *
 * Fields:
 * - id: Firestore document ID (auto-generated)
 * - name: Name of the product
 * - description: Detailed description of the product
 * - price: Selling price of the product
 * - stock: Available inventory quantity
 * - category: Product category (optional)
 * - createdAt: Timestamp when the product was created
 * - updatedAt: Timestamp when the product was last updated
 */
export interface Product {
    id?: string;          // Firestore document ID (auto-generated)
    name: string;         // Name of the product
    description: string;  // Description of the product
    price: number;        // Price of the product
    stock: number;        // Available stock quantity
    category?: string;    // Category of the product (optional)
    createdAt?: Timestamp; // Timestamp when the product was created
    updatedAt?: Timestamp; // Timestamp when the product was last updated
}
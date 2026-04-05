import { Timestamp } from "firebase-admin/firestore";

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
import { Timestamp } from "firebase-admin/firestore";

export interface CartItem {
    id?: string;
    cartId: string;
    productId: string;
    quantity: number;
    createdAt: Timestamp;
}
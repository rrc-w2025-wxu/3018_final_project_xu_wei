import { Timestamp } from "firebase-admin/firestore";

export interface Cart {
    id?: string;
    userId: string;
    createdAt: Timestamp;
}
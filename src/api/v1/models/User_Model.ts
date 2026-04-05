import { Timestamp } from "firebase-admin/firestore";

export interface User {
  id: string;           // User UID provided by Firebase Auth
  name: string;         // User display name
  email: string;        // User email address
  createdAt?: Timestamp; // Timestamp when the user registered
}
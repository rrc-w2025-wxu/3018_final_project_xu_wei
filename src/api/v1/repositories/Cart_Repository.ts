import { db } from "../../../../config/firebaseConfig";

const cartCollection = db.collection("carts");

// Get cart base on user id
export async function getByUserId(userId: string) {
    const snap = await cartCollection
    .where("userId", "==", userId)
    .get();

    if (snap.empty) return null;

    const doc = snap.docs[0];

    return {
    id: doc.id,
    ...doc.data()
    };
}

// Create cart
export async function createCart(userId: string) {
    const docRef = await cartCollection.add({
    userId,
    createdAt: new Date()
    });

    return {
    id: docRef.id,
    userId
    };
}


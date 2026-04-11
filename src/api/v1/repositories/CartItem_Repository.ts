import { db } from "../../../../config/firebaseConfig";

const cartItemCollection = db.collection("cartItems");

// Get all products base on cart id
export async function getByCartId(cartId: string) {
    const snap = await cartItemCollection
    .where("cartId", "==", cartId)
    .get();

    return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
    }));
}

// Add product
export async function addItem(item: any) {
    const docRef = await cartItemCollection.add(item);

    return {
    id: docRef.id,
    ...item
    };
}

// Update quantity
export async function updateItem(id: string, data: any) {
    await cartItemCollection.doc(id).update(data);
}

// Delete product
export async function deleteItem(id: string) {
    await cartItemCollection.doc(id).delete();
}

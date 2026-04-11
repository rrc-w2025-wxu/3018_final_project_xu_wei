import { db } from "../../../../config/firebaseConfig";
import { Product } from "../models/Product_Model";

/**
 * Creates a new document in a specified Firestore collection.
 * @param {string} collectionName - The name of the collection.
 * @param {Partial<T>} data - The data for the new document.
 * @returns {Promise<string>} - The ID of the newly created document.
 */
export const createProduct = async <T>(
    collectionName: string,
    data: Partial<T>,
    id?: string
): Promise<string> => {
    try {
        let docRef: FirebaseFirestore.DocumentReference;

        if (id) {
            docRef = db.collection(collectionName).doc(id);
            await docRef.set(data);
        } else {
            docRef = await db.collection(collectionName).add(data);
        }

        return docRef.id;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to create document in ${collectionName}: ${errorMessage}`
        );
    }
};

/**
 * Retrieves all documents from a specified Firestore collection.
 * @param {string} collectionName - The name of the collection.
 * @returns {Promise<FirebaseFirestore.QuerySnapshot>} - A QuerySnapshot containing all documents.
 */
export const getProducts = async (
    collectionName: string
): Promise<FirebaseFirestore.QuerySnapshot> => {
    try {
        return await db.collection(collectionName).get();
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to fetch documents from ${collectionName}: ${errorMessage}`
        );
    }
};

/**
 * Retrieves a document by its ID from a specified Firestore collection.
 * @param {string} collectionName - The name of the collection.
 * @param {string} id - The ID of the document to retrieve.
 * @returns {Promise<FirebaseFirestore.DocumentSnapshot | null>} - The document or null if it doesn't exist.
 */
export const getProductById = async (
    id: string
): Promise<Product | null> => {
    const doc = await db.collection("products").doc(id).get();

    if (!doc.exists) return null;

    return {
        id: doc.id,
        ...doc.data()
    } as Product;
};

/**
 * Updates an existing document in a specified Firestore collection.
 * @param {string} collectionName - The name of the collection.
 * @param {string} id - The ID of the document to update.
 * @param {Partial<T>} data - The updated document data.
 * @returns {Promise<void>}
 */
export const updateProduct = async <T>(
    collectionName: string,
    id: string,
    data: Partial<T>
): Promise<void> => {
    try {
        await db.collection(collectionName).doc(id).update(data);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to update document ${id} in ${collectionName}: ${errorMessage}`
        );
    }
};

/**
 * Deletes a document from a specified Firestore collection.
 * Can operate within a transaction if provided, otherwise performs a direct delete.
 * @param {string} collectionName - The name of the collection.
 * @param {string} id - The ID of the document to delete.
 * @param {FirebaseFirestore.Transaction} [transaction] - Optional Firestore transaction.
 * @returns {Promise<void>}
 */
export const deleteProduct = async (
    collectionName: string,
    id: string,
    transaction?: FirebaseFirestore.Transaction
): Promise<void> => {
    try {
        const docRef: FirebaseFirestore.DocumentReference = db
            .collection(collectionName)
            .doc(id);
        if (transaction) {
            transaction.delete(docRef);
        } else {
            await docRef.delete();
        }
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to delete document ${id} from ${collectionName}: ${errorMessage}`
        );
    }
};

// src/repositories/Product_Repository.ts
export const productRepository = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
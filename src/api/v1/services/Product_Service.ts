
import { Product } from "../models/Product_Model";
import { productRepository } from "../repositories/Product_Repository"; 
import { Timestamp } from "firebase-admin/firestore";

// Generate IDs like prod_000001
let productCounter = 0;
const generateProductId = (): string => {
    productCounter += 1;
    return `prod_${productCounter.toString().padStart(6, "0")}`;
};

// Base timestamp
let lastTimestamp = new Date("2025-12-18T21:24:50.029Z").getTime();
const getNextTimestamp = (): Timestamp => {
    lastTimestamp += 1;
    return Timestamp.fromDate(new Date(lastTimestamp));
};

/**
 * Create a new product
 * @param data - Partial product data to create
 * @returns Returns the complete Product object after creation
 */
export const createProductService = async (data: Partial<Product>): Promise<Product> => {
    try {
        const newId = generateProductId();
        const timestamp = getNextTimestamp();

        const newProduct: Product = {
        id: newId,
        name: data.name ?? "Unnamed Product",
        description: data.description ?? "",
        price: data.price ?? 0,
        stock: data.stock ?? 0,
        category: data.category ?? "general",
        createdAt: timestamp,
        updatedAt: timestamp,
        };

        // Firestore createDocument: collection, data, id
        await productRepository.createProduct<Product>("products", newProduct, newId);

        return newProduct;
    } catch (error: unknown) {
        if (error instanceof Error) {
        throw new Error(`Failed to create product: ${error.message}`);
        } else {
        throw new Error("Failed to create product: Unknown error");
        }
    }
};
/**
 * Retrieve all products
 * @returns Returns an array of all Products
 * @throws Throws an error if retrieval fails
 */
export const getAllProductsService = async (): Promise<Product[]> => {
    try {
        const allProducts = await productRepository.getProducts("products");
        return allProducts.docs.map((doc) => {
        const data = doc.data();

        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        } as Product;
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
        throw new Error(`Failed to retrieve products: ${error.message}`);
        } else {
        throw new Error("Failed to retrieve products: Unknown error");
        }
    }
};

/**
 * Retrieve a single product by ID
 * @param id - Product ID
 * @returns Returns the Product object if found, otherwise null
 * @throws Throws an error if retrieval fails
 */
export const getProductService = async (id: string): Promise<Product | null> => {
    try {
        const product = await productRepository.getProductById(id);

        if (!product) return null;

        return product;

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to retrieve product: ${error.message}`);
        } else {
            throw new Error("Failed to retrieve product: Unknown error");
        }
    }
};

/**
 * Update an existing product by ID
 * @param id - Product ID
 * @param data - Partial product data to update
 * @returns Returns the updated Product object, or null if product does not exist
 * @throws Throws an error if update fails
 */
export const updateProductService = async (
    id: string,
    data: Partial<Product>
): Promise<Product | null> => {
    try {
        const product = await productRepository.getProductById(id);

        if (!product) return null;

        const updatedProduct: Product = {
            ...product,
            ...data,
            updatedAt: Timestamp.now()
        };

        await productRepository.updateProduct("products", id, updatedProduct);

        return updatedProduct;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to update product: ${error.message}`);
        } else {
            throw new Error("Failed to update product: Unknown error");
        }
    }
};

/**
 * Delete a product by ID
 * @param id - Product ID
 * @returns Returns the deleted Product object, or null if product does not exist
 * @throws Throws an error if deletion fails
 */
export const deleteProduct = async (id: string): Promise<Product | null> => {
    try {
        const product = await productRepository.getProductById(id);
        if (!product) return null;

        const deletedProduct: Product = {
            ...product
        };

        await productRepository.deleteProduct("products", id);
        return deletedProduct;
    } catch (error: unknown) {
        if (error instanceof Error) {
        throw new Error(`Failed to delete product: ${error.message}`);
        } else {
        throw new Error("Failed to delete product: Unknown error");
        }
    }
};
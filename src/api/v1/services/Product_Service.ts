// src/service/productService.ts
import { Product } from "../models/Product_Model";
import { productRepository } from "../repositories/Product_Repository"; 
import { Timestamp } from "firebase-admin/firestore";

/**
 * Service to handle product creation logic
 * - Adds timestamps
 * - Calls repository to persist product
 * @param productData - Product info from request
 * @returns Newly created product
 */
export const createProductService = async (productData: Product): Promise<Product> => {
    const newProduct: Product = {
        ...productData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    };

    // Call repository to create file and get ID
    const id = await productRepository.createProduct<Product>("products", newProduct);

    return { ...newProduct, id }; // return Product with id
};
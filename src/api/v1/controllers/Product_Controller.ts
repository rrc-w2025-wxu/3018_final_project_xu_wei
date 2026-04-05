import { Request, Response } from "express";
import { createProductService } from "../services/Product_Service"; // 调整路径
import { Product } from "../models/Product_Model";

/**
 * Controller to handle creating a new product
 * - Calls service to create product
 * - Returns 201 with the created product
 */
export const createProductController = async (req: Request, res: Response): Promise<void> => {
    try {
        const productData: Product = req.body; // Get data from request

        // Call service to create product
        const newProduct = await createProductService(productData);

        res.status(201).json({
            message: "Product created successfully",
            data: newProduct,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Failed to create product", error: errorMessage });
    }
};

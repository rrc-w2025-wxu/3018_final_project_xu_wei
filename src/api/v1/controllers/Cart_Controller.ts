import { Request, Response } from "express";
import { getCartService, addToCartService, updateItemService, deleteItemService } from "../services/Cart_Service";

const MOCK_USER_ID = "user_001";

// Get product in cart
export async function getCartController(req:Request, res:Response) {
    try {
        const result = await getCartService(MOCK_USER_ID);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "get cart failed" });
    }
}

// Add product to cart
export async function addToCartController(req:Request, res:Response) {
    try {
        const { productId, quantity } = req.body;

        const result = await addToCartService(
        MOCK_USER_ID,
        productId,
        quantity
        );

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "add to cart failed" });
    }
}

// Update the quantity
export async function updateItemController(req:Request, res:Response) {
    try {
        const { productId, quantity } = req.body;

        const result = await updateItemService(
        MOCK_USER_ID,
        productId,
        quantity
        );

        if (!result) {
        return res.status(404).json({ message: "item not found" });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "update failed" });
    }
}

// Delete product
export async function deleteItemController(req:Request, res:Response) {
    try {
        const { productId } = req.params  as { productId: string };

        const result = await deleteItemService(
        MOCK_USER_ID,
        productId
        );

        if (!result) {
        return res.status(404).json({ message: "item not found" });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "delete failed" });
    }
}

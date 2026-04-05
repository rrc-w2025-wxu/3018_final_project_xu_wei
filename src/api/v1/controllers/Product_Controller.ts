import { Request, Response } from "express";

// Create a product
export const createProductController = (req: Request, res: Response): void => {
    // mock
    res.status(201).json({
        message: "Product created successfully",
        data: req.body,
    });
}


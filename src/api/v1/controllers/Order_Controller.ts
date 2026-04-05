import { Request, Response } from "express";

// Create an order
export const createOrderController = (req: Request, res: Response): void => {
    // mock
    res.status(201).json({
        message: "Order created successfully",
        data: req.body,
    });
}

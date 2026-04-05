import { Request, Response } from "express";

// Create a payment order
export const createPaymentController = (req: Request, res: Response): void => {
    // mock
    res.status(201).json({
        message: "Payment created successfully",
        data: req.body,
    });
}

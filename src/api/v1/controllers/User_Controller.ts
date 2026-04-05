import { Request, Response } from "express";

// Create an user
export const createUserController = (req: Request, res: Response): void => {
    // mock
    res.status(201).json({
        message: "User created successfully",
        data: req.body,
    });
}
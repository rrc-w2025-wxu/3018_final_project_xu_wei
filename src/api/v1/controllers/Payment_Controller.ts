import { Request, Response } from "express";
import { 
    createPayment, 
    getAllPayments, 
    getPayment, 
    updatePayment, 
    deletePayment, 
    payOrderService 
} from "../services/Payment_Service";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Payment } from "../models/Payment_Model";

/**
 * Create a new payment
 * POST /api/v1/payments
 */
export const createPaymentController = async (req: Request, res: Response) => {
    try {
        const data: Partial<Payment> = req.body;

        const newPayment = await createPayment(data);

        res.status(HTTP_STATUS.CREATED).json({
        message: "Payment created",
        data: newPayment,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
        res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: error.message });
        } else {
        res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error" });
        }
    }
};

/**
 * Get all payments
 * GET /api/v1/payments
 */
export const getAllPaymentsController = async (
  req: Request,
  res: Response
): Promise<void> => {
    try {
        const payments = await getAllPayments();

        res.status(HTTP_STATUS.OK).json({
        message: "Payments retrieved",
        count: payments.length,
        data: payments,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
        res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: error.message });
        } else {
        res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error" });
        }
    }
};

/**
 * Get a single payment by ID
 * GET /api/v1/payments/:id
 */
export const getPaymentController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
    try {
        const id = req.params.id;

        if (!id) {
        return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "Payment ID is required" });
        }

        const payment = await getPayment(id);

        if (!payment) {
        return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "Payment not found" });
        }

        return res.status(HTTP_STATUS.OK).json({
        message: "Payment retrieved",
        data: payment,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
        return res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: error.message });
        } else {
        return res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error" });
        }
    }
};

/**
 * Update a payment by ID
 * PUT /api/v1/payments/:id
 */
export const updatePaymentController = async (
    req: Request<{ id: string }, {}, Partial<Payment>>,
    res: Response
    ): Promise<Response> => {
    try {
        const id = req.params.id;

        if (!id) {
        return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "Payment ID is required" });
        }

        const data: Partial<Payment> = req.body;

        const updatedPayment = await updatePayment(id, data);

        if (!updatedPayment) {
        return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "Payment not found" });
        }

        return res.status(HTTP_STATUS.OK).json({
        message: "Payment updated",
        data: updatedPayment,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
        return res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: error.message });
        } else {
        return res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error" });
        }
    }
};

/**
 * Delete a payment by ID
 * DELETE /api/v1/payments/:id
 */
export const deletePaymentController = async (
    req: Request<{ id: string }>,
    res: Response
    ): Promise<Response> => {
    try {
        const id = req.params.id;

        if (!id) {
        return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "Payment ID is required" });
        }

        const deletedPayment = await deletePayment(id);

        if (!deletedPayment) {
        return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "Payment not found" });
        }

        return res.status(HTTP_STATUS.OK).json({
        message: "Payment deleted",
        data: deletedPayment,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
        return res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: error.message });
        } else {
        return res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: "Unknown error" });
        }
    }
};

/**
 * Process payment for an order
 * POST /pay
 * Requires: orderId, userId in request body
 */
export const payOrderController = async (req: Request, res: Response) => {
  try {
    const { orderId, userId } = req.body;

        if (!orderId || !userId) {
            return res.status(400).json({ message: "orderId and userId are required" });
        }

    const result = await payOrderService(orderId, userId);

    res.json(result);
  } catch (err) {
    console.error("🔥 CONTROLLER ERROR:", err); // 这里会打印具体错误信息
    res.status(500).json({
      message: "Payment failed",
      error: err instanceof Error ? err.message : err
    });
  }
};

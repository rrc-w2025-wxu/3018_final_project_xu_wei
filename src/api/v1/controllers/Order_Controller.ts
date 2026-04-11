import { Request, Response } from "express";
import * as Service from "../services/Order_Service";
import { ValidationError } from "joi";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Order } from "../models/Order_Model";

/**
 * Create a new order
 * POST /api/v1/orders
 */
export const createOrderController = async (req: Request, res: Response) => {
  try {
    const newOrder = await Service.createOrderService(req.body);

    res.status(HTTP_STATUS.CREATED).json({
      message: "Order created",
      data: newOrder,
    });
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      const firstMessage = error.details[0]?.message ?? "Validation error";
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: firstMessage });
    } else if (error instanceof Error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
    } else {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Unknown error" });
    }
  }
};

/**
 * Get all orders
 * GET /api/v1/orders
 */
export const getAllOrdersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const allOrders = await Service.getAllOrdersService();
    const count = allOrders.length;
    res.status(HTTP_STATUS.OK).json({
      message: "Orders retrieved",
      count,
      data: allOrders,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
    } else {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Unknown error" });
    }
  }
};

/**
 * Get a single order by ID
 * GET /api/v1/orders/:id
 */
export const getOrderController = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Order ID is required" });
    }

    const order = await Service.getOrderService(id);
    if (!order) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Order not found" });
    }

    return res.status(HTTP_STATUS.OK).json({ message: "Order retrieved", data: order });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
    } else {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Unknown error" });
    }
  }
};

/**
 * Update an order by ID
 * PUT /api/v1/orders/:id
 */
export const updateOrderController = async (
  req: Request<{ id: string }, {}, Partial<Order>>,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Order ID is required" });
    }

    const data: Partial<Order> = req.body;
    const updatedOrder = await Service.updateOrderService(id, data);

    if (!updatedOrder) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Order not found" });
    }

    return res.status(HTTP_STATUS.OK).json({ message: "Order updated", data: updatedOrder });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
    } else {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Unknown error" });
    }
  }
};

/**
 * Delete an order by ID
 * DELETE /api/v1/orders/:id
 */
export const deleteOrderController = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Order ID is required" });
    }

    const deletedOrder = await Service.deleteOrderService(id);
    if (!deletedOrder) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Order not found" });
    }

    return res.status(HTTP_STATUS.OK).json({ message: "Order deleted", data: deletedOrder });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
    } else {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Unknown error" });
    }
  }
};
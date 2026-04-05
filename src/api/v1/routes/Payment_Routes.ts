import express from "express";
import { createPaymentController } from "../controllers/Payment_Controller";

const router = express.Router();

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Process a payment
 *     description: Create a new payment record for an order
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - userId
 *               - amount
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID of the order being paid
 *                 example: "order-123"
 *               userId:
 *                 type: string
 *                 description: ID of the user making the payment
 *                 example: "user-456"
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *                 example: 99.99
 *               method:
 *                 type: string
 *                 description: Payment method
 *                 enum: [paypal, credit_card, other]
 *                 example: "paypal"
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Payment record ID
 *                       example: "payment-123"
 *                     orderId:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     status:
 *                       type: string
 *                       description: Payment status
 *                       example: "success"
 *       400:
 *         description: Missing required fields or payment failed
 */
router.post("/payments", createPaymentController)


export default router;
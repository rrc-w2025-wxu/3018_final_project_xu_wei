import express from "express";
import { getCartController, addToCartController, updateItemController, deleteItemController } from "../controllers/Cart_Controller";


const Cart_router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user in the system
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
Cart_router.get("/", getCartController);


Cart_router.post("/add", addToCartController);


Cart_router.put("/update", updateItemController);


Cart_router.delete("/:productId", deleteItemController);

export default Cart_router;

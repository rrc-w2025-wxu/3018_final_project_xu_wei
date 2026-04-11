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

/**
 * @swagger
 * /api/v1/cart/add:
 *   post:
 *     summary: Add a product to the shopping cart
 *     description: Adds a product to the user's cart. If the product already exists in the cart, its quantity will be increased.
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "p123"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added or quantity updated successfully
 *       500:
 *         description: Internal server error
 */
Cart_router.post("/add", addToCartController);

/**
 * @swagger
 * /api/v1/cart/update:
 *   put:
 *     summary: Update quantity of a product in the cart
 *     description: Updates the quantity of an existing product in the user's cart.
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "p123"
 *               quantity:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       404:
 *         description: Item not found in cart
 *       500:
 *         description: Internal server error
 */
Cart_router.put("/update", updateItemController);

/**
 * @swagger
 * /api/v1/cart/{productId}:
 *   delete:
 *     summary: Remove a product from the cart
 *     description: Deletes a specific product from the user's shopping cart.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found in cart
 *       500:
 *         description: Internal server error
 */
Cart_router.delete("/:productId", deleteItemController);

export default Cart_router;

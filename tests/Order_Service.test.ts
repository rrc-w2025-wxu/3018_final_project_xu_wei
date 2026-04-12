
import {
    createOrderService,
    getAllOrdersService,
    getOrderService,
    updateOrderService,
    deleteOrderService,
    createOrderFromCartService
} from "../src/api/v1/services/Order_Service";

import * as firestoreRepository from "../src/api/v1/repositories/Order_Repository";
import { getProductById } from "../src/api/v1/repositories/Product_Repository";
import { getByUserId as getCartByUserId } from "../src/api/v1/repositories/Cart_Repository";
import { getByCartId } from "../src/api/v1/repositories/CartItem_Repository";

jest.mock("../src/api/v1/repositories/Order_Repository");
jest.mock("../src/api/v1/repositories/Product_Repository");
jest.mock("../src/api/v1/repositories/Cart_Repository");
jest.mock("../src/api/v1/repositories/CartItem_Repository");

describe("Order Service Unit Tests", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // =========================
    // CREATE ORDER
    // =========================
    describe("createOrderService", () => {
        it("should create order successfully", async () => {
            (firestoreRepository.createOrder as jest.Mock).mockResolvedValue(true);

            const result = await createOrderService({
                userId: "user1",
                items: [
                    { productId: "p1", quantity: 2, price: 10 }
                ]
            });

            expect(result.id).toBeDefined();
            expect(result.total).toBe(20);
            expect(result.status).toBe("pending");
            expect(firestoreRepository.createOrder).toHaveBeenCalledTimes(1);
        });

        it("should throw error when missing userId", async () => {
            await expect(
                createOrderService({ items: [] })
            ).rejects.toThrow("userId is required");
        });

        it("should throw error when items empty", async () => {
            await expect(
                createOrderService({ userId: "u1", items: [] })
            ).rejects.toThrow("items are required");
        });
    });

    // =========================
    // GET ALL
    // =========================
    describe("getAllOrdersService", () => {
        it("should return all orders", async () => {
            (firestoreRepository.getOrders as jest.Mock).mockResolvedValue({
                docs: [
                    {
                        id: "order_000001",
                        data: () => ({
                            userId: "u1",
                            items: [],
                            total: 0,
                            status: "pending"
                        })
                    }
                ]
            });

            const result = await getAllOrdersService();

            expect(result.length).toBe(1);
            expect(result[0].id).toBe("order_000001");
        });

        it("should throw error on failure", async () => {
            (firestoreRepository.getOrders as jest.Mock).mockRejectedValue(
                new Error("DB error")
            );

            await expect(getAllOrdersService())
                .rejects
                .toThrow("Failed to retrieve orders: DB error");
        });
    });

    // =========================
    // GET ONE
    // =========================
    describe("getOrderService", () => {
        it("should return order by id", async () => {
            (firestoreRepository.getOrderById as jest.Mock).mockResolvedValue({
                id: "order_1",
                exists: true,
                data: () => ({
                    userId: "u1",
                    items: [],
                    total: 100,
                    status: "pending"
                })
            });

            const result = await getOrderService("order_1");

            expect(result?.id).toBe("order_1");
        });

        it("should return null if not found", async () => {
            (firestoreRepository.getOrderById as jest.Mock).mockResolvedValue({
                exists: false
            });

            const result = await getOrderService("bad");

            expect(result).toBeNull();
        });
    });

    // =========================
    // UPDATE
    // =========================
    describe("updateOrderService", () => {
        it("should update order successfully", async () => {
            (firestoreRepository.getOrderById as jest.Mock).mockResolvedValue({
                id: "order_1",
                exists: true,
                data: () => ({
                    userId: "u1",
                    items: [],
                    total: 100,
                    status: "pending"
                })
            });

            (firestoreRepository.updateOrder as jest.Mock).mockResolvedValue(true);

            const result = await updateOrderService("order_1", {
                status: "paid"
            });

            expect(result?.status).toBe("paid");
            expect(firestoreRepository.updateOrder).toHaveBeenCalledTimes(1);
        });

        it("should return null if order not exists", async () => {
            (firestoreRepository.getOrderById as jest.Mock).mockResolvedValue({
                exists: false
            });

            const result = await updateOrderService("x", {
                status: "paid"
            });

            expect(result).toBeNull();
        });
    });

    // =========================
    // DELETE
    // =========================
    describe("deleteOrderService", () => {
        it("should delete order successfully", async () => {
            (firestoreRepository.getOrderById as jest.Mock).mockResolvedValue({
                id: "order_1",
                exists: true,
                data: () => ({
                    userId: "u1",
                    items: [],
                    total: 100,
                    status: "pending"
                })
            });

            (firestoreRepository.deleteOrder as jest.Mock).mockResolvedValue(true);

            const result = await deleteOrderService("order_1");

            expect(result?.id).toBe("order_1");
            expect(firestoreRepository.deleteOrder).toHaveBeenCalledTimes(1);
        });

        it("should return null if not found", async () => {
            (firestoreRepository.getOrderById as jest.Mock).mockResolvedValue({
                exists: false
            });

            const result = await deleteOrderService("bad");

            expect(result).toBeNull();
        });
    });

    // =========================
    // CART -> ORDER
    // =========================
    describe("createOrderFromCartService", () => {
        it("should create order from cart", async () => {
            (getCartByUserId as jest.Mock).mockResolvedValue({
                id: "cart1"
            });

            (getByCartId as jest.Mock).mockResolvedValue([
                { productId: "p1", quantity: 2 }
            ]);

            (getProductById as jest.Mock).mockResolvedValue({
                id: "p1",
                price: 50
            });

            (firestoreRepository.createOrder as jest.Mock).mockResolvedValue(true);

            const result = await createOrderFromCartService("user1");

            expect(result.total).toBe(100);
            expect(result.items.length).toBe(1);
        });

        it("should throw if cart not found", async () => {
            (getCartByUserId as jest.Mock).mockResolvedValue(null);

            await expect(
                createOrderFromCartService("user1")
            ).rejects.toThrow("Cart not found");
        });

        it("should throw if cart empty", async () => {
            (getCartByUserId as jest.Mock).mockResolvedValue({ id: "c1" });
            (getByCartId as jest.Mock).mockResolvedValue([]);

            await expect(
                createOrderFromCartService("user1")
            ).rejects.toThrow("Cart is empty");
        });

        it("should throw if product missing", async () => {
            (getCartByUserId as jest.Mock).mockResolvedValue({ id: "c1" });

            (getByCartId as jest.Mock).mockResolvedValue([
                { productId: "p1", quantity: 1 }
            ]);

            (getProductById as jest.Mock).mockResolvedValue(null);

            await expect(
                createOrderFromCartService("user1")
            ).rejects.toThrow("Product not found: p1");
        });
    });
});
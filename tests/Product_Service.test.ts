import {
  createProductService,
  getAllProductsService,
  getProductService,
  updateProductService,
  deleteProduct,
} from "../src/api/v1/services/Product_Service";

import { productRepository } from "../src/api/v1/repositories/Product_Repository";
import { Timestamp } from "firebase-admin/firestore";

// Mock repository
jest.mock("../src/api/v1/repositories/Product_Repository", () => ({
    productRepository: {
        createProduct: jest.fn(),
        getProducts: jest.fn(),
        getProductById: jest.fn(),
        updateProduct: jest.fn(),
        deleteProduct: jest.fn(),
    }
}));

describe("Product Service Unit Tests", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // =========================
    // createProductService
    // =========================
    describe("createProductService", () => {
        it("should create a product successfully", async () => {
            (productRepository.createProduct as jest.Mock).mockResolvedValue(true);

            const data = {
                name: "iPhone",
                description: "Apple phone",
                price: 1000,
                stock: 10,
                category: "electronics"
            };

            const result = await createProductService(data);

            expect(result).toHaveProperty("id");
            expect(result.name).toBe("iPhone");
            expect(productRepository.createProduct).toHaveBeenCalledTimes(1);
        });

        it("should handle error when create fails", async () => {
            (productRepository.createProduct as jest.Mock).mockRejectedValue(
                new Error("DB error")
            );

            await expect(
                createProductService({ name: "test" })
            ).rejects.toThrow("Failed to create product: DB error");
        });
    });

    // =========================
    // getAllProductsService
    // =========================
    describe("getAllProductsService", () => {
        it("should return all products", async () => {
            const mockDocs = {
                docs: [
                    {
                        id: "prod_000001",
                        data: () => ({
                            name: "A",
                            price: 10,
                            createdAt: Timestamp.now(),
                            updatedAt: Timestamp.now()
                        })
                    }
                ]
            };

            (productRepository.getProducts as jest.Mock).mockResolvedValue(mockDocs);

            const result = await getAllProductsService();

            expect(result.length).toBe(1);
            expect(result[0].id).toBe("prod_000001");
        });

        it("should throw error when fetch fails", async () => {
            (productRepository.getProducts as jest.Mock).mockRejectedValue(
                new Error("DB error")
            );

            await expect(getAllProductsService()).rejects.toThrow(
                "Failed to retrieve products: DB error"
            );
        });
    });

    // =========================
    // getProductService
    // =========================
    describe("getProductService", () => {
        it("should return product by id", async () => {
            (productRepository.getProductById as jest.Mock).mockResolvedValue({
                id: "prod_000001",
                name: "Test Product"
            });

            const result = await getProductService("prod_000001");

            expect(result).not.toBeNull();
            expect(result?.name).toBe("Test Product");
        });

        it("should return null if product not found", async () => {
            (productRepository.getProductById as jest.Mock).mockResolvedValue(null);

            const result = await getProductService("not_exist");

            expect(result).toBeNull();
        });
    });

    // =========================
    // updateProductService
    // =========================
    describe("updateProductService", () => {
        it("should update product successfully", async () => {
            (productRepository.getProductById as jest.Mock).mockResolvedValue({
                id: "prod_000001",
                name: "Old"
            });

            (productRepository.updateProduct as jest.Mock).mockResolvedValue(true);

            const result = await updateProductService("prod_000001", {
                name: "New Name"
            });

            expect(result?.name).toBe("New Name");
            expect(productRepository.updateProduct).toHaveBeenCalledTimes(1);
        });

        it("should return null if product not exists", async () => {
            (productRepository.getProductById as jest.Mock).mockResolvedValue(null);

            const result = await updateProductService("invalid", {
                name: "New"
            });

            expect(result).toBeNull();
        });
    });

    // =========================
    // deleteProduct
    // =========================
    describe("deleteProduct", () => {
        it("should delete product successfully", async () => {
            (productRepository.getProductById as jest.Mock).mockResolvedValue({
                id: "prod_000001",
                name: "To Delete"
            });

            (productRepository.deleteProduct as jest.Mock).mockResolvedValue(true);

            const result = await deleteProduct("prod_000001");

            expect(result?.id).toBe("prod_000001");
            expect(productRepository.deleteProduct).toHaveBeenCalledTimes(1);
        });

        it("should return null if product not found", async () => {
            (productRepository.getProductById as jest.Mock).mockResolvedValue(null);

            const result = await deleteProduct("wrong");

            expect(result).toBeNull();
        });
    });
});
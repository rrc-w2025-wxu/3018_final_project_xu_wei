import { createProductService } from "../src/api/v1/services/Product_Service";
import { productRepository } from "../src/api/v1/repositories/Product_Repository";
import { Product } from "../src/api/v1/models/Product_Model";
import { Timestamp } from "firebase-admin/firestore";

// Mock repository
jest.mock("../src/api/v1/repositories/Product_Repository");

describe("createProductService", () => {
    it("should create a product and return the new product with id and timestamps", async () => {
        // Mock the repository function to return a fake ID
        (productRepository.createProduct as jest.Mock).mockResolvedValue("mocked-id");

        const productData: Product = {
            name: "Test Product",
            description: "A product for testing",
            price: 99.99,
            stock: 10,
            category: "Test Category",
        };

        const result = await createProductService(productData);

        expect(result.id).toBe("mocked-id"); // 返回的 id
        expect(result.name).toBe(productData.name);
        expect(result.createdAt).toBeInstanceOf(Timestamp); // 确认是 Timestamp
        expect(result.updatedAt).toBeInstanceOf(Timestamp);
    });

    it("should throw an error if repository fails", async () => {
        (productRepository.createProduct as jest.Mock).mockRejectedValue(new Error("DB error"));

        const productData: Product = {
            name: "Fail Product",
            description: "Will fail",
            price: 50,
            stock: 5,
        };

        await expect(createProductService(productData)).rejects.toThrow("DB error");
    });
});
import {
  createProductService,
  getAllProductsService,
  getProductService,
  updateProductService,
  deleteProduct,
} from "../src/api/v1/services/Product_Service";

import { productRepository } from "../src/api/v1/repositories/Product_Repository";
import { Timestamp } from "firebase-admin/firestore";

// mock repository
jest.mock("../src/api/v1/repositories/Product_Repository");

describe("Product Service", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * CREATE
   */
  it("should create a product", async () => {
    (productRepository.createProduct as jest.Mock).mockResolvedValue({});

    const result = await createProductService({
      name: "Test Product",
      description: "Test Desc",
      price: 10,
      stock: 5,
    });

    expect(result.name).toBe("Test Product");
    expect(result.id).toBeDefined();
    expect(productRepository.createProduct).toHaveBeenCalled();
  });

  /**
   * GET ALL
   */
  it("should return all products", async () => {
    const mockDocs = [
      {
        id: "prod_000001",
        data: () => ({
          name: "Product 1",
          description: "Desc",
          price: 10,
          stock: 5,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }),
      },
    ];

    (productRepository.getProducts as jest.Mock).mockResolvedValue({
      docs: mockDocs,
    });

    const result = await getAllProductsService();

    expect(result.length).toBe(1);
    expect(result[0].name).toBe("Product 1");
  });

  /**
   * GET BY ID
   */
  it("should return a product by id", async () => {
    (productRepository.getProductById as jest.Mock).mockResolvedValue({
      id: "prod_000001",
      exists: true,
      data: () => ({
        name: "Product 1",
        description: "Desc",
        price: 10,
        stock: 5,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }),
    });

    const result = await getProductService("prod_000001");

    expect(result).not.toBeNull();
    expect(result?.name).toBe("Product 1");
  });

  it("should return null if product not found", async () => {
    (productRepository.getProductById as jest.Mock).mockResolvedValue({
      exists: false,
    });

    const result = await getProductService("invalid_id");

    expect(result).toBeNull();
  });

  /**
   * UPDATE
   */
  it("should update a product", async () => {
    (productRepository.getProductById as jest.Mock).mockResolvedValue({
      id: "prod_000001",
      exists: true,
      data: () => ({
        name: "Old",
        description: "Old desc",
        price: 10,
        stock: 5,
        createdAt: Timestamp.now(),
      }),
    });

    (productRepository.updateProduct as jest.Mock).mockResolvedValue(undefined);

    const result = await updateProductService("prod_000001", {
      name: "Updated",
    });

    expect(result).not.toBeNull();
    expect(result?.name).toBe("Updated");
    expect(productRepository.updateProduct).toHaveBeenCalled();
  });

  it("should return null if update product not found", async () => {
    (productRepository.getProductById as jest.Mock).mockResolvedValue({
      exists: false,
    });

    const result = await updateProductService("invalid_id", { name: "Test" });

    expect(result).toBeNull();
  });

  /**
   * DELETE
   */
  it("should delete a product", async () => {
    (productRepository.getProductById as jest.Mock).mockResolvedValue({
      id: "prod_000001",
      exists: true,
      data: () => ({
        name: "Product",
        description: "Desc",
        price: 10,
        stock: 5,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }),
    });

    (productRepository.deleteProduct as jest.Mock).mockResolvedValue(undefined);

    const result = await deleteProduct("prod_000001");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("prod_000001");
    expect(productRepository.deleteProduct).toHaveBeenCalled();
  });

  it("should return null if delete product not found", async () => {
    (productRepository.getProductById as jest.Mock).mockResolvedValue({
      exists: false,
    });

    const result = await deleteProduct("invalid_id");

    expect(result).toBeNull();
  });

});
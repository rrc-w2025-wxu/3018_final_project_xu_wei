// src/services/__tests__/Order_Service.test.ts
import * as Service from "../src/api/v1/services/Order_Service";
import * as firestoreRepository from "../src/api/v1/repositories/Order_Repository";
import { Order } from "../src/api/v1/models/Order_Model";
import { OrderItem } from "../src/api/v1/models/Order_Item_Model";
import { Timestamp } from "firebase-admin/firestore";

// Mock the Firestore repository
jest.mock("../src/api/v1/repositories/Order_Repository");

describe("Order Service", () => {
  const mockOrder: Order = {
    id: "order_000001",
    userId: "user_123",
    items: [{ productId: "prod_1", quantity: 2 } as OrderItem],
    total: 100,
    status: "pending",
    paymentId: "pay_123",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==========================
  // createOrderService
  // ==========================
  it("should create a new order", async () => {
    (firestoreRepository.createOrder as jest.Mock).mockResolvedValueOnce(true);

    const data: Partial<Order> = {
      userId: "user_123",
      items: [{ productId: "prod_1", quantity: 2 } as OrderItem],
      total: 100,
    };

    const created = await Service.createOrderService(data);

    expect(created.id).toMatch(/^order_\d{6}$/);
    expect(created.userId).toBe(data.userId);
    expect(created.items).toEqual(data.items);
    expect(created.total).toBe(data.total);
    expect(firestoreRepository.createOrder).toHaveBeenCalledTimes(1);
  });

  // ==========================
  // getAllOrdersService
  // ==========================
  it("should retrieve all orders", async () => {
    const mockDocs = [
      {
        id: "order_000001",
        data: () => mockOrder,
      },
      {
        id: "order_000002",
        data: () => ({ ...mockOrder, id: "order_000002" }),
      },
    ];
    (firestoreRepository.getOrders as jest.Mock).mockResolvedValueOnce({ docs: mockDocs });

    const result = await Service.getAllOrdersService();

    expect(result.length).toBe(2);
    expect(result[0].id).toBe("order_000001");
    expect(firestoreRepository.getOrders).toHaveBeenCalledWith("orders");
  });

  // ==========================
  // getOrderService
  // ==========================
  it("should retrieve an order by ID", async () => {
    const mockDoc = {
      id: mockOrder.id,
      exists: true,
      data: () => mockOrder,
    };
    (firestoreRepository.getOrderById as jest.Mock).mockResolvedValueOnce(mockDoc);

    const result = await Service.getOrderService(mockOrder.id!);

    expect(result).not.toBeNull();
    expect(result!.id).toBe(mockOrder.id);
    expect(firestoreRepository.getOrderById).toHaveBeenCalledWith("orders", mockOrder.id);
  });

  it("should return null if order does not exist", async () => {
    (firestoreRepository.getOrderById as jest.Mock).mockResolvedValueOnce({ exists: false });

    const result = await Service.getOrderService("non_existing_id");
    expect(result).toBeNull();
  });

  // ==========================
  // updateOrderService
  // ==========================
  it("should update an existing order", async () => {
    const mockDoc = {
      id: mockOrder.id,
      exists: true,
      data: () => mockOrder,
    };
    (firestoreRepository.getOrderById as jest.Mock).mockResolvedValueOnce(mockDoc);
    (firestoreRepository.updateOrder as jest.Mock).mockResolvedValueOnce(true);

    const updatedData: Partial<Order> = { status: "paid" };
    const updated = await Service.updateOrderService(mockOrder.id!, updatedData);

    expect(updated!.status).toBe("paid");
    expect(firestoreRepository.updateOrder).toHaveBeenCalledWith("orders", mockOrder.id, expect.any(Object));
  });

  it("should return null if order to update does not exist", async () => {
    (firestoreRepository.getOrderById as jest.Mock).mockResolvedValueOnce({ exists: false });
    const result = await Service.updateOrderService("non_existing_id", { status: "paid" });
    expect(result).toBeNull();
  });

  // ==========================
  // deleteOrderService
  // ==========================
  it("should delete an existing order", async () => {
    const mockDoc = {
      id: mockOrder.id,
      exists: true,
      data: () => mockOrder,
    };
    (firestoreRepository.getOrderById as jest.Mock).mockResolvedValueOnce(mockDoc);
    (firestoreRepository.deleteOrder as jest.Mock).mockResolvedValueOnce(true);

    const deleted = await Service.deleteOrderService(mockOrder.id!);
    expect(deleted!.id).toBe(mockOrder.id);
    expect(firestoreRepository.deleteOrder).toHaveBeenCalledWith("orders", mockOrder.id);
  });

  it("should return null if order to delete does not exist", async () => {
    (firestoreRepository.getOrderById as jest.Mock).mockResolvedValueOnce({ exists: false });
    const result = await Service.deleteOrderService("non_existing_id");
    expect(result).toBeNull();
  });
});
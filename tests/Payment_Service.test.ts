import {
  createPayment,
  getAllPayments,
  getPayment,
  updatePayment,
  deletePayment,
} from "../src/api/v1/services/Payment_Service";

import * as paymentRepository from "../src/api/v1/repositories/Payment_Repository";
import { Timestamp } from "firebase-admin/firestore";

// Mock repository
jest.mock("../src/api/v1/repositories/Payment_Repository");

describe("Payment Service", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // CREATE
  // =========================
  it("should create a payment", async () => {
    (paymentRepository.createPayment as jest.Mock).mockResolvedValue(true);

    const result = await createPayment({
      orderId: "order_1",
      userId: "user_1",
      amount: 100,
      method: "paypal",
      status: "success",
    });

    expect(result).toHaveProperty("id");
    expect(result.orderId).toBe("order_1");
    expect(paymentRepository.createPayment).toHaveBeenCalled();
  });

  // =========================
  // GET ALL
  // =========================
  it("should retrieve all payments", async () => {
    const mockDocs = [
      {
        id: "pay_1",
        data: () => ({
          orderId: "order_1",
          userId: "user_1",
          amount: 100,
          method: "paypal",
          status: "success",
          timestamp: Timestamp.now(),
        }),
      },
    ];

    (paymentRepository.getPayments as jest.Mock).mockResolvedValue({
      docs: mockDocs,
    });

    const result = await getAllPayments();

    expect(result.length).toBe(1);
    expect(result[0].orderId).toBe("order_1");
  });

  // =========================
  // GET ONE
  // =========================
  it("should retrieve a single payment", async () => {
    (paymentRepository.getPaymentById as jest.Mock).mockResolvedValue({
      exists: true,
      id: "pay_1",
      data: () => ({
        orderId: "order_1",
        userId: "user_1",
        amount: 100,
        method: "paypal",
        status: "success",
        timestamp: Timestamp.now(),
      }),
    });

    const result = await getPayment("pay_1");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("pay_1");
  });

  it("should return null if payment not found", async () => {
    (paymentRepository.getPaymentById as jest.Mock).mockResolvedValue(null);

    const result = await getPayment("invalid_id");

    expect(result).toBeNull();
  });

  // =========================
  // UPDATE
  // =========================
  it("should update a payment", async () => {
    (paymentRepository.getPaymentById as jest.Mock).mockResolvedValue({
      exists: true,
      id: "pay_1",
      data: () => ({
        orderId: "order_1",
        userId: "user_1",
        amount: 100,
        method: "paypal",
        status: "success",
      }),
    });

    (paymentRepository.updatePayment as jest.Mock).mockResolvedValue(true);

    const result = await updatePayment("pay_1", {
      amount: 200,
    });

    expect(result?.amount).toBe(200);
    expect(paymentRepository.updatePayment).toHaveBeenCalled();
  });

  it("should return null when updating non-existing payment", async () => {
    (paymentRepository.getPaymentById as jest.Mock).mockResolvedValue(null);

    const result = await updatePayment("invalid", { amount: 200 });

    expect(result).toBeNull();
  });

  // =========================
  // DELETE
  // =========================
  it("should delete a payment", async () => {
    (paymentRepository.getPaymentById as jest.Mock).mockResolvedValue({
      exists: true,
      id: "pay_1",
      data: () => ({
        orderId: "order_1",
        userId: "user_1",
        amount: 100,
        method: "paypal",
        status: "success",
        timestamp: Timestamp.now(),
      }),
    });

    (paymentRepository.deletePayment as jest.Mock).mockResolvedValue(true);

    const result = await deletePayment("pay_1");

    expect(result?.id).toBe("pay_1");
    expect(paymentRepository.deletePayment).toHaveBeenCalled();
  });

  it("should return null when deleting non-existing payment", async () => {
    (paymentRepository.getPaymentById as jest.Mock).mockResolvedValue(null);

    const result = await deletePayment("invalid");

    expect(result).toBeNull();
  });

});
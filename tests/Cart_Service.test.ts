import {
  getCartService,
  addToCartService,
  updateItemService,
  deleteItemService
} from "../src/api/v1/services/Cart_Service";

import {
  getByUserId,
  createCart
} from "../src/api/v1/repositories/Cart_Repository";

import {
  getByCartId,
  updateItem,
  deleteItem
} from "../src/api/v1/repositories/CartItem_Repository";

// mock repository
jest.mock("../src/api/v1/repositories/Cart_Repository");
jest.mock("../src/api/v1/repositories/CartItem_Repository");

const mockUserId = "user_001";

describe("Cart Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // getCartService
  describe("getCartService", () => {
    it("should return empty cart when cart not found", async () => {

      (getByUserId as jest.Mock).mockResolvedValue(null);

      const result = await getCartService(mockUserId);

      expect(result).toEqual({
        userId: mockUserId,
        items: []
      });
    });

    it("should return cart with items", async () => {

      (getByUserId as jest.Mock).mockResolvedValue({ id: "cart1" });
      (getByCartId as jest.Mock).mockResolvedValue([
        { id: "item1", productId: "p1", quantity: 2 }
      ]);

      const result = await getCartService(mockUserId);

      expect(result.cartId).toBe("cart1");
      expect(result.items.length).toBe(1);
    });
  });

  // addToCartService
  describe("addToCartService", () => {

    it("should create new cart if not exist", async () => {

      (getByUserId as jest.Mock).mockResolvedValue(null);
      (createCart as jest.Mock).mockResolvedValue({ id: "cart1" });
      (getByCartId as jest.Mock).mockResolvedValue([]);

      const result = await addToCartService(mockUserId, "p1", 2);

      expect(createCart).toHaveBeenCalledWith(mockUserId);
      expect(result.message).toBe("item added");
    });

    it("should update quantity if item exists", async () => {

      (getByUserId as jest.Mock).mockResolvedValue({ id: "cart1" });

      (getByCartId as jest.Mock).mockResolvedValue([
        { id: "item1", productId: "p1", quantity: 2 }
      ]);

      const result = await addToCartService(mockUserId, "p1", 3);

      expect(updateItem).toHaveBeenCalledWith("item1", {
        quantity: 5
      });

      expect(result.message).toBe("quantity updated");
    });
  });

  // updateItemService
  describe("updateItemService", () => {

    it("should update item quantity", async () => {

      (getByUserId as jest.Mock).mockResolvedValue({ id: "cart1" });

      (getByCartId as jest.Mock).mockResolvedValue([
        { id: "item1", productId: "p1", quantity: 2 }
      ]);

      const result = await updateItemService(mockUserId, "p1", 10);

      expect(updateItem).toHaveBeenCalledWith("item1", {
        quantity: 10
      });

      expect((result as any).message).toBe("updated");
    });

    it("should return null if item not found", async () => {

      (getByUserId as jest.Mock).mockResolvedValue({ id: "cart1" });
      (getByCartId as jest.Mock).mockResolvedValue([]);

      const result = await updateItemService(mockUserId, "p1", 10);

      expect(result).toBeNull();
    });
  });

  // deleteItemService
  describe("deleteItemService", () => {

    it("should delete item", async () => {

      (getByUserId as jest.Mock).mockResolvedValue({ id: "cart1" });

      (getByCartId as jest.Mock).mockResolvedValue([
        { id: "item1", productId: "p1", quantity: 2 }
      ]);

      const result = await deleteItemService(mockUserId, "p1");

      expect(deleteItem).toHaveBeenCalledWith("item1");
      expect((result as any).message).toBe("deleted");
    });

    it("should return null if cart not found", async () => {

      (getByUserId as jest.Mock).mockResolvedValue(null);

      const result = await deleteItemService(mockUserId, "p1");

      expect(result).toBeNull();
    });
  });

});
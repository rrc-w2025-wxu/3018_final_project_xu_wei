import { createCart, getByUserId } from "../repositories/Cart_Repository";
import { getByCartId, addItem, updateItem, deleteItem } from "../repositories/CartItem_Repository";

const MOCK_USER_ID = "user_001";

type CartItem = {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
};

// Get cart
export async function getCartService(userId: string = MOCK_USER_ID) {

    const cart = await getByUserId(userId);

    if (!cart) {
    return {
        userId,
        items: []
    };
    }

    const items = await getByCartId(cart.id) as CartItem[];

    return {
    cartId: cart.id,
    userId,
    items
    };
}

// Add item to cart
export async function addToCartService(userId: string, productId: string, quantity: number) {

    // Find cart
    let cart = await getByUserId(userId);

    // Create a cart if it does not exist
    if (!cart) {
    cart = await createCart(userId);
    }

    // Get products that exist
    const items = await getByCartId(cart.id) as CartItem[];

    const existing = items.find(
    (item) => item.productId === productId
    );

    // If it is there, update the quantity
    if (existing) {
    await updateItem(existing.id, {
        quantity: existing.quantity + quantity
    });

    return { message: "quantity updated" };
    }

    // If it is not there, create the item
    await addItem({
    cartId: cart.id,
    productId,
    quantity,
    createdAt: new Date()
    });

    return { message: "item added" };
}

// Modify the quantity
export async function updateItemService(userId: string, productId: string, quantity: number) {

    const cart = await getByUserId(userId);
    if (!cart) return null;

    const items = await getByCartId(cart.id) as CartItem[];

    const item = items.find(i => i.productId === productId);

    if (!item) return null;

    await updateItem(item.id, {
    quantity
    });

    return { message: "updated" };
}

// Delete product 
export async function deleteItemService(userId: string, productId: string) {

    const cart = await getByUserId(userId);
    if (!cart) return null;

    const items = await getByCartId(cart.id) as CartItem[];

    const item = items.find(i => i.productId === productId);

    if (!item) return null;

    await deleteItem(item.id);

    return { message: "deleted" };
}
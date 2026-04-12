
/**
 * Order item model
 *
 * Represents a single product entry inside an order.
 * This is a snapshot of the purchased product at checkout time.
 *
 * Fields:
 * - productId: ID of the product being ordered
 * - quantity: Number of units ordered
 * - price: Unit price at the time of purchase (snapshot, not current price)
 */
export interface OrderItem {
    productId: string;  // Product ID
    quantity: number;   // Quantity ordered
    price: number;      // Unit price (snapshot at the time of order)
}
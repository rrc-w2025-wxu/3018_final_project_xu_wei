export interface OrderItem {
    productId: string;  // Product ID
    quantity: number;   // Quantity ordered
    price: number;      // Unit price (snapshot at the time of order)
}
import api from './api';

// Create a new order
export const createOrder = async (orderData) => {
  try {
    // Validate order data before sending to server
    if (!orderData.orderItems || !Array.isArray(orderData.orderItems) || orderData.orderItems.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    // Validate each order item
    orderData.orderItems.forEach((item, index) => {
      if (!item.product) {
        throw new Error(`Order item at index ${index} is missing product ID`);
      }
      if (!item.quantity || item.quantity < 1) {
        // Fix the quantity if it's invalid
        item.quantity = 1;
      }
    });

    // Validate shipping address
    if (!orderData.shippingAddress ||
        !orderData.shippingAddress.address ||
        !orderData.shippingAddress.city ||
        !orderData.shippingAddress.postalCode ||
        !orderData.shippingAddress.country) {
      throw new Error("Shipping address is incomplete");
    }

    // Validate total price
    if (!orderData.totalPrice || orderData.totalPrice <= 0) {
      throw new Error("Total price must be greater than 0");
    }

    // Send the validated order to the server
    const res = await api.post('/orders', orderData);
    return res.data;
  } catch (error) {
    console.error("Error in createOrder:", error.response?.data || error);
    throw error;
  }
};

// Get orders for the logged-in user
export const getUserOrders = async () => {
  try {
    console.log("Fetching orders using interceptor auth");
    const res = await api.get('/orders');

    console.log("Orders API response:", res);

    // Return the full response so we can check status and headers if needed
    return res;
  } catch (error) {
    console.error("Error in getUserOrders:", error.response?.data || error);
    throw error;
  }
};

// Get all orders (admin only)
export const getAllOrders = async () => {
  try {
    console.log("Fetching all orders using interceptor auth");
    const res = await api.get('/orders/all');

    console.log("All orders API response:", res);

    // Handle different response formats
    if (res.data && Array.isArray(res.data)) {
      return { data: res.data };
    } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return { data: res.data.data };
    } else if (res.data && res.data.success) {
      // If success but no data array, return empty array
      return { data: res.data.data || [] };
    } else {
      console.warn("Unexpected orders response format:", res.data);
      return { data: [] };
    }
  } catch (error) {
    console.error("Error in getAllOrders:", error.response?.data || error);
    return { data: [] };
  }
};

// Update order status and/or payment (admin only)
export const updateOrderStatusAndPayment = async (_id, updateData) => {
  try {
    const res = await api.put(`/orders/${_id}`, updateData);
    return res.data;
  } catch (error) {
    console.error("Error in updateOrderStatusAndPayment:", error.response?.data || error);
    throw error;
  }
};

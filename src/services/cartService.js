import api from './api';

/**
 * Get the user's cart from the server
 * @returns {Promise} Promise with the cart data
 */
export const getUserCart = async () => {
  try {
    const res = await api.get('/carts');
    return res.data;
  } catch (error) {
    console.error('Error fetching user cart:', error);
    throw error;
  }
};

/**
 * Save the cart to the server
 * @param {Array} cartItems - Array of cart items
 * @returns {Promise} Promise with the saved cart data
 */
export const saveCart = async (cartItems) => {
  try {
    const res = await api.post('/carts', { items: cartItems });
    return res.data;
  } catch (error) {
    console.error('Error saving cart:', error);
    throw error;
  }
};

/**
 * Add an item to the cart
 * @param {Object} item - The item to add to the cart
 * @returns {Promise} Promise with the updated cart data
 */
export const addItemToCart = async (item) => {
  try {
    const res = await api.post('/carts/items', item);
    return res.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

/**
 * Update an item in the cart
 * @param {string} itemId - The ID of the item to update
 * @param {Object} updates - The updates to apply to the item
 * @returns {Promise} Promise with the updated cart data
 */
export const updateCartItem = async (itemId, updates) => {
  try {
    const res = await api.put(`/carts/items/${itemId}`, updates);
    return res.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

/**
 * Remove an item from the cart
 * @param {string} itemId - The ID of the item to remove
 * @returns {Promise} Promise with the updated cart data
 */
export const removeCartItem = async (itemId) => {
  try {
    const res = await api.delete(`/carts/items/${itemId}`);
    return res.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

/**
 * Clear the cart
 * @returns {Promise} Promise with the empty cart data
 */
export const clearCart = async () => {
  try {
    const res = await api.delete('/carts');
    return res.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

/**
 * Merge a guest cart with the user's cart after login
 * @param {Array} guestCartItems - Array of guest cart items
 * @returns {Promise} Promise with the merged cart data
 */
export const mergeGuestCart = async (guestCartItems) => {
  try {
    const res = await api.post('/carts/merge', { items: guestCartItems });
    return res.data;
  } catch (error) {
    console.error('Error merging guest cart:', error);
    throw error;
  }
};

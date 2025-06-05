import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartService from "../../services/cartService";

// Initial state
const initialState = {
  items: [],
  lastOperationSuccess: true,
  lastValidated: null,
  loading: false,
  error: null,
  isServerCart: false // Flag to indicate if cart is from server
};

// Load cart from localStorage if available
const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart === null) {
      return initialState;
    }
    const parsedCart = JSON.parse(serializedCart);
    // Ensure the lastOperationSuccess flag is present
    return {
      ...initialState,
      ...parsedCart,
      lastOperationSuccess: true,
      lastValidated: parsedCart.lastValidated || null
    };
  } catch (err) {
    console.error("Error loading cart from localStorage:", err);
    return initialState;
  }
};

// Fetch user cart from server
export const fetchUserCart = createAsyncThunk(
  "cart/fetchUserCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      // Only fetch from server if user is logged in
      if (!auth.user) {
        return { items: [] };
      }

      const response = await cartService.getUserCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error fetching cart");
    }
  }
);

// Save cart to server
export const saveCartToServer = createAsyncThunk(
  "cart/saveToServer",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { cart, auth } = getState();
      // Only save to server if user is logged in
      if (!auth.user) {
        return cart.items;
      }

      const response = await cartService.saveCart(cart.items);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error saving cart");
    }
  }
);

// Add item to server cart
export const addItemToServerCart = createAsyncThunk(
  "cart/addItemToServer",
  async (item, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      // Only add to server if user is logged in
      if (!auth.user) {
        return null;
      }

      const response = await cartService.addItemToCart(item);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error adding item to cart");
    }
  }
);

// Update item in server cart
export const updateServerCartItem = createAsyncThunk(
  "cart/updateServerItem",
  async ({ itemId, updates }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      // Only update on server if user is logged in
      if (!auth.user) {
        return null;
      }

      const response = await cartService.updateCartItem(itemId, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error updating cart item");
    }
  }
);

// Remove item from server cart
export const removeServerCartItem = createAsyncThunk(
  "cart/removeServerItem",
  async (itemId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      // Only remove from server if user is logged in
      if (!auth.user) {
        return null;
      }

      const response = await cartService.removeCartItem(itemId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error removing cart item");
    }
  }
);

// Clear server cart
export const clearServerCart = createAsyncThunk(
  "cart/clearServerCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      // Only clear on server if user is logged in
      if (!auth.user) {
        return null;
      }

      const response = await cartService.clearCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error clearing cart");
    }
  }
);

// Merge guest cart with user cart
export const mergeGuestCart = createAsyncThunk(
  "cart/mergeGuestCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { cart, auth } = getState();
      // Only merge if user is logged in and we have items
      if (!auth.user || cart.items.length === 0) {
        return null;
      }

      const response = await cartService.mergeGuestCart(cart.items);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error merging cart");
    }
  }
);

// Validate cart items against current product stock
export const validateCartItems = createAsyncThunk(
  "cart/validateItems",
  async (_, { getState }) => {
    const { cart, products } = getState();
    const updatedItems = [];
    const stockChanges = [];

    // If products haven't been loaded yet, return the current cart
    if (!products.products || products.products.length === 0) {
      return { items: cart.items, stockChanges: [] };
    }

    for (const cartItem of cart.items) {
      // Find the product in the store
      const product = products.products.find(p => p._id === cartItem._id);

      if (product) {
        // Check if stock has changed
        if (cartItem.stock !== product.stock) {
          stockChanges.push({
            productId: product._id,
            name: product.name,
            oldStock: cartItem.stock,
            newStock: product.stock
          });
        }

        // Update the cart item with the latest stock information
        const updatedItem = {
          ...cartItem,
          stock: product.stock,
          // Adjust quantity if it exceeds available stock
          quantity: Math.min(cartItem.quantity, product.stock)
        };

        updatedItems.push(updatedItem);
      } else {
        // If product no longer exists, keep it in the cart but mark it
        updatedItems.push({
          ...cartItem,
          unavailable: true
        });
      }
    }

    return { items: updatedItems, stockChanges };
  }
);

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem('cart', serializedCart);
  } catch (err) {
    console.error("Error saving cart to localStorage:", err);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item._id === product._id);
      const requestedQuantity = product.quantity || 1;

      // Add a success flag to the state to track if we were able to add the full quantity
      state.lastOperationSuccess = true;

      // Check if adding this quantity would exceed available stock
      if (existingItem) {
        // Calculate new total quantity
        const newTotalQuantity = existingItem.quantity + requestedQuantity;

        // Ensure we don't exceed available stock
        if (newTotalQuantity <= product.stock) {
          existingItem.quantity = newTotalQuantity;
          existingItem.stock = product.stock; // Update stock information
        } else {
          // If requested quantity exceeds stock, set to maximum available
          existingItem.quantity = product.stock;
          existingItem.stock = product.stock;
          // Mark operation as partially successful
          state.lastOperationSuccess = false;
        }
      } else {
        // For new items, ensure requested quantity doesn't exceed stock
        const quantityToAdd = Math.min(requestedQuantity, product.stock);

        // Store the product with minimal data needed, including stock information
        state.items.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          quantity: quantityToAdd,
          image: product.image,
          stock: product.stock // Store stock information
        });

        // Mark operation as partially successful if we couldn't add the full quantity
        if (quantityToAdd < requestedQuantity) {
          state.lastOperationSuccess = false;
        }
      }

      // Save to localStorage immediately
      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      // Save to localStorage immediately
      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      // Add a success flag to the state to track if we were able to set the full quantity
      state.lastOperationSuccess = true;

      const item = state.items.find(item => item._id === action.payload._id);
      if (item) {
        // Ensure the new quantity doesn't exceed available stock
        const newQuantity = Math.min(action.payload.quantity, item.stock || 0);
        item.quantity = newQuantity;

        // Mark operation as partially successful if we couldn't set the requested quantity
        if (newQuantity < action.payload.quantity) {
          state.lastOperationSuccess = false;
        }
      }
      // Save to localStorage immediately
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      // Save to localStorage immediately
      saveCartToStorage(state);
    }
  },
  extraReducers: (builder) => {
    builder
      // Validate cart items
      .addCase(validateCartItems.fulfilled, (state, action) => {
        const { items, stockChanges } = action.payload;

        // Update cart items with validated data
        state.items = items;

        // Store stock changes for notification
        state.stockChanges = stockChanges;

        // Update validation timestamp
        state.lastValidated = new Date().toISOString();

        // Save to localStorage
        saveCartToStorage(state);
      })

      // Fetch user cart
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.loading = false;

        // Only update if we got a valid response with items
        if (action.payload && action.payload.items) {
          state.items = action.payload.items;
          state.isServerCart = true;

          // Save to localStorage as backup
          saveCartToStorage(state);
        }
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })

      // Save cart to server
      .addCase(saveCartToServer.fulfilled, (state, action) => {
        // If we got a valid response with items, update the cart
        if (action.payload && action.payload.items) {
          state.items = action.payload.items;
          state.isServerCart = true;

          // Save to localStorage as backup
          saveCartToStorage(state);
        }
      })

      // Add item to server cart
      .addCase(addItemToServerCart.fulfilled, (state, action) => {
        // If we got a valid response with items, update the cart
        if (action.payload && action.payload.items) {
          state.items = action.payload.items;
          state.isServerCart = true;

          // Save to localStorage as backup
          saveCartToStorage(state);
        }
      })

      // Update item in server cart
      .addCase(updateServerCartItem.fulfilled, (state, action) => {
        // If we got a valid response with items, update the cart
        if (action.payload && action.payload.items) {
          state.items = action.payload.items;
          state.isServerCart = true;

          // Save to localStorage as backup
          saveCartToStorage(state);
        }
      })

      // Remove item from server cart
      .addCase(removeServerCartItem.fulfilled, (state, action) => {
        // If we got a valid response with items, update the cart
        if (action.payload && action.payload.items) {
          state.items = action.payload.items;
          state.isServerCart = true;

          // Save to localStorage as backup
          saveCartToStorage(state);
        }
      })

      // Clear server cart
      .addCase(clearServerCart.fulfilled, (state, action) => {
        // If we got a valid response, clear the cart
        if (action.payload) {
          state.items = [];
          state.isServerCart = true;

          // Save to localStorage as backup
          saveCartToStorage(state);
        }
      })

      // Merge guest cart
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        // If we got a valid response with items, update the cart
        if (action.payload && action.payload.items) {
          state.items = action.payload.items;
          state.isServerCart = true;

          // Save to localStorage as backup
          saveCartToStorage(state);
        }
      });
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
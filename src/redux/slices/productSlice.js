import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as productService from "../../services/ProductService";
import { toast } from "react-toastify";

// Initial state
const initialState = {
  products: [],
  product: null,
  loading: false,
  refreshing: false,
  error: null,
  lastFetched: null,
  stockChanges: {}, // Track stock changes for notifications
};

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, thunkAPI) => {
    try {
      const products = await productService.getProducts();
      return products;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error fetching products");
    }
  }
);

// Fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (productId, thunkAPI) => {
    try {
      const product = await productService.getProductById(productId);
      return product;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error fetching product");
    }
  }
);

// Refresh products (used for polling and page revisits)
export const refreshProducts = createAsyncThunk(
  "products/refresh",
  async (_, thunkAPI) => {
    try {
      // Get current state to compare stock changes
      const { products: currentProducts } = thunkAPI.getState().products;
      
      // Fetch latest products
      const products = await productService.getProducts();
      
      // Compare stock levels and track changes
      const stockChanges = {};
      
      products.forEach(newProduct => {
        const currentProduct = currentProducts.find(p => p._id === newProduct._id);
        
        if (currentProduct && currentProduct.stock !== newProduct.stock) {
          stockChanges[newProduct._id] = {
            name: newProduct.name,
            oldStock: currentProduct.stock,
            newStock: newProduct.stock,
            increased: newProduct.stock > currentProduct.stock
          };
        }
      });
      
      return { products, stockChanges };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error refreshing products");
    }
  }
);

// Products slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearStockChanges: (state) => {
      state.stockChanges = {};
    },
    updateProductStock: (state, action) => {
      const { productId, newStock } = action.payload;
      
      // Update product in the products array
      const product = state.products.find(p => p._id === productId);
      if (product) {
        const oldStock = product.stock;
        product.stock = newStock;
        
        // Track stock change for notification
        state.stockChanges[productId] = {
          name: product.name,
          oldStock,
          newStock,
          increased: newStock > oldStock
        };
      }
      
      // Update single product if it matches
      if (state.product && state.product._id === productId) {
        state.product.stock = newStock;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Refresh products
      .addCase(refreshProducts.pending, (state) => {
        state.refreshing = true;
        state.error = null;
      })
      .addCase(refreshProducts.fulfilled, (state, action) => {
        state.refreshing = false;
        state.products = action.payload.products;
        state.stockChanges = action.payload.stockChanges;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(refreshProducts.rejected, (state, action) => {
        state.refreshing = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductError, clearStockChanges, updateProductStock } = productSlice.actions;
export default productSlice.reducer;

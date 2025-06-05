import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as favoriteService from "../../services/favoriteService";

// Initial state
const initialState = {
  favorites: [],
  loading: false,
  error: null,
};

// Get all favorites
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await favoriteService.getFavorites();
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error fetching favorites");
    }
  }
);

// Check if a product is in favorites
export const checkProductFavorite = createAsyncThunk(
  "favorites/check",
  async (productId, thunkAPI) => {
    try {
      const response = await favoriteService.checkFavorite(productId);
      return { productId, isFavorite: response.isFavorite };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error checking favorite status");
    }
  }
);

// Toggle favorite status
export const toggleProductFavorite = createAsyncThunk(
  "favorites/toggle",
  async (productId, thunkAPI) => {
    try {
      const response = await favoriteService.toggleFavorite(productId);
      return { productId, isFavorite: response.isFavorite };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error toggling favorite");
    }
  }
);

// Favorites slice
const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Toggle favorite
      .addCase(toggleProductFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleProductFavorite.fulfilled, (state, action) => {
        state.loading = false;
        
        const { productId, isFavorite } = action.payload;
        
        if (isFavorite) {
          // If the product is now a favorite and not already in the list, add it
          if (!state.favorites.some(fav => fav._id === productId)) {
            // We'll need to fetch the full product details to add it properly
            // This will be updated when we fetch favorites next time
          }
        } else {
          // If the product is no longer a favorite, remove it from the list
          state.favorites = state.favorites.filter(fav => fav._id !== productId);
        }
      })
      .addCase(toggleProductFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;

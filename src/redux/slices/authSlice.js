import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";

// Load user from localStorage
const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  user,
  loading: false,
  error: null,
};

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      localStorage.removeItem("user");
      return null;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

// Update User Profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const { user } = state.auth;

      if (!user || !user.token) {
        throw new Error("You must be logged in to update your profile");
      }

      const response = await authService.updateProfile(userData, user.token);

      // Create updated user object with new data but keep the token
      const updatedUser = {
        ...user,
        name: userData.name || user.name,
        email: userData.email || user.email,
        bio: userData.bio !== undefined ? userData.bio : user.bio,
        profilePicture: userData.profilePicture !== undefined ? userData.profilePicture : user.profilePicture
      };

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error updating profile");
    }
  }
);

// Upload Profile Picture
export const uploadProfilePicture = createAsyncThunk(
  "auth/uploadProfilePicture",
  async (file, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const { user } = state.auth;

      if (!user || !user.token) {
        throw new Error("You must be logged in to upload a profile picture");
      }

      const response = await authService.uploadProfilePicture(file, user.token);

      // Create updated user object with new profile picture
      const updatedUser = {
        ...user,
        profilePicture: response.data.profilePicture
      };

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error uploading profile picture");
    }
  }
);

// Delete Profile Picture
export const deleteProfilePicture = createAsyncThunk(
  "auth/deleteProfilePicture",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const { user } = state.auth;

      if (!user || !user.token) {
        throw new Error("You must be logged in to delete your profile picture");
      }

      const response = await authService.deleteProfilePicture(user.token);

      // Create updated user object without profile picture
      const updatedUser = {
        ...user,
        profilePicture: null
      };

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error deleting profile picture");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Profile Picture
      .addCase(uploadProfilePicture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Profile Picture
      .addCase(deleteProfilePicture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProfilePicture.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(deleteProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;

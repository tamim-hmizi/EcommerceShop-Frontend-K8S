import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import favoriteReducer from "./slices/favoriteSlice";
import productReducer from "./slices/productSlice";
import themeReducer from "./slices/themeSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "auth", "favorites", "theme"],
};

// We don't persist the product state since we want to always fetch fresh data
const cartPersisted = persistReducer(persistConfig, cartReducer);
const authPersisted = persistReducer(persistConfig, authReducer);
const favoritePersisted = persistReducer(persistConfig, favoriteReducer);
const themePersisted = persistReducer(persistConfig, themeReducer);

export const store = configureStore({
  reducer: {
    cart: cartPersisted,
    auth: authPersisted,
    favorites: favoritePersisted,
    products: productReducer,
    theme: themePersisted,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

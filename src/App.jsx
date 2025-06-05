import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/admin/Dashboard";

import UserLayout from "./layout/UserLayout";
import AdminLayout from "./layout/AdminLayout";
import AdminUser from "./pages/admin/AdminUser";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminOrder from "./pages/admin/AdminOrder";
import AdminCategory from "./pages/admin/AdminCategory";
import Product from "./pages/Prodcut";
import Contact from "./pages/Contact";
import SignIn from "./pages/auth/SignIn";
import Register from "./pages/auth/Register";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import CartInitializer from "./components/CartInitializer";
import ProductUpdater from "./components/ProductUpdater";
import CartValidator from "./components/CartValidator";

import NotFound from "./pages/NotFound"; // optional 404 page
import RequireAdmin from "./routes/RequireAdmin"; // optional auth guard
import RequireAuth from "./routes/RequireAuth";   // optional user guard

function App() {
  return (
    <BrowserRouter>
      {/* This component initializes the cart from localStorage */}
      <CartInitializer />

      {/* This component handles real-time product updates */}
      <ProductUpdater pollingInterval={30000} />

      {/* This component validates cart items against current product data */}
      <CartValidator validationInterval={60000} />

      <Routes>
        {/* User Layout */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="product" element={<Product />} />
          <Route path="contact" element={<Contact />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="register" element={<Register />} />

          {/* Protected user-only routes */}
          <Route path="my-orders" element={
            <RequireAuth><MyOrders /></RequireAuth>
          } />
          <Route path="profile" element={
            <RequireAuth><Profile /></RequireAuth>
          } />
          <Route path="favorites" element={
            <RequireAuth><Favorites /></RequireAuth>
          } />
        </Route>

        {/* Admin Layout */}
        <Route path="/admin" element={
          <RequireAdmin><AdminLayout /></RequireAdmin>
        }>
          <Route index element={<Dashboard />} />
          <Route path="user" element={<AdminUser />} />
          <Route path="product" element={<AdminProduct />} />
          <Route path="order" element={<AdminOrder />} />
          <Route path="category" element={<AdminCategory />} />
        </Route>

        {/* Optional 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

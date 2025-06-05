import { useEffect, useState, useRef } from "react";
import { getUserOrders } from "../services/OrderService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { constructImageUrl, createSmallPlaceholder } from "../utils/imageUtils";

import {
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiAlertCircle,
  FiDollarSign,
  FiShoppingBag,
  FiCalendar,
  FiMapPin,
  FiShoppingCart
} from "react-icons/fi";

function MyOrders() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageURLs, setImageURLs] = useState({});
  const fetchedImages = useRef(new Set()); // prevent multiple requests
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getUserOrders();
        const rawOrders = res.data?.data || res.data || [];
        setOrders(rawOrders);

        // Deduplicate image fetching
        const fetchImages = async () => {
          const uniqueEntries = new Map();

          rawOrders.forEach(order => {
            order.orderItems?.forEach(item => {
              const id = item.product?._id;
              const imagePath = item.product?.image;
              if (id && imagePath && !uniqueEntries.has(id)) {
                uniqueEntries.set(id, imagePath);
              }
            });
          });

          for (const [id, imagePath] of uniqueEntries.entries()) {
            if (fetchedImages.current.has(id)) continue; // already fetched
            fetchedImages.current.add(id);

            try {
              if (imagePath.startsWith('http')) {
                setImageURLs(prev => ({ ...prev, [id]: imagePath }));
              } else {
                // Use the utility function to construct the correct image URL
                const imageUrl = constructImageUrl(imagePath);

                if (imageUrl) {
                  // Try to load the image directly first (for static files)
                  try {
                    const img = new Image();
                    const imageLoadPromise = new Promise((resolve, reject) => {
                      img.onload = () => resolve(imageUrl);
                      img.onerror = reject;
                      img.src = imageUrl;
                    });

                    await imageLoadPromise;
                    setImageURLs(prev => ({ ...prev, [id]: imageUrl }));
                  } catch {
                    // If direct loading fails, try API endpoint
                    const res = await api.get(imageUrl, { responseType: "blob" });
                    const blobUrl = URL.createObjectURL(res.data);
                    setImageURLs(prev => ({ ...prev, [id]: blobUrl }));
                  }
                } else {
                  throw new Error('Invalid image path');
                }
              }
            } catch (err) {
              console.warn(`Failed to fetch image for ${id}`, err);
              // Set a placeholder image if loading fails
              setImageURLs(prev => ({ ...prev, [id]: createSmallPlaceholder('Product') }));
            }
          }
        };

        fetchImages();
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      Object.values(imageURLs).forEach(url => URL.revokeObjectURL(url));
    };
  }, [user, imageURLs]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing": return <FiClock className="text-yellow-500" />;
      case "Shipped": return <FiTruck className="text-blue-500" />;
      case "Delivered": return <FiCheckCircle className="text-green-500" />;
      default: return <FiAlertCircle className="text-red-500" />;
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="w-20 h-20 border-t-4 border-b-4 border-primary rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-t-4 border-primary/30 rounded-full animate-ping absolute inset-0 opacity-30"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-base-content">Loading your orders...</p>
          <p className="text-base-content/60 mt-2">Please wait while we fetch your order history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Modern Header with Glassmorphism Effect */}
      <div className="relative bg-gradient-to-r from-primary via-secondary to-primary rounded-3xl shadow-xl mb-10 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-primary-content/20"></div>
          <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-primary-content/20"></div>
          <div className="absolute right-1/4 bottom-1/3 w-36 h-36 rounded-full bg-primary-content/20"></div>
        </div>

        {/* Content */}
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary-content">My Orders</h2>
              <p className="text-primary-content/80">Track and manage your purchase history</p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 bg-primary-content/10 backdrop-blur-sm rounded-2xl">
              <FiShoppingBag className="h-8 w-8 text-primary-content" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-base-100 rounded-2xl shadow-md p-6 border-l-4 border-primary transform transition-transform hover:scale-105 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium uppercase tracking-wider">Total Orders</p>
              <p className="text-3xl font-bold text-base-content mt-1">{orders.length}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-xl">
              <FiPackage className="h-7 w-7 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-md p-6 border-l-4 border-success transform transition-transform hover:scale-105 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium uppercase tracking-wider">Completed</p>
              <p className="text-3xl font-bold text-base-content mt-1">
                {orders.filter(order => order.status === "Delivered").length}
              </p>
            </div>
            <div className="bg-success/10 p-3 rounded-xl">
              <FiCheckCircle className="h-7 w-7 text-success" />
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-md p-6 border-l-4 border-info transform transition-transform hover:scale-105 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium uppercase tracking-wider">Total Spent</p>
              <p className="text-3xl font-bold text-base-content mt-1">
                ${orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-info/10 p-3 rounded-xl">
              <FiDollarSign className="h-7 w-7 text-info" />
            </div>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center bg-base-100 rounded-2xl shadow-lg p-12 max-w-md mx-auto border border-base-300 transform transition-all duration-300 hover:shadow-xl">
          <div className="relative mx-auto mb-8">
            {/* Animated illustration */}
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <div className="absolute w-32 h-32 bg-primary/20 rounded-full animate-ping opacity-50"></div>
              <FiPackage className="h-14 w-14 text-primary relative z-10" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary/40 rounded-full"></div>
            <div className="absolute bottom-0 -left-4 w-8 h-8 bg-primary/40 rounded-full"></div>
          </div>

          <h3 className="text-2xl font-bold text-base-content mb-3">No Orders Yet</h3>
          <p className="text-base-content/60 mb-8 max-w-xs mx-auto">Start shopping to build your order history and track your purchases</p>

          <button
            onClick={() => navigate("/")}
            className="btn btn-primary gap-2"
          >
            <FiShoppingCart className="w-5 h-5" />
            <span>Discover Products</span>
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <div key={order._id} className="bg-base-100 rounded-2xl shadow-md border border-base-300 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              {/* Order Header with Gradient Accent */}
              <div className="relative">
                {/* Colored accent based on status */}
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  order.status === "Delivered" ? "bg-gradient-to-r from-success to-success" :
                  order.status === "Shipped" ? "bg-gradient-to-r from-info to-info" :
                  order.status === "Processing" ? "bg-gradient-to-r from-warning to-warning" :
                  "bg-gradient-to-r from-base-content/40 to-base-content/40"
                }`}></div>

                <div className="bg-base-200 p-6 pt-7">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-base-content">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <div className={`badge ${
                          order.isPaid ? "badge-success" : "badge-warning"
                        } text-xs font-medium`}>
                          {order.isPaid ? "Paid" : "Payment Pending"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-base-content/60">
                        <FiCalendar className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm ${
                      order.status === "Delivered" ? "bg-success/10 text-success border border-success/20" :
                      order.status === "Shipped" ? "bg-info/10 text-info border border-info/20" :
                      order.status === "Processing" ? "bg-warning/10 text-warning border border-warning/20" :
                      "bg-base-content/10 text-base-content border border-base-content/20"
                    }`}>
                      {getStatusIcon(order.status)}
                      <span className="font-medium">{order.status}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-base-content mb-4 flex items-center gap-2">
                  <FiShoppingBag className="w-4 h-4" />
                  <span>Order Items</span>
                  <span className="ml-2 bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                  </span>
                </h4>

                <div className="space-y-4">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-base-200 transition-colors duration-200 border border-base-300 hover:border-primary/30">
                      {/* Product Image with Shadow and Hover Effect */}
                      <div className="w-20 h-20 bg-base-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-base-300 group-hover:shadow-md transition-all duration-200">
                        {imageURLs[item.product?._id] ? (
                          <img
                            src={imageURLs[item.product._id]}
                            alt={item.product?.name || "Product"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null; // Prevent infinite error loop
                              e.target.src = createSmallPlaceholder(item.product?.name || 'Product');
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-base-200 to-base-300 text-base-content/40 p-2">
                            <FiShoppingCart className="w-8 h-8 mb-1 text-primary" />
                            <div className="text-xs font-medium text-center text-base-content/60 line-clamp-1 w-full">
                              {item.product?.name || "Product"}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Product Details with Better Typography */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-base-content truncate group-hover:text-primary transition-colors duration-200">
                          {item.product?.name || "Unnamed Product"}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-base-content/60 bg-base-200 px-2 py-1 rounded-full">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm text-base-content/60">
                            ${(item.product?.price || 0).toFixed(2)} per unit
                          </span>
                        </div>
                      </div>

                      {/* Price with Highlight */}
                      <div className="font-bold text-base-content bg-primary/10 px-3 py-1.5 rounded-lg">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-base-200 p-6 border-t border-base-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-6">
                    {/* Order Summary */}
                    <div>
                      <p className="text-xs text-base-content/60 uppercase tracking-wider font-medium">Items</p>
                      <p className="font-medium text-base-content mt-1">
                        {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                    </div>

                    <div className="h-10 border-l border-base-300"></div>

                    {/* Shipping Address */}
                    <div>
                      <p className="text-xs text-base-content/60 uppercase tracking-wider font-medium">Shipping Address</p>
                      <p className="font-medium text-base-content flex items-center gap-1 mt-1">
                        <FiMapPin className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">
                          {order.shippingAddress?.address || "No address provided"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="bg-primary/10 px-6 py-3 rounded-lg shadow-sm">
                    <p className="text-xs text-primary uppercase tracking-wider font-medium">Total Amount</p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;

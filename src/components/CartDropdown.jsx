import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../services/OrderService";
import {
  clearCart,
  removeFromCart,
  removeServerCartItem,
  clearServerCart
} from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiX, FiArrowRight } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { constructImageUrl, createSmallPlaceholder } from "../utils/imageUtils";





function CartDropdown() {
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [loadingImages, setLoadingImages] = useState(true);
  const [imageURLs, setImageURLs] = useState({});
  // Use ref to track image URLs without causing re-renders
  const imageURLsRef = useRef(imageURLs);

  // Update ref when imageURLs changes
  useEffect(() => {
    imageURLsRef.current = imageURLs;
  }, [imageURLs]);

  // Load images for cart items
  useEffect(() => {
    const fetchImages = async () => {
      if (items.length === 0) {
        setLoadingImages(false);
        return;
      }

      try {
        // Create a new object for image URLs to avoid dependency issues
        const newImageURLs = {};
        const currentImageURLs = imageURLsRef.current; // Use ref to avoid dependency issues

        // Process items one by one to avoid overwhelming the server
        for (const item of items) {
          // Skip if there's no item ID
          if (!item._id) continue;

          // Skip if we already have this image cached
          if (currentImageURLs[item._id]) {
            newImageURLs[item._id] = currentImageURLs[item._id];
            continue;
          }

          try {
            if (item.image) {
              // Use the utility function to construct the correct image URL
              const imagePath = constructImageUrl(item.image);

              if (imagePath) {
                console.log(`Fetching image for ${item.name} from:`, imagePath);

                try {
                  // Try to load the image directly first (for static files)
                  const img = new Image();
                  const imageLoadPromise = new Promise((resolve, reject) => {
                    img.onload = () => resolve(imagePath);
                    img.onerror = reject;
                    img.src = imagePath;
                  });

                  try {
                    await imageLoadPromise;
                    newImageURLs[item._id] = imagePath;
                  } catch {
                    // If direct loading fails, try API endpoint
                    const response = await api.get(imagePath, {
                      responseType: "blob",
                    });
                    const blobUrl = URL.createObjectURL(response.data);
                    newImageURLs[item._id] = blobUrl;
                  }
                } catch (imageError) {
                  console.warn(`Failed to load image from ${imagePath}:`, imageError.message);
                  // If image loading fails, use placeholder
                  newImageURLs[item._id] = createSmallPlaceholder(item.name || 'Product');
                }
              } else {
                // No valid image path, use placeholder
                newImageURLs[item._id] = createSmallPlaceholder(item.name || 'Product');
              }
            } else {
              // No image provided, use placeholder
              newImageURLs[item._id] = createSmallPlaceholder(item.name || 'Product');
            }
          } catch (error) {
            console.error(`Error processing image for ${item.name} (${item._id}):`, error);
            // Use a placeholder instead of null for failed images
            newImageURLs[item._id] = createSmallPlaceholder(item.name || 'Product');
          }
        }

        // Only update if there are changes to avoid infinite loops
        const hasChanges = Object.keys(newImageURLs).some(
          key => !currentImageURLs[key] || currentImageURLs[key] !== newImageURLs[key]
        );

        if (hasChanges) {
          setImageURLs(newImageURLs);
        }

        setLoadingImages(false);
      } catch (error) {
        console.error("Error fetching images:", error);
        setLoadingImages(false);
      }
    };

    fetchImages();

    // Cleanup function to revoke object URLs when component unmounts
    return () => {
      // Use the ref to get the latest imageURLs
      Object.values(imageURLsRef.current).forEach(url => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [items]); // Only depend on items to prevent infinite loops

  const handlePlaceOrder = async () => {
    if (!user?.token) {
      toast.info("Please log in to place an order.");
      navigate('/signin');
      return;
    }

    if (items.length === 0) {
      toast.info("Your cart is empty.");
      return;
    }

    setIsPlacingOrder(true);

    // Debug: Log cart items to understand their structure
    console.log("Cart items for checkout:", items);

    // Validate cart items before creating order
    const validItems = items.filter(item => {
      // Check if item has required fields
      const hasId = item._id || item.product;
      const hasName = item.name;
      const hasPrice = typeof item.price === 'number' && item.price > 0;
      const hasQuantity = typeof item.quantity === 'number' && item.quantity > 0;

      const isValid = hasId && hasName && hasPrice && hasQuantity;

      // Debug: Log validation details for each item
      if (!isValid) {
        console.warn("Invalid cart item:", {
          item,
          hasId,
          hasName,
          hasPrice,
          hasQuantity
        });
      }

      return isValid;
    });

    console.log("Valid items after filtering:", validItems);

    if (validItems.length === 0) {
      toast.error("No valid items in cart. Please try adding products again.");
      setIsPlacingOrder(false);
      return;
    }

    if (validItems.length !== items.length) {
      toast.warning(`${items.length - validItems.length} invalid items were removed from your order.`);
    }

    // Ensure all required fields are present and properly formatted
    const orderData = {
      orderItems: validItems.map(item => {
        // Ensure quantity is a number and at least 1
        const quantity = Math.max(
          1,
          typeof item.quantity === 'number'
            ? Math.floor(item.quantity) // Ensure it's an integer
            : parseInt(item.quantity, 10) || 1
        );

        // Use either _id or product field for the product ID
        const productId = item._id || item.product;

        return {
          product: productId,
          quantity: quantity
        };
      }),
      shippingAddress: {
        address: "123 Main Street",
        city: "City",
        postalCode: "0000",
        country: "Tunisia",
      },
      // Ensure totalPrice is a number with 2 decimal places (positive number)
      totalPrice: Math.max(0.01, parseFloat(validItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2))),
    };

    try {
      await createOrder(orderData);

      // If user is logged in, also clear server cart
      if (user) {
        try {
          await dispatch(clearServerCart()).unwrap();
        } catch (error) {
          console.error('Error clearing server cart:', error);
        }
      }

      // Clear local cart
      dispatch(clearCart());

      toast.success("Order placed successfully!");
      navigate("/my-orders");
    } catch (err) {
      console.error("Order error:", err);

      // Check if it's a product ID validation error
      if (err.message && err.message.includes("missing product ID")) {
        toast.error("One or more items in your cart are invalid. Please try removing and adding them again.");
        console.error("Product ID validation error:", err.message);
      }
      // Check for specific error messages from the backend
      else if (err.response && err.response.data) {
        // Handle validation errors if they exist
        if (err.response.data.errors && err.response.data.errors.length > 0) {
          const errorMessages = err.response.data.errors.map(e => `${e.param}: ${e.msg}`).join(', ');
          toast.error(`Validation error: ${errorMessages}`);
        } else if (err.response.data.message) {
          // If the error is about insufficient stock
          if (err.response.data.message.includes("Insufficient stock")) {
            toast.error(err.response.data.message);
          } else {
            toast.error(err.response.data.message);
          }
        } else {
          toast.error("Failed to place order. Please try again.");
        }
      } else {
        toast.error(`Failed to place order: ${err.message || "Unknown error"}`);
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <FiShoppingCart className="h-5 w-5 text-primary" />
          {totalItems > 0 && (
            <span className="badge badge-sm badge-primary indicator-item">
              {totalItems}
            </span>
          )}
        </div>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-[1] mt-3 p-4 shadow-lg bg-base-100 rounded-xl w-80 border border-base-300"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-base-content">Your Cart</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() => document.activeElement.blur()} // This will close the dropdown by removing focus
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <FiShoppingCart className="mx-auto h-8 w-8 text-base-content/40 mb-2" />
            <p className="text-base-content/60">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="max-h-64 overflow-y-auto space-y-4">
              {loadingImages && items.length > 0 ? (
                <div className="flex justify-center py-4">
                  <div className="loading loading-spinner loading-md"></div>
                </div>
              ) : (
                items.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-base-200 rounded-lg overflow-hidden">
                      <img
                        src={imageURLs[item._id] || createSmallPlaceholder(item.name || 'Product')}
                        alt={`${item.name} product image`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(`Error loading image for ${item.name}`);
                          e.target.onerror = null; // Prevent infinite error loop
                          e.target.src = createSmallPlaceholder(item.name || 'Product');
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-1 text-base-content">{item.name}</h4>
                      <p className="text-sm text-base-content/60">${item.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-base-content">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        className="text-base-content/40 hover:text-error transition-colors"
                        onClick={() => {
                          // Remove from local cart
                          dispatch(removeFromCart(item._id));

                          // If user is logged in, also remove from server cart
                          if (user) {
                            dispatch(removeServerCartItem(item._id))
                              .catch(error => {
                                console.error('Error removing item from server cart:', error);
                              });
                          }
                        }}
                        aria-label="Remove item"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-base-300 pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-base-content/70">Subtotal</span>
                <span className="font-medium text-base-content">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-base-content/70">Shipping</span>
                <span className="font-medium text-base-content">$0.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-base-content">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-sm btn-ghost w-full mt-2 text-base-content/60 hover:text-error"
                onClick={() => {
                  // Clear local cart
                  dispatch(clearCart());

                  // If user is logged in, also clear server cart
                  if (user) {
                    dispatch(clearServerCart())
                      .catch(error => {
                        console.error('Error clearing server cart:', error);
                      });
                  }
                }}
              >
                Clear Cart
              </button>
            </div>

            <button
              className="btn btn-primary w-full mt-4 gap-2"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  Checkout <FiArrowRight />
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CartDropdown;
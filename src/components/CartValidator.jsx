import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateCartItems } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

// This component handles cart validation against the latest product data
// It doesn't render anything visible but manages the background validation
const CartValidator = ({ validationInterval = 60000 }) => {
  const dispatch = useDispatch();
  const { items, lastValidated, stockChanges } = useSelector(state => state.cart);
  const { products, lastFetched } = useSelector(state => state.products);

  // Validate cart when products are updated or when returning to the app
  useEffect(() => {
    // Skip validation if cart is empty
    if (items.length === 0) return;

    // Skip if products haven't been loaded yet
    if (!products || products.length === 0) return;

    // Skip if products haven't been updated since last validation
    if (lastValidated && lastFetched && new Date(lastValidated) > new Date(lastFetched)) return;

    // Validate cart items against current product data
    dispatch(validateCartItems());
  }, [dispatch, items.length, products, lastFetched, lastValidated]);

  // Set up periodic validation
  useEffect(() => {
    // Skip if cart is empty
    if (items.length === 0) return;

    const validationTimer = setInterval(() => {
      dispatch(validateCartItems());
    }, validationInterval);

    // Clean up on unmount
    return () => clearInterval(validationTimer);
  }, [dispatch, items.length, validationInterval]);

  // Show notifications for stock changes
  useEffect(() => {
    if (stockChanges && stockChanges.length > 0) {
      // Process each stock change
      stockChanges.forEach(change => {
        const { name, oldStock, newStock } = change;

        // Only notify about significant changes
        if (newStock < oldStock) {
          // Stock decreased
          if (newStock === 0) {
            // Product out of stock
            toast.warning(`${name} is now out of stock! We've adjusted your cart.`, {
              position: "bottom-right",
              autoClose: 5000,
              icon: "🚫"
            });
          } else if (newStock < oldStock && newStock <= 5) {
            // Low stock warning
            toast.info(`Only ${newStock} units of ${name} remain in stock. We've adjusted your cart.`, {
              position: "bottom-right",
              autoClose: 4000,
              icon: "⚠️"
            });
          }
        } else if (newStock > oldStock) {
          // Stock increased
          if (oldStock === 0) {
            // Product back in stock
            toast.success(`${name} is back in stock!`, {
              position: "bottom-right",
              autoClose: 5000,
              icon: "✅"
            });
          } else if (newStock - oldStock >= 5) {
            // Significant restock
            toast.info(`${name} has been restocked (${newStock} now available)`, {
              position: "bottom-right",
              autoClose: 3000,
              icon: "📦"
            });
          }
        }
      });
    }
  }, [stockChanges]);

  // This component doesn't render anything visible
  return null;
};

export default CartValidator;

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshProducts, clearStockChanges } from '../redux/slices/productSlice';
import { toast } from 'react-toastify';

// This component handles real-time product updates through polling
// It doesn't render anything visible but manages the background updates
const ProductUpdater = ({ pollingInterval = 30000 }) => {
  const dispatch = useDispatch();
  const { stockChanges, lastFetched } = useSelector(state => state.products);
  const pollingTimerRef = useRef(null);
  
  // Set up polling for product updates
  useEffect(() => {
    // Initial fetch if products haven't been loaded yet
    if (!lastFetched) {
      dispatch(refreshProducts());
    }
    
    // Set up polling interval
    pollingTimerRef.current = setInterval(() => {
      dispatch(refreshProducts());
    }, pollingInterval);
    
    // Clean up on unmount
    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, [dispatch, lastFetched, pollingInterval]);
  
  // Show notifications for stock changes
  useEffect(() => {
    if (Object.keys(stockChanges).length > 0) {
      // Process each stock change
      Object.values(stockChanges).forEach(change => {
        const { name, oldStock, newStock, increased } = change;
        
        // Only notify about significant changes
        if (increased) {
          // Stock increased
          if (oldStock === 0) {
            // Product back in stock
            toast.success(`${name} is back in stock! (${newStock} available)`, {
              position: "bottom-right",
              autoClose: 5000
            });
          } else if (newStock - oldStock >= 5) {
            // Significant restock
            toast.info(`${name} has been restocked! (${oldStock} → ${newStock})`, {
              position: "bottom-right",
              autoClose: 3000
            });
          }
        } else {
          // Stock decreased
          if (newStock === 0) {
            // Product out of stock
            toast.warning(`${name} is now out of stock!`, {
              position: "bottom-right",
              autoClose: 5000
            });
          } else if (newStock <= 5 && oldStock > 5) {
            // Low stock warning
            toast.warning(`${name} is running low! Only ${newStock} left in stock.`, {
              position: "bottom-right",
              autoClose: 4000
            });
          }
        }
      });
      
      // Clear stock changes after processing
      dispatch(clearStockChanges());
    }
  }, [stockChanges, dispatch]);
  
  // This component doesn't render anything visible
  return null;
};

export default ProductUpdater;

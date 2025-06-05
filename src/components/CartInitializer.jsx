import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  clearCart,
  fetchUserCart,
  mergeGuestCart
} from '../redux/slices/cartSlice';

// This component initializes the cart from localStorage and/or server
function CartInitializer() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { items, isServerCart } = useSelector(state => state.cart);

  // Initialize cart from localStorage for guest users
  useEffect(() => {
    // Only initialize from localStorage if we're not logged in
    if (!user) {
      // Check if we have a cart in localStorage
      const savedCart = localStorage.getItem('cart');

      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);

          // Clear the current cart first
          dispatch(clearCart());

          // Add each item to the cart
          if (cartData.items && Array.isArray(cartData.items)) {
            // Filter out invalid items (missing _id, name, or price)
            const validItems = cartData.items.filter(item =>
              item._id && item.name && typeof item.price === 'number'
            );

            if (validItems.length !== cartData.items.length) {
              console.warn(`Filtered out ${cartData.items.length - validItems.length} invalid items from localStorage`);
            }

            validItems.forEach(item => {
              // Add the item with just the essential data
              dispatch(addToCart({
                _id: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1,
                image: item.image, // Include the image path
                stock: item.stock || 0 // Include stock information
              }));
            });
          }

          console.log("Guest cart initialized from localStorage with", cartData.items?.length || 0, "items");
        } catch (error) {
          console.error('Error initializing cart from localStorage:', error);
        }
      }
    }
  }, [dispatch, user]);

  // Fetch cart from server for logged-in users
  useEffect(() => {
    // Only fetch from server if we're logged in
    if (user && !isServerCart) {
      // First check if we have a guest cart to merge
      if (items.length > 0) {
        // Merge guest cart with server cart
        dispatch(mergeGuestCart())
          .then(() => {
            console.log("Guest cart merged with server cart");
          })
          .catch(error => {
            console.error('Error merging guest cart:', error);
            // If merge fails, just fetch the server cart
            dispatch(fetchUserCart());
          });
      } else {
        // No guest cart, just fetch the server cart
        dispatch(fetchUserCart())
          .then(result => {
            if (result.payload && result.payload.items) {
              console.log("User cart fetched from server with", result.payload.items.length, "items");
            }
          })
          .catch(error => {
            console.error('Error fetching user cart:', error);
          });
      }
    }
  }, [dispatch, user, items.length, isServerCart]);

  // This component doesn't render anything
  return null;
}

export default CartInitializer;

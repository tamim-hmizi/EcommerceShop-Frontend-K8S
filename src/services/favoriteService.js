import api from "./api";

/**
 * Get all favorites for the current user
 * @returns {Promise} Promise with the favorites data
 */
export const getFavorites = async () => {
  const res = await api.get("/favorites");
  return res.data;
};

/**
 * Check if a product is in the user's favorites
 * @param {string} productId - The product ID to check
 * @returns {Promise} Promise with the check result
 */
export const checkFavorite = async (productId) => {
  const res = await api.get(`/favorites/${productId}`);
  return res.data;
};

/**
 * Add a product to favorites
 * @param {string} productId - The product ID to add to favorites
 * @returns {Promise} Promise with the result
 */
export const addToFavorites = async (productId) => {
  const res = await api.post(`/favorites/${productId}`);
  return res.data;
};

/**
 * Remove a product from favorites
 * @param {string} productId - The product ID to remove from favorites
 * @returns {Promise} Promise with the result
 */
export const removeFromFavorites = async (productId) => {
  const res = await api.delete(`/favorites/${productId}`);
  return res.data;
};

/**
 * Toggle a product's favorite status
 * @param {string} productId - The product ID to toggle
 * @returns {Promise} Promise with the new favorite status
 */
export const toggleFavorite = async (productId) => {
  try {
    // First check if it's already a favorite
    const checkResult = await checkFavorite(productId);
    
    if (checkResult.isFavorite) {
      // If it's a favorite, remove it
      await removeFromFavorites(productId);
      return { isFavorite: false };
    } else {
      // If it's not a favorite, add it
      await addToFavorites(productId);
      return { isFavorite: true };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};

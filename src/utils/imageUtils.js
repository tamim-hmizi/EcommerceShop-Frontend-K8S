/**
 * Image utility functions for handling product images in the ecommerce application
 */

/**
 * Creates a local placeholder image using SVG data URL
 * @param {string} text - Text to display in the placeholder
 * @param {number} width - Width of the placeholder image
 * @param {number} height - Height of the placeholder image
 * @param {string} bgColor - Background color (hex)
 * @param {string} textColor - Text color (hex)
 * @returns {string} Data URL for the SVG placeholder image
 */
export const createPlaceholderImage = (text, width = 300, height = 300, bgColor = '#f3f4f6', textColor = '#6b7280') => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.2}"
            fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Creates a small placeholder image for cart items and thumbnails
 * @param {string} text - Text to display in the placeholder
 * @returns {string} Data URL for the SVG placeholder image
 */
export const createSmallPlaceholder = (text) => {
  return createPlaceholderImage(text, 64, 64);
};

/**
 * Creates a medium placeholder image for product cards
 * @param {string} text - Text to display in the placeholder
 * @returns {string} Data URL for the SVG placeholder image
 */
export const createMediumPlaceholder = (text) => {
  return createPlaceholderImage(text, 300, 300);
};

/**
 * Constructs the correct image URL for backend images
 * @param {string} imagePath - The image path from the database
 * @param {string} baseUrl - The base API URL (optional)
 * @returns {string} The complete image URL
 */
export const constructImageUrl = (imagePath, baseUrl = null) => {
  if (!imagePath) return null;

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Get base URL from environment or use default (without /api for static files)
  const envBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:5000";
  const serverBaseUrl = baseUrl || envBaseUrl;

  // Handle different path formats
  if (imagePath.startsWith('/uploads/')) {
    // Path like "/uploads/profile-pictures/filename.ext"
    return `${serverBaseUrl}${imagePath}`;
  } else if (imagePath.startsWith('uploads/')) {
    // Path like "uploads/profile-pictures/filename.ext"
    return `${serverBaseUrl}/${imagePath}`;
  } else {
    // Assume it's just the filename - add full uploads path
    return `${serverBaseUrl}/uploads/${imagePath}`;
  }
};

/**
 * Handles image loading errors with fallback
 * @param {Event} event - The error event from the img element
 * @param {string} fallbackText - Text to display in the fallback placeholder
 */
export const handleImageError = (event, fallbackText = 'Image') => {
  event.target.onerror = null; // Prevent infinite error loop
  event.target.src = createSmallPlaceholder(fallbackText);
};

/**
 * Validates if a file is a valid image
 * @param {File} file - The file to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateImageFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 5MB'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Preloads an image and returns a promise
 * @param {string} src - The image source URL
 * @returns {Promise} Promise that resolves when image loads or rejects on error
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

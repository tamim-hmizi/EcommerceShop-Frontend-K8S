import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites, toggleProductFavorite } from "../redux/slices/favoriteSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { FiShoppingCart, FiHeart, FiTrash2, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import api from "../services/api";
import { constructImageUrl, createMediumPlaceholder } from "../utils/imageUtils";

function Favorites() {
  const dispatch = useDispatch();
  const { favorites, loading, error } = useSelector((state) => state.favorites);
  const { user } = useSelector((state) => state.auth);
  const [imageUrls, setImageUrls] = useState({});
  const [loadingImages, setLoadingImages] = useState(true);

  // Fetch favorites when component mounts
  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, user]);

  // Load product images
  useEffect(() => {
    const loadImages = async () => {
      if (favorites && favorites.length > 0) {
        setLoadingImages(true);
        const urls = {};

        for (const product of favorites) {
          if (product.image) {
            try {
              // Check if the image path is a full URL or a relative path
              if (product.image.startsWith('http')) {
                urls[product._id] = product.image;
              } else {
                // Use the utility function to construct the correct image URL
                const imageUrl = constructImageUrl(product.image);

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
                    urls[product._id] = imageUrl;
                  } catch {
                    // If direct loading fails, try API endpoint
                    const response = await api.get(imageUrl, {
                      responseType: "blob",
                    });
                    const blobUrl = URL.createObjectURL(response.data);
                    urls[product._id] = blobUrl;
                  }
                } else {
                  throw new Error('Invalid image path');
                }
              }
            } catch (error) {
              console.error(`Error loading image for product ${product._id}:`, error);
              urls[product._id] = createMediumPlaceholder(product.name || 'Product');
            }
          } else {
            urls[product._id] = createMediumPlaceholder(product.name || 'Product');
          }
        }

        setImageUrls(urls);
        setLoadingImages(false);
      }
    };

    loadImages();

    // Cleanup function to revoke object URLs
    return () => {
      Object.values(imageUrls).forEach(url => {
        if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [favorites]);

  const handleRemoveFromFavorites = async (productId) => {
    try {
      await dispatch(toggleProductFavorite(productId)).unwrap();
      toast.success("Product removed from favorites");
    } catch (error) {
      toast.error("Failed to remove product from favorites");
      console.error("Error removing from favorites:", error);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      ...product,
      quantity: 1
    }));
    toast.success(`Added ${product.name} to cart!`, {
      position: "bottom-right",
      icon: "🛒"
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16 bg-base-200 rounded-xl">
          <FiAlertCircle className="mx-auto h-16 w-16 text-base-content/40 mb-4" />
          <h2 className="text-2xl font-bold text-base-content mb-2">Please Sign In</h2>
          <p className="text-base-content/60 mb-6">You need to be signed in to view your favorites</p>
          <Link
            to="/signin"
            className="btn btn-primary"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-base-content">My Favorites</h1>

      {loading && (
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      )}

      {error && (
        <div className="bg-error/10 p-4 rounded-lg mb-6 border border-error/20">
          <p className="text-error">{error}</p>
        </div>
      )}

      {!loading && favorites.length === 0 && (
        <div className="text-center py-16 bg-base-200 rounded-xl">
          <FiHeart className="mx-auto h-16 w-16 text-base-content/40 mb-4" />
          <h2 className="text-2xl font-bold text-base-content mb-2">No Favorites Yet</h2>
          <p className="text-base-content/60 mb-6">You haven't added any products to your favorites</p>
          <Link
            to="/product"
            className="btn btn-primary"
          >
            Browse Products
          </Link>
        </div>
      )}

      {!loading && favorites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <div
              key={product._id}
              className="bg-base-100 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-base-300"
            >
              <div className="relative h-48 bg-base-200">
                {loadingImages ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-pulse w-12 h-12 rounded-full bg-base-300"></div>
                  </div>
                ) : (
                  <img
                    src={imageUrls[product._id] || createMediumPlaceholder(product.name || 'Product')}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite error loop
                      e.target.src = createMediumPlaceholder(product.name || 'Product');
                    }}
                  />
                )}
                <button
                  onClick={() => handleRemoveFromFavorites(product._id)}
                  className="absolute top-2 right-2 p-2 bg-base-100/80 hover:bg-base-100 rounded-full shadow-sm transition-colors"
                  aria-label="Remove from favorites"
                >
                  <FiTrash2 className="w-5 h-5 text-error" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 line-clamp-1 text-base-content">{product.name}</h3>
                <p className="text-base-content/60 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-base-content">${product.price.toFixed(2)}</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-primary btn-sm gap-1"
                  >
                    <FiShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;

import React, { useEffect, useState } from 'react';
import { FiPackage } from "react-icons/fi";
import api from "../../../services/api";
import { constructImageUrl, createSmallPlaceholder } from "../../../utils/imageUtils";

const TopProducts = ({ topProducts, totalStock }) => {
  const [productImages, setProductImages] = useState({});
  const [loadingImages, setLoadingImages] = useState({});

  // Load product images
  useEffect(() => {
    const fetchImages = async () => {
      const imagePromises = topProducts.map(async (product) => {
        if (product.image) {
          setLoadingImages(prev => ({ ...prev, [product._id]: true }));
          try {
            if (product.image.startsWith('http')) {
              return { id: product._id, url: product.image };
            }

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
                return { id: product._id, url: imageUrl };
              } catch {
                // If direct loading fails, try API endpoint
                const response = await api.get(imageUrl, {
                  responseType: "blob",
                });
                const blobUrl = URL.createObjectURL(response.data);
                return { id: product._id, url: blobUrl };
              }
            } else {
              throw new Error('Invalid image path');
            }
          } catch (error) {
            console.error(`Error fetching image for product ${product._id}:`, error);
            return { id: product._id, url: createSmallPlaceholder(product.name || 'Product') };
          } finally {
            setLoadingImages(prev => ({ ...prev, [product._id]: false }));
          }
        }
        return { id: product._id, url: createSmallPlaceholder(product.name || 'Product') };
      });

      const results = await Promise.all(imagePromises);
      const imageMap = results.reduce((acc, { id, url }) => {
        acc[id] = url;
        return acc;
      }, {});

      setProductImages(imageMap);
    };

    if (topProducts.length > 0) {
      fetchImages();
    }

    // Cleanup function to revoke object URLs
    return () => {
      Object.values(productImages).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [topProducts]);

  return (
    <div className="admin-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-base-content">Top Products</h3>
        <div className="text-sm text-base-content/60 bg-base-200 px-3 py-1 rounded-full">
          By Stock Level
        </div>
      </div>
      <div className="overflow-hidden">
        {topProducts && topProducts.length > 0 ? (
          <div className="space-y-3">
            {topProducts.map(product => (
              <div key={product._id} className="flex items-center p-4 border border-base-300 hover:bg-base-200 transition-all duration-200 rounded-lg group">
                <div className="w-14 h-14 bg-base-200 rounded-lg mr-4 flex items-center justify-center overflow-hidden ring-2 ring-base-300">
                  {loadingImages[product._id] ? (
                    <div className="animate-pulse w-full h-full bg-base-300"></div>
                  ) : productImages[product._id] ? (
                    <img
                      src={productImages[product._id]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite error loop
                        e.target.src = createSmallPlaceholder(product.name || 'Product');
                      }}
                    />
                  ) : (
                    <FiPackage className="text-base-content/40 w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base-content truncate">{product.name}</p>
                  <div className="flex items-center mt-2 gap-3">
                    <div className="flex-1 bg-base-300 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (product.stock / (totalStock || 1)) * 100 * 5)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-base-content/60 whitespace-nowrap">
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>
                <div className="text-primary font-bold text-lg ml-4">
                  ${parseFloat(product.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-base-content/60">
            <FiPackage className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No products available</p>
            <p className="text-sm">Products will appear here once you add them to your inventory</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProducts;

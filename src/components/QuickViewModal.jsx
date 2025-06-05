import { useState, useEffect } from "react";
import { FiX, FiShoppingCart, FiMinus, FiPlus, FiTag, FiPackage, FiBox } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { store } from "../redux/store";

// Rating Stars Component
const RatingStars = ({ rating = 4.5 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="text-amber-400" />);
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" className="text-amber-400" />);
  }

  // Add empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} className="text-amber-400" />);
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className="text-xs text-base-content/60 ml-1">({Math.round(rating * 10) / 10})</span>
    </div>
  );
};

export default function QuickViewModal({
  product,
  imageUrl,
  onClose,
  onAddToCart,
}) {
  const [quantity, setQuantity] = useState(1);

  const increment = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAdd = () => {
    // Check if product is out of stock
    if (product.stock <= 0) {
      toast.error(`Sorry, ${product.name} is out of stock!`, {
        position: "bottom-right",
      });
      return;
    }

    // Call the parent component's add to cart function
    onAddToCart(quantity);

    // Get the current state to check the success flag
    const cartState = store.getState().cart;

    // Check if we were able to add the full requested quantity
    if (!cartState.lastOperationSuccess) {
      toast.warning(`Only ${product.stock} units of ${product.name} are available. We've added the maximum available to your cart.`, {
        position: "bottom-right",
        autoClose: 5000
      });
    }

    // Close modal after adding
    onClose();
  };

  // Add animation effect when modal opens
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
      <div className="bg-base-100 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideInUp">
        <div className="relative">
          <button
            className="absolute top-4 right-4 z-10 btn btn-circle btn-sm bg-base-100 hover:bg-base-200 border-none shadow-md text-base-content"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>

          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="sticky top-0">
              <div className="h-96 bg-base-200 rounded-xl overflow-hidden shadow-inner">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>

              {/* Product badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {product.stock < 5 && product.stock > 0 && (
                  <span className="bg-warning/20 text-warning text-xs font-medium px-2.5 py-1 rounded-full border border-warning/30">
                    Only {product.stock} left
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="bg-error/20 text-error text-xs font-medium px-2.5 py-1 rounded-full border border-error/30">
                    Out of Stock
                  </span>
                )}
                {product.originalPrice && (
                  <span className="bg-success/20 text-success text-xs font-medium px-2.5 py-1 rounded-full border border-success/30">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="mb-2">
                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                  {product.category?.name || 'Uncategorized'}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-base-content mb-2">{product.name}</h2>

              {/* Rating */}
              <div className="mb-4">
                <RatingStars rating={product.rating || 4.5} />
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-base-content">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-base-content/40 line-through ml-2">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <span className="text-sm text-success font-medium mt-1 block">
                    You save: ${(product.originalPrice - product.price).toFixed(2)} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
                  </span>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-base-content">
                  <FiPackage className="w-5 h-5 text-primary" />
                  Description
                </h3>
                <p className="text-base-content/70 leading-relaxed">{product.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-base-content">
                  <FiTag className="w-5 h-5 text-primary" />
                  Details
                </h3>
                <ul className="space-y-2 text-base-content/70">
                  <li className="flex items-center gap-2">
                    <FiTag className="w-4 h-4 text-base-content/40" />
                    <span className="font-medium">Category:</span>
                    {product.category?.name || 'Uncategorized'}
                  </li>
                  <li className="flex items-center gap-2">
                    <FiBox className="w-4 h-4 text-base-content/40" />
                    <span className="font-medium">Stock:</span>
                    <span className={product.stock < 5 ? "text-warning font-medium" : ""}>
                      {product.stock} available
                    </span>
                  </li>
                </ul>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2 text-base-content">Quantity:</h3>
                <div className="flex items-center">
                  <button
                    className="w-10 h-10 rounded-l-lg border border-base-300 flex items-center justify-center hover:bg-base-200 transition-colors bg-base-100"
                    onClick={decrement}
                    disabled={quantity <= 1}
                  >
                    <FiMinus className={`w-4 h-4 ${quantity <= 1 ? 'text-base-content/30' : 'text-base-content'}`} />
                  </button>
                  <div className="w-16 h-10 border-t border-b border-base-300 flex items-center justify-center font-medium bg-base-100 text-base-content">
                    {quantity}
                  </div>
                  <button
                    className="w-10 h-10 rounded-r-lg border border-base-300 flex items-center justify-center hover:bg-base-200 transition-colors bg-base-100"
                    onClick={increment}
                    disabled={quantity >= product.stock}
                  >
                    <FiPlus className={`w-4 h-4 ${quantity >= product.stock ? 'text-base-content/30' : 'text-base-content'}`} />
                  </button>

                  <span className="ml-4 text-sm text-base-content/60">
                    {product.stock > 0 ? `Max: ${product.stock}` : 'Out of stock'}
                  </span>
                </div>
              </div>

              <button
                className="btn btn-primary w-full gap-2 h-12 text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                onClick={handleAdd}
                disabled={product.stock === 0}
              >
                <FiShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

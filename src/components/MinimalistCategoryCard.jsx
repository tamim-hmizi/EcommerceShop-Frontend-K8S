import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import PropTypes from "prop-types";

/**
 * A minimalist design for category cards with simple illustrations
 */
const MinimalistCategoryCard = ({ category, index, totalCategories }) => {
  // Generate a unique illustration for each category
  const getIllustration = (categoryName) => {
    const name = categoryName.toLowerCase();
    
    // Simple SVG illustrations for common categories
    const illustrations = {
      electronics: (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="60" height="40" rx="2" fill="#e5e7eb" />
          <rect x="25" y="25" width="50" height="30" rx="1" fill="#f3f4f6" />
          <rect x="35" y="60" width="30" height="5" rx="1" fill="#e5e7eb" />
          <rect x="45" y="65" width="10" height="15" rx="1" fill="#e5e7eb" />
        </svg>
      ),
      fashion: (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50,20 L65,30 L65,80 L35,80 L35,30 Z" fill="#f3f4f6" />
          <path d="M35,30 L30,25 L40,15 L50,20 L60,15 L70,25 L65,30" fill="#e5e7eb" />
          <rect x="45" y="40" width="10" height="20" rx="5" fill="#d1d5db" />
        </svg>
      ),
      home: (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M20,50 L50,20 L80,50 L80,80 L20,80 Z" fill="#f3f4f6" />
          <rect x="40" y="60" width="20" height="20" fill="#e5e7eb" />
          <rect x="45" y="65" width="10" height="15" fill="#d1d5db" />
        </svg>
      ),
      beauty: (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="30" r="15" fill="#f3f4f6" />
          <rect x="40" y="45" width="20" height="35" rx="10" fill="#e5e7eb" />
          <rect x="45" y="80" width="10" height="5" fill="#d1d5db" />
        </svg>
      ),
      sports: (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="30" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" />
          <path d="M30,30 L70,70 M30,70 L70,30" stroke="#d1d5db" strokeWidth="2" />
        </svg>
      ),
      books: (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="25" width="40" height="50" fill="#f3f4f6" />
          <rect x="30" y="25" width="5" height="50" fill="#e5e7eb" />
          <line x1="40" y1="35" x2="65" y2="35" stroke="#d1d5db" strokeWidth="2" />
          <line x1="40" y1="45" x2="65" y2="45" stroke="#d1d5db" strokeWidth="2" />
          <line x1="40" y1="55" x2="65" y2="55" stroke="#d1d5db" strokeWidth="2" />
        </svg>
      ),
      toys: (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="35" y="35" width="30" height="30" rx="2" fill="#f3f4f6" transform="rotate(45, 50, 50)" />
          <circle cx="50" cy="50" r="5" fill="#d1d5db" />
          <circle cx="35" cy="35" r="3" fill="#e5e7eb" />
          <circle cx="65" cy="35" r="3" fill="#e5e7eb" />
          <circle cx="35" cy="65" r="3" fill="#e5e7eb" />
          <circle cx="65" cy="65" r="3" fill="#e5e7eb" />
        </svg>
      ),
      food: (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="25" fill="#f3f4f6" />
          <path d="M50,25 L55,45 L75,50 L55,55 L50,75 L45,55 L25,50 L45,45 Z" fill="#e5e7eb" />
        </svg>
      ),
      // Default illustration for any other category
      default: (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="25" width="50" height="50" rx="5" fill="#f3f4f6" />
          <circle cx="50" cy="50" r="15" fill="#e5e7eb" />
          <path d="M40,40 L60,60 M40,60 L60,40" stroke="#d1d5db" strokeWidth="2" />
        </svg>
      )
    };
    
    // Try to match the category name with our illustrations
    for (const [key, illustration] of Object.entries(illustrations)) {
      if (name.includes(key)) {
        return illustration;
      }
    }
    
    // Return default illustration if no match
    return illustrations.default;
  };

  // Alternate background colors
  const bgColors = [
    "bg-gray-50",
    "bg-indigo-50",
    "bg-purple-50",
    "bg-blue-50",
    "bg-green-50",
    "bg-amber-50"
  ];
  
  const bgColor = bgColors[index % bgColors.length];

  return (
    <Link
      to={`/product?category=${category._id}`}
      className={`group relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${bgColor} flex flex-col h-64`}
    >
      {/* Illustration */}
      <div className="flex-1 flex items-center justify-center p-6 transition-transform group-hover:scale-110 duration-300">
        <div className="w-32 h-32">
          {getIllustration(category.name)}
        </div>
      </div>
      
      {/* Category content */}
      <div className="bg-white p-4 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{totalCategories} products</span>
          <span className="text-indigo-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            Shop <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
      
      {/* Category number badge */}
      <div className="absolute top-3 left-3 bg-white text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center shadow-sm text-gray-500">
        {index + 1}
      </div>
    </Link>
  );
};

MinimalistCategoryCard.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  totalCategories: PropTypes.number.isRequired
};

export default MinimalistCategoryCard;

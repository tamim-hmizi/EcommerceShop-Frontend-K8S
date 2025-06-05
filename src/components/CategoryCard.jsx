import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import PropTypes from "prop-types";

/**
 * A modern, abstract design for category cards that doesn't rely on external images
 */
const CategoryCard = ({ category, index, totalCategories }) => {
  // Array of vibrant color combinations for the abstract patterns
  const colorSchemes = [
    { primary: "#4F46E5", secondary: "#818CF8", accent: "#C7D2FE" }, // Indigo
    { primary: "#7C3AED", secondary: "#A78BFA", accent: "#DDD6FE" }, // Violet
    { primary: "#0EA5E9", secondary: "#38BDF8", accent: "#BAE6FD" }, // Sky
    { primary: "#10B981", secondary: "#34D399", accent: "#A7F3D0" }, // Emerald
    { primary: "#F59E0B", secondary: "#FBBF24", accent: "#FDE68A" }, // Amber
    { primary: "#EC4899", secondary: "#F472B6", accent: "#FBCFE8" }, // Pink
  ];

  // Select a color scheme based on the category index
  const colorScheme = colorSchemes[index % colorSchemes.length];

  // Generate a unique pattern for each category
  const getPattern = () => {
    // Different pattern styles based on index
    const patterns = [
      // Circles pattern
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="15" fill={colorScheme.secondary} opacity="0.5" />
        <circle cx="80" cy="30" r="20" fill={colorScheme.primary} opacity="0.7" />
        <circle cx="40" cy="70" r="25" fill={colorScheme.accent} opacity="0.6" />
        <circle cx="75" cy="75" r="10" fill={colorScheme.secondary} opacity="0.8" />
      </svg>,
      
      // Waves pattern
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,30 Q25,10 50,30 T100,30 V100 H0 Z" fill={colorScheme.primary} opacity="0.7" />
        <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill={colorScheme.secondary} opacity="0.5" />
        <path d="M0,70 Q25,50 50,70 T100,70 V100 H0 Z" fill={colorScheme.accent} opacity="0.3" />
      </svg>,
      
      // Geometric pattern
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="0,0 50,0 25,40" fill={colorScheme.primary} opacity="0.7" />
        <polygon points="50,0 100,0 75,40" fill={colorScheme.secondary} opacity="0.5" />
        <polygon points="25,40 75,40 50,80" fill={colorScheme.accent} opacity="0.6" />
        <polygon points="0,100 50,100 25,60" fill={colorScheme.secondary} opacity="0.4" />
        <polygon points="50,100 100,100 75,60" fill={colorScheme.primary} opacity="0.3" />
      </svg>,
      
      // Diagonal stripes
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="120" height="20" transform="rotate(45)" fill={colorScheme.primary} opacity="0.7" />
        <rect x="0" y="30" width="120" height="15" transform="rotate(45)" fill={colorScheme.secondary} opacity="0.5" />
        <rect x="0" y="60" width="120" height="10" transform="rotate(45)" fill={colorScheme.accent} opacity="0.3" />
        <rect x="0" y="80" width="120" height="5" transform="rotate(45)" fill={colorScheme.primary} opacity="0.2" />
      </svg>,
      
      // Dots pattern
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 10 }).map((_, i) => 
          Array.from({ length: 10 }).map((_, j) => (
            <circle 
              key={`${i}-${j}`}
              cx={i * 10 + 5} 
              cy={j * 10 + 5} 
              r={(i + j) % 3 + 1}
              fill={j % 2 === 0 ? colorScheme.primary : colorScheme.secondary}
              opacity={(i + j) % 5 * 0.1 + 0.3}
            />
          ))
        )}
      </svg>,
      
      // Abstract shapes
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,0 L50,20 L100,0 L80,50 L100,100 L50,80 L0,100 L20,50 Z" fill={colorScheme.primary} opacity="0.2" />
        <path d="M25,25 L75,25 L75,75 L25,75 Z" fill={colorScheme.secondary} opacity="0.3" />
        <circle cx="50" cy="50" r="20" fill={colorScheme.accent} opacity="0.4" />
      </svg>
    ];
    
    return patterns[index % patterns.length];
  };

  return (
    <Link
      to={`/product?category=${category._id}`}
      className="group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl bg-white h-64 flex flex-col"
    >
      {/* Abstract pattern background */}
      <div className="absolute inset-0 opacity-80 overflow-hidden">
        {getPattern()}
      </div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10"></div>
      
      {/* Category content */}
      <div className="relative z-20 p-6 mt-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ color: colorScheme.primary }}>
          {category.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          Explore our collection of {category.name.toLowerCase()} products.
        </p>
        <span className="inline-flex items-center gap-2 font-medium" style={{ color: colorScheme.primary }}>
          Shop Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
      
      {/* Category badge */}
      <div className="absolute top-4 right-4 z-20 bg-white/90 text-xs font-medium px-2 py-1 rounded-full shadow-sm" 
           style={{ color: colorScheme.primary }}>
        {index + 1} of {totalCategories}
      </div>
    </Link>
  );
};

CategoryCard.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  totalCategories: PropTypes.number.isRequired
};

export default CategoryCard;

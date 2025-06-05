import { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import { constructImageUrl } from '../utils/imageUtils';

const Avatar = ({ 
  src, 
  alt = "Profile", 
  size = "md", 
  className = "",
  fallbackText = "",
  showFallbackIcon = true,
  onClick = null,
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Size classes mapping
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm", 
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-20 h-20 text-xl",
    "2xl": "w-24 h-24 text-2xl",
    "3xl": "w-32 h-32 text-3xl"
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-10 h-10",
    "2xl": "w-12 h-12",
    "3xl": "w-16 h-16"
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const imageUrl = src ? constructImageUrl(src) : null;
  const shouldShowImage = imageUrl && !imageError;
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const iconSize = iconSizes[size] || iconSizes.md;

  // Generate initials from fallback text
  const getInitials = (text) => {
    if (!text) return "";
    return text
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(fallbackText);

  const baseClasses = `
    ${sizeClass}
    rounded-full
    flex
    items-center
    justify-center
    overflow-hidden
    bg-gradient-to-br
    from-primary/20
    to-primary/10
    border-2
    border-primary/20
    transition-all
    duration-200
    ${onClick ? 'cursor-pointer hover:border-primary/40 hover:shadow-md' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div 
      className={baseClasses}
      onClick={onClick}
      {...props}
    >
      {shouldShowImage ? (
        <>
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-200 animate-pulse">
              <div className={`${iconSize} text-base-content/40`}>
                <FiUser />
              </div>
            </div>
          )}
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          {initials ? (
            <span className="font-semibold text-primary select-none">
              {initials}
            </span>
          ) : showFallbackIcon ? (
            <FiUser className={`${iconSize} text-primary/60`} />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Avatar;

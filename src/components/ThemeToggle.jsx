import { useTheme } from '../hooks/useTheme';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = ({ 
  size = 'md', 
  showLabel = false, 
  className = '',
  variant = 'toggle' // 'toggle' or 'button'
}) => {
  const { currentTheme, toggleTheme, isDark } = useTheme();

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`btn btn-ghost btn-circle ${size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''} ${className}`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <div className="relative">
          {isDark ? (
            <FiSun className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} transition-all duration-300 text-yellow-500`} />
          ) : (
            <FiMoon className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} transition-all duration-300 text-slate-600`} />
          )}
        </div>
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
      
      <label className="swap swap-rotate">
        <input
          type="checkbox"
          checked={isDark}
          onChange={toggleTheme}
          className="sr-only"
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        />
        
        {/* Sun icon */}
        <FiSun className={`swap-off fill-current ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} text-yellow-500 transition-all duration-300`} />
        
        {/* Moon icon */}
        <FiMoon className={`swap-on fill-current ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} text-slate-300 transition-all duration-300`} />
      </label>
      
      {showLabel && (
        <span className="text-sm text-base-content/70">
          Mode
        </span>
      )}
    </div>
  );
};

export default ThemeToggle;

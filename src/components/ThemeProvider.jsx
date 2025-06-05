import { useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeProvider = ({ children }) => {
  const { currentTheme } = useTheme();

  // Initialize theme on mount
  useEffect(() => {
    // Apply theme to document root
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', currentTheme);
      document.documentElement.className = currentTheme;
    }
  }, [currentTheme]);

  return children;
};

export default ThemeProvider;

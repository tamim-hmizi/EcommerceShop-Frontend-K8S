import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme, toggleTheme, setSystemPreference } from '../redux/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { currentTheme, systemPreference } = useSelector((state) => state.theme);

  // Apply theme to document
  useEffect(() => {
    const applyTheme = (theme) => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
        // Also update the class for better compatibility
        document.documentElement.className = theme;
      }
    };

    applyTheme(currentTheme);
  }, [currentTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        const newSystemPreference = e.matches ? 'dark' : 'light';
        dispatch(setSystemPreference(newSystemPreference));
      };

      // Set initial system preference
      dispatch(setSystemPreference(mediaQuery.matches ? 'dark' : 'light'));
      
      // Listen for changes
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [dispatch]);

  const changeTheme = (theme) => {
    if (['light', 'dark'].includes(theme)) {
      dispatch(setTheme(theme));
    }
  };

  const toggle = () => {
    dispatch(toggleTheme());
  };

  return {
    currentTheme,
    systemPreference,
    setTheme: changeTheme,
    toggleTheme: toggle,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light'
  };
};

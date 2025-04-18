import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  theme: 'default' | 'dark' | 'sepia';
  setTheme: (theme: 'default' | 'dark' | 'sepia') => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: true,
  toggleDarkMode: () => {},
  theme: 'default',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize state from localStorage or default to dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : true;
  });
  
  const [theme, setThemeState] = useState<'default' | 'dark' | 'sepia'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as 'default' | 'dark' | 'sepia') || 'default';
  });

  // Save to localStorage when darkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);
  
  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Apply theme class to body
    document.body.classList.remove('theme-default', 'theme-dark', 'theme-sepia');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  
  const setTheme = (newTheme: 'default' | 'dark' | 'sepia') => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

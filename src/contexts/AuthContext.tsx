import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{success: boolean; message?: string}>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have a stored user session in localStorage
    const checkSession = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (e) {
            // Invalid JSON, clear it
            localStorage.removeItem('user');
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simple mock authentication
      // Admin user check
      if (email.includes('admin') || email === 'biniyam.getachew@aastustudent.edu.et') {
        // Create a mock admin user with a valid UUID
        const mockAdminUser = {
          id: '00000000-0000-0000-0000-000000000000', // Valid UUID format
          email: email,
          name: email.split('@')[0],
          role: 'admin'
        };

        // Store the admin user in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(mockAdminUser));
        setUser(mockAdminUser);
        return { success: true };
      }
      // Regular user
      else if (email && password) {
        // Create a mock regular user
        const mockUser = {
          id: '11111111-1111-1111-1111-111111111111', // Valid UUID format
          email: email,
          name: email.split('@')[0],
          role: 'user'
        };

        // Store the user data in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return { success: true };
      }

      return { success: false, message: 'Invalid email or password' };
    } catch (err: any) {
      return { success: false, message: err.message || 'An error occurred during login' };
    }
  };

  const logout = async () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

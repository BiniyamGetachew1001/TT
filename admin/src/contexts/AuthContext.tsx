import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://ygamcvlfdxawhirwugcd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnYW1jdmxmZHhhd2hpcnd1Z2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDIzNjQsImV4cCI6MjA2MDAxODM2NH0.Mdb42Wtpe9SPm4N2YpKRgKmachbGFlYfRVTbrTV822M';
const supabase = createClient(supabaseUrl, supabaseKey);

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  supabase
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        // Check if we have a stored admin session in localStorage
        const storedUser = localStorage.getItem('adminUser');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsLoading(false);
            return;
          } catch (e) {
            // Invalid JSON, clear it
            localStorage.removeItem('adminUser');
          }
        }

        // Regular Supabase session check
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error checking session:', error);
          setIsLoading(false);
          return;
        }

        if (session) {
          // Get user profile data
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, name, role')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            setIsLoading(false);
            return;
          }

          setUser(userData);
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get user profile data
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, name, role')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            return;
          }

          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('adminUser');
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // For testing purposes, allow a specific email to bypass authentication
      if (email === 'biniyam.getachew@aastustudent.edu.et') {
        // Create a mock admin user
        const mockAdminUser = {
          id: 'admin-user-id',
          email: email,
          name: 'Biniyam Getachew',
          role: 'admin'
        };

        // Store the admin user in localStorage for persistence
        localStorage.setItem('adminUser', JSON.stringify(mockAdminUser));
        setUser(mockAdminUser);
        return { success: true };
      }

      // Regular authentication flow for other users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (!data.user) {
        return { success: false, message: 'Login failed' };
      }

      // Get user profile data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, name, role')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        return { success: false, message: 'Failed to fetch user data' };
      }

      // Check if user is an admin
      if (userData.role !== 'admin') {
        await supabase.auth.signOut();
        return { success: false, message: 'Unauthorized: Admin access required' };
      }

      // Store the user data in localStorage for persistence
      localStorage.setItem('adminUser', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'An error occurred during login' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminUser');
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
        logout,
        supabase
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

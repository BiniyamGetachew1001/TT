import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from || '/';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        // Redirect to the page they were trying to access
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="glass-card p-8">
        <h1 className="text-2xl font-bold mb-6 text-center gold-text">Log In</h1>
        
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#3a2819] border border-[#7a4528]/50 rounded-md focus:outline-none focus:border-[#c9a52c]/50"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#3a2819] border border-[#7a4528]/50 rounded-md focus:outline-none focus:border-[#c9a52c]/50"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            className={`w-full py-3 px-6 bg-[#c9a52c] hover:bg-[#b08d1e] text-[#2d1e14] font-medium rounded-md flex items-center justify-center transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2d1e14] mr-2"></div>
                Logging in...
              </>
            ) : (
              'Log In'
            )}
          </button>
          
          <div className="mt-4 text-center text-sm text-gray-400">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#c9a52c] hover:underline">
                Sign up
              </Link>
            </p>
            <p className="mt-2">
              <Link to="/forgot-password" className="text-[#c9a52c] hover:underline">
                Forgot your password?
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

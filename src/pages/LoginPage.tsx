import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to home
  const from = location.state?.from || '/';

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // For demo purposes, handle the admin login specially
      if (email === 'biniyam.getachew@aastustudent.edu.et') {
        // Any password works for the admin in demo mode
        const result = await login(email, password);

        if (result.success) {
          // Show success message before redirect
          setSuccessMessage('Login successful! Redirecting to admin panel...');
          // Redirect will happen in the useEffect
        } else {
          setError(result.message || 'Failed to log in as admin');
        }
      } else {
        // Regular login flow for other users
        const result = await login(email, password);

        if (result.success) {
          // Redirect will happen in the useEffect
        } else {
          setError(result.message || 'Invalid email or password');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login. Please try again.');
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

        {successMessage && (
          <div className="bg-green-900/30 border border-green-500/50 text-green-200 px-4 py-3 rounded-md mb-6">
            {successMessage}
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

          <div className="mt-8 pt-6 border-t border-[#7a4528]/30">
            <h3 className="text-center text-sm font-medium text-gray-300 mb-4">Quick Access for Demo</h3>
            <button
              type="button"
              onClick={() => {
                setEmail('biniyam.getachew@aastustudent.edu.et');
                setPassword('admin123');
                // Auto-submit the form after a short delay
                setTimeout(() => {
                  const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                  if (submitButton) submitButton.click();
                }, 500);
              }}
              className="w-full py-2 px-4 bg-[#3a2819] hover:bg-[#4a2e1c] text-white font-medium rounded-md flex items-center justify-center transition-colors mb-2"
            >
              Login as Admin
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              For demo purposes only. Click the button and then submit the form.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

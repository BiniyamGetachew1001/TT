import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BlogPostsPage from './pages/BlogPostsPage';
import BlogPostEditPage from './pages/BlogPostEditPage';
import BookSummariesPage from './pages/BookSummariesPage';
import BusinessPlansPage from './pages/BusinessPlansPage';
import UsersPage from './pages/UsersPage';
import PurchasesPage from './pages/PurchasesPage';
import SettingsPage from './pages/SettingsPage';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a52c]"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Navigate to="/dashboard" replace />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Blog Posts Routes */}
      <Route
        path="/blog-posts"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BlogPostsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/blog-posts/edit/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BlogPostEditPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/blog-posts/view/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BlogPostEditPage readOnly={true} />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/blog-posts/new"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BlogPostEditPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Book Summaries Routes */}
      <Route
        path="/book-summaries"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BookSummariesPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-summaries/edit/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BookSummaryEditPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-summaries/view/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BookSummaryEditPage readOnly={true} />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-summaries/new"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BookSummaryEditPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Business Plans Routes */}
      <Route
        path="/business-plans"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BusinessPlansPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/business-plans/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BusinessPlansPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Users Route */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <UsersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Purchases Route */}
      <Route
        path="/purchases"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <PurchasesPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Settings Route */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <SettingsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import FeaturesPage from './pages/FeaturesPage';
import BookSummariesPage from './pages/BookSummariesPage';
import BusinessPlansPage from './pages/BusinessPlansPage';
import BookDetailPage from './pages/BookDetailPage';
import BookmarksPage from './pages/BookmarksPage';
import SettingsPage from './pages/SettingsPage';
import ReadingPage from './pages/ReadingPage';
import AccountPage from './pages/AccountPage';
import OfflineLibraryPage from './pages/OfflineLibraryPage';
import BlogPage from './pages/BlogPage';
import BlogPostDetailPage from './pages/BlogPostDetailPage';
import PurchasesPage from './pages/PurchasesPage';
import BookPurchasePage from './pages/BookPurchasePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ContentManagementPage from './pages/ContentManagementPage';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <BookmarkProvider>
          <ThemeProvider>
            <Layout>
              <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/book-summaries" element={<BookSummariesPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/reading/:id" element={<ReadingPage />} />
            <Route path="/business-plans" element={<BusinessPlansPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/offline-library" element={<OfflineLibraryPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostDetailPage />} />
            <Route path="/purchases" element={<PurchasesPage />} />
            <Route path="/books/:id/purchase" element={<BookPurchasePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/content" element={<ContentManagementPage />} />
              </Routes>
            </Layout>
          </ThemeProvider>
        </BookmarkProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

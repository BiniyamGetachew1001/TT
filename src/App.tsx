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
import { BookmarkProvider } from './contexts/BookmarkContext';
import './index.css';

const App = () => {
  return (
    <Router>
      <BookmarkProvider>
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
          </Routes>
        </Layout>
      </BookmarkProvider>
    </Router>
  );
};

export default App;

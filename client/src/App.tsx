import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import BookSummariesPage from './pages/BookSummariesPage';
import BookDetailPage from './pages/BookDetailPage';
import ReadingPage from './pages/ReadingPage';
import BookmarksPage from './pages/BookmarksPage';
import BusinessPlansPage from './pages/BusinessPlansPage';
import BusinessPlanDetailPage from './pages/BusinessPlanDetailPage';
import SupabaseTest from './components/SupabaseTest';

function App() {
  return (
    <Router>
      <Routes>
        {/* Test route completely separate */}
        <Route path="/test" element={
          <div className="min-h-screen">
            <SupabaseTest />
          </div>
        } />
        
        {/* All other routes with Layout */}
        <Route path="/*" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="book-summaries" element={<BookSummariesPage />} />
          <Route path="book-summaries/:id" element={<BookDetailPage />} />
          <Route path="reading/:id" element={<ReadingPage />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="business-plans" element={<BusinessPlansPage />} />
          <Route path="business-plans/:id" element={<BusinessPlanDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

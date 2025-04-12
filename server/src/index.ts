import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookSummariesRouter from './routes/bookSummaries';
import businessPlansRouter from './routes/businessPlans';
import blogPostsRouter from './routes/blogPosts';
import purchasesRouter from './routes/purchases';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/book-summaries', bookSummariesRouter);
app.use('/api/business-plans', businessPlansRouter);
app.use('/api/blog-posts', blogPostsRouter);
app.use('/api/purchases', purchasesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
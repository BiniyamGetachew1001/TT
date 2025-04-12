import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { purchaseBook } from '../services/purchaseService';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
  Alert
} from '@mui/material';
import { ShoppingCart, Lock, CheckCircle } from '@mui/icons-material';

interface BookPurchaseProps {
  book: any;
  isPurchased: boolean;
  onPurchaseComplete: () => void;
}

const BookPurchase: React.FC<BookPurchaseProps> = ({ book, isPurchased, onPurchaseComplete }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would redirect to Chapa payment
      // For now, we'll simulate a successful payment
      const result = await purchaseBook(user.id, book.id, book.price);
      
      if (result.success) {
        setPaymentSuccess(true);
        setTimeout(() => {
          onPurchaseComplete();
        }, 2000);
      } else {
        setError(result.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during payment. Please try again.');
      console.error('Purchase error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={book.coverImage || '/placeholder-book.jpg'}
              alt={book.title}
              sx={{ objectFit: 'contain' }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {book.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                By {book.author}
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                <Chip label={book.category} size="small" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {book.readTime}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Purchase Summary
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" paragraph>
              {book.description}
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              What You'll Get
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography>Full access to the book summary</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography>Key insights and takeaways</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography>Lifetime access to content updates</Typography>
              </Box>
            </Box>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 3 }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h6">Price:</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  ${book.price.toFixed(2)} USD
                </Typography>
              </Grid>
            </Grid>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {paymentSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Payment successful! You now have access to this book summary.
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {isPurchased ? (
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<CheckCircle />}
                fullWidth
                onClick={() => navigate(`/read/book-summary/${book.id}`)}
              >
                Read Now
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <ShoppingCart />}
                disabled={isLoading || paymentSuccess}
                fullWidth
                onClick={handlePurchase}
              >
                {isLoading ? 'Processing...' : 'Purchase Now'}
              </Button>
            )}
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              Secure payment powered by Chapa
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BookPurchase;

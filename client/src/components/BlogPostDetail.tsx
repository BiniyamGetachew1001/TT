import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Divider,
  Avatar,
  Paper,
  Container,
  Grid
} from '@mui/material';
import { CalendarToday, Person } from '@mui/icons-material';

interface BlogPostDetailProps {
  post: {
    title: string;
    content: string;
    coverImage?: string;
    category: string;
    publishedAt: string;
    author: {
      name: string;
    };
    tags: string[];
  };
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <Container maxWidth="lg">
      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Chip 
            label={post.category} 
            color="primary" 
            sx={{ mb: 2 }}
          />
          
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            {post.title}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {post.author.name}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {formatDate(post.publishedAt)}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Featured Image */}
        {post.coverImage && (
          <Box 
            sx={{ 
              mb: 4, 
              height: { xs: '200px', sm: '300px', md: '400px' },
              overflow: 'hidden',
              borderRadius: 2
            }}
          >
            <img 
              src={post.coverImage} 
              alt={post.title}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }}
            />
          </Box>
        )}
        
        {/* Content */}
        <Box 
          sx={{ 
            mb: 4,
            '& img': { 
              maxWidth: '100%', 
              height: 'auto',
              borderRadius: 1,
              my: 2
            },
            '& h2': {
              fontSize: '1.75rem',
              fontWeight: 'bold',
              mt: 4,
              mb: 2
            },
            '& h3': {
              fontSize: '1.5rem',
              fontWeight: 'bold',
              mt: 3,
              mb: 2
            },
            '& p': {
              mb: 2,
              lineHeight: 1.7
            },
            '& ul, & ol': {
              pl: 4,
              mb: 2
            },
            '& li': {
              mb: 1
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: 2,
              py: 1,
              my: 2,
              fontStyle: 'italic',
              bgcolor: 'background.paper'
            }
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {post.tags.map((tag) => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}
        
        {/* Author Info */}
        <Divider sx={{ mb: 4 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ width: 64, height: 64, mr: 2 }}
            alt={post.author.name}
            src="/placeholder-avatar.jpg"
          />
          <Box>
            <Typography variant="h6">
              {post.author.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Author
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      {/* Related Posts Placeholder */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          You might also like
        </Typography>
        <Grid container spacing={3}>
          {/* Related posts would go here */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Related post placeholder
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Related post placeholder
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Related post placeholder
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BlogPostDetail;

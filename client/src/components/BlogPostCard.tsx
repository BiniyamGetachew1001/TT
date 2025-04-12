import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Avatar
} from '@mui/material';

interface BlogPostCardProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    category: string;
    publishedAt: string;
    author: {
      name: string;
    };
    tags: string[];
  };
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <Card 
      component={Link} 
      to={`/blog/${post.id}`}
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        textDecoration: 'none',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={post.coverImage || '/placeholder-blog.jpg'}
        alt={post.title}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 1 }}>
          <Chip 
            label={post.category} 
            size="small" 
            color="primary" 
            sx={{ mb: 1 }}
          />
        </Box>
        
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            color: 'text.primary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {post.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {post.excerpt}
        </Typography>
        
        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ width: 32, height: 32, mr: 1 }}
              alt={post.author.name}
              src="/placeholder-avatar.jpg"
            />
            <Typography variant="body2" color="text.secondary">
              {post.author.name}
            </Typography>
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            {formatDate(post.publishedAt)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;

import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, User } from 'lucide-react';

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
    <Link
      to={`/blog/${post.id}`}
      className="block h-full transition-all duration-300 hover:scale-105"
    >
      <div className="bg-[#3a2819] rounded-xl overflow-hidden h-full flex flex-col border border-[#7a4528]/30 hover:border-[#c9a52c]/50">
        {/* Cover Image */}
        {post.coverImage ? (
          <div className="h-48 overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
              onLoad={() => console.log('Card image loaded successfully:', post.coverImage)}
              onError={(e) => {
                console.error('Error loading card image:', post.coverImage);
                // Fallback to a placeholder image
                e.currentTarget.src = '/placeholder-blog.jpg';
              }}
            />
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center bg-[#3a2819]">
            <span className="text-gray-400">No image available</span>
          </div>
        )}

        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[#c9a52c]/20 text-[#c9a52c]">
              {post.category}
            </span>
          </div>

          <h3 className="text-xl font-bold mb-2 text-white">{post.title}</h3>

          <p className="text-gray-400 mb-4 flex-grow">
            {post.excerpt.length > 120
              ? `${post.excerpt.substring(0, 120)}...`
              : post.excerpt}
          </p>

          <div className="flex items-center justify-between mt-auto text-sm text-gray-400">
            <div className="flex items-center">
              <User size={14} className="mr-1" />
              <span>{post.author.name}</span>
            </div>

            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;

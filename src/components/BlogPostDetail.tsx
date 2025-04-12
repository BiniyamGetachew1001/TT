import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/blog" className="inline-flex items-center text-gray-400 hover:text-[#c9a52c] transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Blog</span>
        </Link>
      </div>

      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[#c9a52c]/20 text-[#c9a52c]">
          {post.category}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{post.title}</h1>

      <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-400">
        <div className="flex items-center">
          <User size={16} className="mr-1" />
          <span>{post.author.name}</span>
        </div>

        <div className="flex items-center">
          <Calendar size={16} className="mr-1" />
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage ? (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto max-h-[400px] object-cover"
            onLoad={() => console.log('Image loaded successfully:', post.coverImage)}
            onError={(e) => {
              console.error('Error loading image:', post.coverImage);
              // Fallback to a placeholder image
              e.currentTarget.src = '/placeholder-blog.jpg';
            }}
          />
          <p className="text-xs text-gray-500 mt-1">Image URL: {post.coverImage}</p>
        </div>
      ) : (
        <div className="mb-8 p-4 rounded-xl bg-[#3a2819] text-center">
          <p className="text-gray-400">No cover image available</p>
        </div>
      )}

      <div
        className="prose prose-invert prose-gold max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#7a4528]">
          <div className="flex flex-wrap items-center gap-2">
            <Tag size={16} className="text-gray-400" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[#3a2819] text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-[#7a4528]">
        <h3 className="text-xl font-bold mb-4 text-white">Related Posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#3a2819] rounded-lg p-4 border border-[#7a4528]/30">
            <p className="text-gray-400 text-center">Related posts will appear here</p>
          </div>
          <div className="bg-[#3a2819] rounded-lg p-4 border border-[#7a4528]/30">
            <p className="text-gray-400 text-center">Related posts will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;

// Mock data
import { mockBlogPosts } from '../data/mockBlogPosts';
import { mockBookSummaries } from '../data/mockBookSummaries';
import { mockBusinessPlans } from '../data/mockBusinessPlans';
import { mockUsers } from '../data/mockUsers';
import { mockPurchases } from '../data/mockPurchases';

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service
const mockApi = {
  // Auth
  login: async (email: string, password: string) => {
    await delay(800);
    if (email === 'biniyam.getachew@aastustudent.edu.et') {
      return {
        success: true,
        data: {
          user: {
            id: 'admin-user-id',
            email,
            name: 'Biniyam Getachew',
            role: 'admin'
          },
          token: 'mock-jwt-token'
        }
      };
    }
    throw new Error('Invalid credentials');
  },
  
  // Dashboard
  getDashboardStats: async () => {
    await delay(1000);
    return {
      totalUsers: 245,
      totalBooks: 78,
      totalBlogs: 42,
      totalPurchases: 156,
      revenue: 3850,
      activeUsers: 89,
      recentPurchases: mockPurchases.slice(0, 4),
      popularContent: [
        { id: 'c1', title: 'The Psychology of Money', type: 'book', views: 1245 },
        { id: 'c2', title: 'How to Start a Successful Business in 2023', type: 'blog', views: 987 },
        { id: 'c3', title: 'E-commerce Business Plan', type: 'plan', views: 876 },
        { id: 'c4', title: 'Atomic Habits', type: 'book', views: 754 },
      ]
    };
  },
  
  // Blog Posts
  getBlogPosts: async () => {
    await delay(800);
    return mockBlogPosts;
  },
  
  getBlogPost: async (id: string) => {
    await delay(500);
    const post = mockBlogPosts.find(post => post.id === id);
    if (!post) throw new Error('Blog post not found');
    return post;
  },
  
  createBlogPost: async (data: any) => {
    await delay(1000);
    const newPost = {
      id: `blog-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newPost;
  },
  
  updateBlogPost: async (id: string, data: any) => {
    await delay(1000);
    const post = mockBlogPosts.find(post => post.id === id);
    if (!post) throw new Error('Blog post not found');
    return {
      ...post,
      ...data,
      updatedAt: new Date().toISOString()
    };
  },
  
  deleteBlogPost: async (id: string) => {
    await delay(800);
    return { success: true };
  },
  
  // Book Summaries
  getBookSummaries: async () => {
    await delay(800);
    return mockBookSummaries;
  },
  
  getBookSummary: async (id: string) => {
    await delay(500);
    const book = mockBookSummaries.find(book => book.id === id);
    if (!book) throw new Error('Book summary not found');
    return book;
  },
  
  createBookSummary: async (data: any) => {
    await delay(1000);
    const newBook = {
      id: `book-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newBook;
  },
  
  updateBookSummary: async (id: string, data: any) => {
    await delay(1000);
    const book = mockBookSummaries.find(book => book.id === id);
    if (!book) throw new Error('Book summary not found');
    return {
      ...book,
      ...data,
      updatedAt: new Date().toISOString()
    };
  },
  
  deleteBookSummary: async (id: string) => {
    await delay(800);
    return { success: true };
  },
  
  // Business Plans
  getBusinessPlans: async () => {
    await delay(800);
    return mockBusinessPlans;
  },
  
  getBusinessPlan: async (id: string) => {
    await delay(500);
    const plan = mockBusinessPlans.find(plan => plan.id === id);
    if (!plan) throw new Error('Business plan not found');
    return plan;
  },
  
  createBusinessPlan: async (data: any) => {
    await delay(1000);
    const newPlan = {
      id: `plan-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newPlan;
  },
  
  updateBusinessPlan: async (id: string, data: any) => {
    await delay(1000);
    const plan = mockBusinessPlans.find(plan => plan.id === id);
    if (!plan) throw new Error('Business plan not found');
    return {
      ...plan,
      ...data,
      updatedAt: new Date().toISOString()
    };
  },
  
  deleteBusinessPlan: async (id: string) => {
    await delay(800);
    return { success: true };
  },
  
  // Users
  getUsers: async () => {
    await delay(800);
    return mockUsers;
  },
  
  getUser: async (id: string) => {
    await delay(500);
    const user = mockUsers.find(user => user.id === id);
    if (!user) throw new Error('User not found');
    return user;
  },
  
  createUser: async (data: any) => {
    await delay(1000);
    const newUser = {
      id: `user-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    return newUser;
  },
  
  updateUser: async (id: string, data: any) => {
    await delay(1000);
    const user = mockUsers.find(user => user.id === id);
    if (!user) throw new Error('User not found');
    return {
      ...user,
      ...data
    };
  },
  
  deleteUser: async (id: string) => {
    await delay(800);
    return { success: true };
  },
  
  // Purchases
  getPurchases: async () => {
    await delay(800);
    return mockPurchases;
  },
  
  getPurchase: async (id: string) => {
    await delay(500);
    const purchase = mockPurchases.find(purchase => purchase.id === id);
    if (!purchase) throw new Error('Purchase not found');
    return purchase;
  },
  
  updatePurchaseStatus: async (id: string, status: string) => {
    await delay(800);
    const purchase = mockPurchases.find(purchase => purchase.id === id);
    if (!purchase) throw new Error('Purchase not found');
    return {
      ...purchase,
      status
    };
  }
};

export default mockApi;

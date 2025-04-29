export const mockSummaries = [
  {
    id: 1,
    title: "The Lean Startup",
    author: "Eric Ries",
    category: "Entrepreneurship",
    isPremium: true,
    description: "How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses",
    readTime: "15 min read",
    coverImage: "https://images.unsplash.com/photo-1492619267744-f1e85bf85d4a?q=80&w=300&auto=format&fit=crop",
    content: {
      summary: "The Lean Startup offers entrepreneurs a way to test their vision continuously, to adapt and adjust before it's too late. It provides a scientific approach to creating and managing successful startups in an age when companies need to innovate more than ever.",
      keyPoints: [
        "Build-Measure-Learn: A core component of lean startup methodology.",
        "Minimum Viable Product (MVP): Build a version of your product that allows you to collect the maximum amount of validated learning with the least effort.",
        "Validated Learning: Every initiative should be an experiment designed to provide learning.",
        "Innovation Accounting: A quantitative approach to measure if changes to products are producing results.",
        "Pivot: A structured course correction designed to test a new fundamental hypothesis about the product."
      ],
      chapters: [
        {
          title: "Vision",
          content: "This section explains how the Lean Startup method helps entrepreneurs define their vision, organize their teams, and harness customer feedback."
        },
        {
          title: "Steer",
          content: "Here Ries explores how startups turn an idea into a product, measure customers' reactions and behaviors, and decide whether to pivot or persevere."
        },
        {
          title: "Accelerate",
          content: "This section discusses techniques that allow Lean Startups to grow without sacrificing quality by accelerating customer feedback loops."
        }
      ],
      quotes: [
        "The only way to win is to learn faster than anyone else.",
        "Success is not delivering a feature; success is learning how to solve the customer's problem.",
        "A startup is a human institution designed to create a new product or service under conditions of extreme uncertainty."
      ]
    }
  },
  {
    id: 2,
    title: "Zero to One",
    author: "Peter Thiel",
    category: "Startups",
    isPremium: true,
    description: "Notes on Startups, or How to Build the Future",
    readTime: "12 min read",
    coverImage: "https://images.unsplash.com/photo-1623018035782-b269248df916?q=80&w=300&auto=format&fit=crop",
    content: {
      summary: "Zero to One presents at once an optimistic view of the future of progress in America and a new way of thinking about innovation: it starts by learning to ask the questions that lead you to find value in unexpected places.",
      keyPoints: [
        "Horizontal vs. Vertical Progress: Going from 1 to n (copying) versus 0 to 1 (creating something new).",
        "Monopolies are Good: For both business and society, monopolies drive innovation.",
        "The Power Law: A small number of companies radically outperform all others.",
        "Secrets: Every great business is built around a secret that's hidden from the outside.",
        "The Founder's Paradox: Founders are often strange people with extreme traits."
      ],
      chapters: [
        {
          title: "The Challenge of the Future",
          content: "Thiel discusses how to think about innovation and the importance of creating truly new things (going from 0 to 1) rather than merely copying what works (going from 1 to n)."
        },
        {
          title: "Party Like It's 1999",
          content: "This chapter examines the lessons from the dot-com crash and how they've shaped today's business thinking, sometimes in harmful ways."
        },
        {
          title: "All Happy Companies Are Different",
          content: "Here Thiel argues that monopolies drive progress and explains why companies should strive to be unique rather than competitive."
        }
      ],
      quotes: [
        "What important truth do very few people agree with you on?",
        "The most contrarian thing of all is not to oppose the crowd but to think for yourself.",
        "Monopoly is the condition of every successful business."
      ]
    }
  },
  {
    id: 3,
    title: "Good to Great",
    author: "Jim Collins",
    category: "Business Growth",
    isPremium: false,
    description: "Why Some Companies Make the Leap...And Others Don't",
    readTime: "18 min read",
    coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "The 4-Hour Workweek",
    author: "Timothy Ferriss",
    category: "Productivity",
    isPremium: true,
    description: "Escape 9-5, Live Anywhere, and Join the New Rich",
    readTime: "14 min read",
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Personal Development",
    isPremium: false,
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    readTime: "16 min read",
    coverImage: "https://images.unsplash.com/photo-1550399504-8953e1a6ac87?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    category: "Wealth",
    isPremium: true,
    description: "The Landmark Bestseller Now Revised and Updated for the 21st Century",
    readTime: "20 min read",
    coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=300&auto=format&fit=crop"
  }
];

export const businessPlans = [
  {
    id: 1,
    title: "Coffee Shop Business Plan",
    icon: "Coffee",
    description: "Complete blueprint for opening and running a successful coffee shop business.",
    investment: "$25,000 - $150,000",
    isPremium: true,
    category: "Small Business",
    coverImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "E-commerce Store Setup Guide",
    icon: "ShoppingBag",
    description: "Step-by-step plan to launch your online store with minimal investment.",
    investment: "$1,000 - $10,000",
    isPremium: false,
    category: "Small Business",
    coverImage: "https://images.unsplash.com/photo-1530543787849-128d94430c6b?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Food Delivery Service",
    icon: "Utensils",
    description: "Comprehensive business plan for starting a local food delivery service.",
    investment: "$5,000 - $50,000",
    isPremium: true,
    category: "Small Business",
    coverImage: "https://images.unsplash.com/photo-1531973968078-9bb02785f13d?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Logistics & Transportation Company",
    icon: "Truck",
    description: "Detailed plan for establishing a logistics and transportation business.",
    investment: "$50,000 - $500,000",
    isPremium: true,
    category: "Medium Business",
    coverImage: "https://images.unsplash.com/photo-1570942872213-1242e7f8c1a4?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "SaaS Product Launch",
    icon: "TrendingUp",
    description: "Complete roadmap to develop and launch a subscription software product.",
    investment: "$15,000 - $100,000",
    isPremium: true,
    category: "Medium Business",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "ISP & Telecommunications",
    icon: "Wifi",
    description: "Comprehensive plan for starting an internet service provider business.",
    investment: "$200,000 - $2,000,000",
    isPremium: true,
    category: "Large Business",
    coverImage: "https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?q=80&w=300&auto=format&fit=crop"
  }
];

export const mockBusinessPlans = [
  {
    id: 1,
    title: "Coffee Shop Business Plan",
    industry: "Food & Beverage",
    description: "A comprehensive business plan for starting a specialty coffee shop in an urban area.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    coverImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=300&auto=format&fit=crop",
    readTime: "15 min",
    isPremium: true,
    price: 19.99
  },
  {
    id: 2,
    title: "E-commerce Startup Plan",
    industry: "Retail",
    description: "A detailed plan for launching an online retail business with minimal investment.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=300&auto=format&fit=crop",
    readTime: "20 min",
    isPremium: true,
    price: 24.99
  },
  {
    id: 3,
    title: "Freelance Consulting Business",
    industry: "Consulting",
    description: "How to establish and grow a successful freelance consulting practice.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300&auto=format&fit=crop",
    readTime: "12 min",
    isPremium: false,
    price: 0
  }
];

export const mockBlogPosts = [
  {
    id: 1,
    title: "10 Essential Entrepreneurship Lessons",
    excerpt: "Key insights every entrepreneur should know before starting a business.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    category: "Entrepreneurship",
    tags: ["startup", "business", "entrepreneurship"],
    status: "published",
    publishedAt: "2023-05-15T10:30:00Z",
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=300&auto=format&fit=crop",
    author: { name: "Admin" }
  },
  {
    id: 2,
    title: "How to Build a Successful E-commerce Business",
    excerpt: "A comprehensive guide to starting and scaling your online store.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    category: "E-commerce",
    tags: ["e-commerce", "online business", "retail"],
    status: "published",
    publishedAt: "2023-06-22T14:15:00Z",
    coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=300&auto=format&fit=crop",
    author: { name: "Admin" }
  },
  {
    id: 3,
    title: "Financial Planning for Small Businesses",
    excerpt: "Essential financial strategies to keep your small business thriving.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    category: "Finance",
    tags: ["finance", "small business", "planning"],
    status: "published",
    publishedAt: "2023-07-10T09:45:00Z",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=300&auto=format&fit=crop",
    author: { name: "Admin" }
  },
  {
    id: 4,
    title: "Marketing Strategies for 2023",
    excerpt: "The latest marketing trends and strategies for the coming year.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    category: "Marketing",
    tags: ["marketing", "digital", "strategy"],
    status: "published",
    publishedAt: "2023-08-05T16:20:00Z",
    coverImage: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=300&auto=format&fit=crop",
    author: { name: "Admin" }
  },
  {
    id: 5,
    title: "Productivity Hacks for Entrepreneurs",
    excerpt: "Simple techniques to boost your productivity and get more done.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    category: "Productivity",
    tags: ["productivity", "time management", "efficiency"],
    status: "draft",
    publishedAt: null,
    coverImage: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=300&auto=format&fit=crop",
    author: { name: "Admin" }
  }
];

export const getUserReadingProgress = (bookId: number): number => {
  const progress = localStorage.getItem(`book-progress-${bookId}`);
  return progress ? parseInt(progress, 10) : 0;
};

export const setUserReadingProgress = (bookId: number, progress: number): void => {
  localStorage.setItem(`book-progress-${bookId}`, progress.toString());
};

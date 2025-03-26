# Database Schema & Project Structure

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    subscription_status VARCHAR(50),
    subscription_end_date TIMESTAMP WITH TIME ZONE
);
```

### User_Social_Auth Table
```sql
CREATE TABLE user_social_auth (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    provider VARCHAR(50) NOT NULL, -- 'google', 'apple'
    provider_user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_user_id)
);
```

### Books Table
```sql
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    cover_image_url VARCHAR(255),
    is_premium BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Business_Ideas Table
```sql
CREATE TABLE business_ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'small', 'middle', 'large'
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### User_Bookmarks Table
```sql
CREATE TABLE user_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    content_type VARCHAR(50) NOT NULL, -- 'book', 'business_idea'
    content_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_type, content_id)
);
```

### User_Reading_Progress Table
```sql
CREATE TABLE user_reading_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    content_type VARCHAR(50) NOT NULL,
    content_id UUID NOT NULL,
    progress_percentage INTEGER DEFAULT 0,
    last_read_position INTEGER,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_type, content_id)
);
```

### Payments Table
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_type VARCHAR(50) NOT NULL, -- 'book_summaries', 'business_ideas'
    category VARCHAR(50), -- for business ideas
    status VARCHAR(50) NOT NULL,
    chapa_transaction_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Blog_Posts Table
```sql
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES users(id),
    category VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
tilktbeb/
├── client/                      # Frontend React application
│   ├── public/                  # Static files
│   │   ├── assets/             # Images, fonts, etc.
│   │   ├── src/
│   │   │   ├── common/        # Shared components
│   │   │   ├── layout/        # Layout components
│   │   │   └── reader/        # Reading interface components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── styles/            # Global styles
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/                      # Backend Node.js application
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   └── app.ts           # Express app setup
│   ├── package.json
│   └── tsconfig.json
│
├── admin/                      # Admin dashboard
│   ├── src/
│   │   ├── components/       # Admin UI components
│   │   ├── pages/           # Admin pages
│   │   ├── services/        # Admin API services
│   │   └── utils/           # Admin utilities
│   └── package.json
│
├── shared/                     # Shared code between client and server
│   ├── types/                # Shared TypeScript types
│   └── constants/            # Shared constants
│
├── docs/                      # Documentation
│   ├── api/                  # API documentation
│   ├── database/             # Database documentation
│   └── deployment/           # Deployment guides
│
├── scripts/                   # Build and deployment scripts
├── .github/                   # GitHub Actions workflows
├── docker/                    # Docker configuration
├── .env.example              # Environment variables example
├── package.json
└── README.md
```

## Database Indexes

```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);

-- User_Social_Auth table indexes
CREATE INDEX idx_user_social_auth_user_id ON user_social_auth(user_id);

-- Books table indexes
CREATE INDEX idx_books_is_premium ON books(is_premium);
CREATE INDEX idx_books_created_at ON books(created_at);

-- Business_Ideas table indexes
CREATE INDEX idx_business_ideas_category ON business_ideas(category);
CREATE INDEX idx_business_ideas_is_premium ON business_ideas(is_premium);

-- User_Bookmarks table indexes
CREATE INDEX idx_user_bookmarks_user_id ON user_bookmarks(user_id);
CREATE INDEX idx_user_bookmarks_content ON user_bookmarks(content_type, content_id);

-- User_Reading_Progress table indexes
CREATE INDEX idx_user_reading_progress_user_id ON user_reading_progress(user_id);
CREATE INDEX idx_user_reading_progress_content ON user_reading_progress(content_type, content_id);

-- Payments table indexes
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- Blog_Posts table indexes
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
```

## Database Relationships

1. **Users → User_Social_Auth**: One-to-Many
2. **Users → User_Bookmarks**: One-to-Many
3. **Users → User_Reading_Progress**: One-to-Many
4. **Users → Payments**: One-to-Many
5. **Books → User_Bookmarks**: One-to-Many
6. **Business_Ideas → User_Bookmarks**: One-to-Many
7. **Users → Blog_Posts**: One-to-Many (for authors)

## Database Constraints

1. **Referential Integrity**: All foreign keys have ON DELETE CASCADE
2. **Unique Constraints**: 
   - User email
   - Social auth provider + provider_user_id
   - User bookmarks (user_id + content_type + content_id)
   - User reading progress (user_id + content_type + content_id)
3. **Check Constraints**:
   - Payment amount > 0
   - Progress percentage between 0 and 100
   - Valid content types
   - Valid payment statuses 
# Supabase MCP Setup for TilkTibeb Admin Panel

This directory contains the database schema and configuration files for the TilkTibeb admin panel using Supabase.

## Files

- `schema.sql`: Contains the database schema for the TilkTibeb application
- `policies.sql`: Contains the Row Level Security (RLS) policies for the database
- `functions.sql`: Contains database functions and triggers

## Database Schema

The database schema includes the following tables:

- `users`: Stores user information
- `blog_posts`: Stores blog post content
- `book_summaries`: Stores book summary content
- `business_plans`: Stores business plan content
- `purchases`: Tracks user purchases
- `bookmarks`: Tracks user bookmarks
- `settings`: Stores application settings

## MCP Setup

The Model Context Protocol (MCP) is set up in the `.vscode/mcp.json` file. This allows GitHub Copilot to interact with your Supabase instance.

### Prerequisites

- Node.js and npm installed
- Supabase account with a project set up
- Supabase personal access token

### Using MCP

1. Open Copilot Chat in Visual Studio Code
2. Switch to "Agent" mode
3. Tap the tool icon to confirm the MCP tools are available
4. When prompted, enter your Supabase personal access token

### Applying the Schema

To apply the schema to your Supabase project:

1. Go to the SQL Editor in the Supabase dashboard
2. Copy the contents of `schema.sql`, `policies.sql`, and `functions.sql`
3. Paste them into the SQL Editor
4. Run the SQL queries

## API Services

The API services for interacting with the Supabase database are located in the `src/services/api` directory:

- `blogPostsApi.ts`: API for blog posts
- `bookSummariesApi.ts`: API for book summaries
- `businessPlansApi.ts`: API for business plans
- `usersApi.ts`: API for users
- `purchasesApi.ts`: API for purchases
- `settingsApi.ts`: API for settings
- `index.ts`: Exports all API services and includes the dashboard API

## Types

The TypeScript types for the database tables are defined in `src/lib/supabase.ts`.

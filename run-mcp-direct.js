// Load environment variables from .env file
import dotenv from 'dotenv';

dotenv.config();

// Get the database URL from environment variables
const dbUrl = process.env.DATABASE_URL;

// URL encode the password portion to handle special characters
const encodedDbUrl = dbUrl.replace(/:([^:@]+)@/, (match, password) => {
  return `:${encodeURIComponent(password)}@`;
});

console.log('Starting MCP server with database connection...');

// Import and run the MCP server directly
import('@modelcontextprotocol/server-postgres').then(mcpModule => {
  // Assuming the module exports a function to start the server
  try {
    mcpModule.default(encodedDbUrl);
  } catch (error) {
    console.error('Error starting MCP server:', error);
  }
}).catch(error => {
  console.error('Error importing MCP server module:', error);
});
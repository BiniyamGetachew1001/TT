// Load environment variables from .env file
import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

// Get the database URL from environment variables
const dbUrl = process.env.DATABASE_URL;

// URL encode the password portion to handle special characters
const encodedDbUrl = dbUrl.replace(/:([^:@]+)@/, (match, password) => {
  return `:${encodeURIComponent(password)}@`;
});

console.log('Starting MCP server with database connection...');

try {
  // Use Node to directly run the package's main file
  const result = execSync(
    `node ./node_modules/@modelcontextprotocol/server-postgres/dist/index.js "${encodedDbUrl}"`, 
    { stdio: 'inherit' }
  );
  console.log(result.toString());
} catch (error) {
  console.error('Error running MCP server:', error.message);
}



// Load environment variables from .env file
require('dotenv').config();

// Get the database URL from environment variables
const dbUrl = process.env.DATABASE_URL;

// URL encode the password portion to handle special characters
const encodedDbUrl = dbUrl.replace(/:([^:@]+)@/, (match, password) => {
  return `:${encodeURIComponent(password)}@`;
});

console.log('Starting MCP server with database connection...');

// Spawn the MCP server process with the encoded URL
const { spawn } = require('child_process');
const mcp = spawn('node', ['./node_modules/@modelcontextprotocol/server-postgres/dist/index.js', encodedDbUrl], {
  stdio: 'inherit',
  shell: true
});

// Handle process output
mcp.on('close', (code) => {
  console.log(`MCP server exited with code ${code}`);
});

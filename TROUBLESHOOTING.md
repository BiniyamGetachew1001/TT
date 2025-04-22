# TilkTibeb Troubleshooting Guide

If you're experiencing a blank page or other issues with the TilkTibeb application, follow this comprehensive troubleshooting guide.

## Quick Fix Scripts

We've created several scripts to help diagnose and fix common issues:

1. **Check for Issues**
   ```
   node check-issues.js
   ```
   This script checks for common issues like missing files, dependencies, and environment variables.

2. **Check for Port Conflicts**
   ```
   node check-ports.js
   ```
   This script checks if any common development ports are already in use.

3. **Fix Common Issues**
   ```
   fix-common-issues.bat
   ```
   This script automatically fixes several common issues, including setting environment variables, clearing cache, and rebuilding the application.

4. **Run Simplified Version**
   ```
   run-simple.bat
   ```
   This script runs a simplified version of the application that should work even if there are issues with the main application.

## Test Pages

We've created several test pages to help diagnose issues:

1. **Standalone HTML Test**
   ```
   http://localhost:5174/standalone.html
   ```
   A simple HTML page that doesn't depend on React or your application code.

2. **Minimal HTML Test**
   ```
   http://localhost:5174/minimal.html
   ```
   Another simple HTML page with minimal styling.

3. **Minimal React Test**
   ```
   http://localhost:5174/minimal-react.html
   ```
   A minimal React application that doesn't use JSX or build tools.

4. **Direct React Test**
   ```
   http://localhost:5174/direct-react.html
   ```
   A React application that loads React directly from CDN, bypassing your application's bundling.

5. **Troubleshooting Guide**
   ```
   http://localhost:5174/troubleshooting.html
   ```
   An interactive troubleshooting guide with step-by-step instructions.

6. **Test Page**
   ```
   http://localhost:5174/test
   ```
   A simple React page that checks environment variables.

7. **Debug Page**
   ```
   http://localhost:5174/debug
   ```
   A comprehensive diagnostic page that checks database connection and displays data.

## Step-by-Step Troubleshooting

### 1. Check Basic HTML Rendering

First, verify that your browser can render basic HTML content:

- Visit `http://localhost:5174/standalone.html`
- Visit `http://localhost:5174/minimal.html`

If these pages load correctly, your web server is working and your browser can render basic HTML.

### 2. Check Basic React Functionality

Next, verify that React is working correctly:

- Visit `http://localhost:5174/minimal-react.html`
- Visit `http://localhost:5174/direct-react.html`

If these pages load correctly, React is working at a basic level.

### 3. Check Application Pages

Now, try the simplified application pages:

- Visit `http://localhost:5174/simple`
- Visit `http://localhost:5174/test`
- Visit `http://localhost:5174/debug`

If these pages load correctly but the main application doesn't, the issue is likely with specific components or data fetching in the main application.

### 4. Check Browser Console

Open your browser's developer tools (F12 or right-click and select "Inspect") and check the Console tab for any error messages.

Common errors include:
- **Module not found** - Missing dependency or import error
- **Cannot read property of undefined** - Trying to access a property on an undefined object
- **Unexpected token** - Syntax error in your JavaScript code
- **Failed to fetch** - API or resource loading error

### 5. Check Environment Variables

Make sure your environment variables are correctly set in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_DEVELOPMENT_MODE=true
```

After updating environment variables, restart your development server:

```
npm run dev
```

### 6. Run the Check Issues Script

Run the check-issues.js script to automatically check for common issues:

```
node check-issues.js
```

This script will check for missing files, dependencies, and environment variables.

### 7. Try the Simplified Version

Run the simplified version of the application:

```
run-simple.bat
```

This will start the application with a simplified configuration that should work even if there are issues with the main application.

### 8. Reinstall Dependencies

If all else fails, try reinstalling your dependencies:

```
npm cache clean --force
rm -rf node_modules
npm install
```

Then restart your development server:

```
npm run dev
```

## Common Issues and Solutions

### Blank Page

If you're seeing a blank page:

1. **Check the browser console for errors**
2. **Verify that React is loading correctly** using the test pages
3. **Check that your environment variables are set correctly**
4. **Try the simplified version** to isolate the issue

### Database Connection Issues

If you're having trouble connecting to Supabase:

1. **Verify your Supabase credentials** in `.env.local`
2. **Set `NEXT_PUBLIC_DEVELOPMENT_MODE=true`** to use mock data
3. **Check the Debug page** for detailed database connection information

### JavaScript Errors

If you're seeing JavaScript errors:

1. **Check the browser console** for specific error messages
2. **Try the simplified version** to isolate the issue
3. **Check for syntax errors** in your code
4. **Verify that all dependencies are installed** correctly

## Still Having Issues?

If you're still experiencing problems after following these steps, the issue might be more complex. Consider:

- Checking for compatibility issues between dependencies
- Verifying that your Supabase database is properly configured
- Looking for errors in specific components that might be causing the application to crash

For more help, visit the interactive troubleshooting guide:

```
http://localhost:5174/troubleshooting.html
```

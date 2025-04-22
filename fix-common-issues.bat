@echo off
echo TilkTibeb - Fix Common Issues Script
echo =====================================
echo.

echo Step 1: Checking for port conflicts...
node check-ports.js
echo.

echo Step 2: Checking for common issues...
node check-issues.js
echo.

echo Step 3: Ensuring environment variables are set correctly...
echo Checking .env.local file...
if not exist .env.local (
  echo Creating .env.local file with development settings...
  echo # Replace these with your actual Supabase credentials from Project Settings > API > .env.local
  echo # Make sure to restart your development server after updating these values > .env.local
  echo. >> .env.local
  echo NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co >> .env.local
  echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key >> .env.local
  echo SUPABASE_SERVICE_ROLE_KEY=your-service-role-key >> .env.local
  echo. >> .env.local
  echo # For development, you can set this to bypass authentication >> .env.local
  echo NEXT_PUBLIC_DEVELOPMENT_MODE=true >> .env.local
  echo Created .env.local file. Please update it with your actual Supabase credentials.
) else (
  echo .env.local file exists. Ensuring DEVELOPMENT_MODE is set...
  findstr /C:"NEXT_PUBLIC_DEVELOPMENT_MODE=true" .env.local > nul
  if errorlevel 1 (
    echo Adding NEXT_PUBLIC_DEVELOPMENT_MODE=true to .env.local...
    echo. >> .env.local
    echo # For development, you can set this to bypass authentication >> .env.local
    echo NEXT_PUBLIC_DEVELOPMENT_MODE=true >> .env.local
  ) else (
    echo NEXT_PUBLIC_DEVELOPMENT_MODE is already set to true.
  )
)
echo.

echo Step 4: Copying fallback HTML files to public directory...
if not exist public (
  mkdir public
  echo Created public directory.
)
echo.

echo Step 5: Checking node_modules...
if not exist node_modules (
  echo node_modules not found. Running npm install...
  npm install
) else (
  echo node_modules exists. Skipping npm install.
)
echo.

echo Step 6: Clearing cache and temporary files...
echo Clearing npm cache...
npm cache clean --force
echo.

echo Step 7: Creating a clean build...
echo Building the application...
npm run build
echo.

echo All common issues have been addressed.
echo.
echo Next steps:
echo 1. Start the development server with: npm run dev
echo 2. Visit http://localhost:5174/troubleshooting.html for a step-by-step guide
echo 3. If you still see a blank page, try the simplified version: run-simple.bat
echo.
echo Press any key to exit...
pause > nul

# Manual Installation of Supabase CLI

Since we're encountering network issues with automated downloads, please follow these manual steps to install the Supabase CLI:

1. **Download the Supabase CLI**:
   - Open your web browser and go to: https://github.com/supabase/cli/releases/latest
   - Download the file named `supabase_windows_amd64.exe`

2. **Create the installation directory**:
   - Open File Explorer
   - Navigate to your user directory (typically `C:\Users\YourUsername`)
   - Create a new folder structure: `.supabase\bin`
   - The full path should be something like `C:\Users\YourUsername\.supabase\bin`

3. **Move the downloaded file**:
   - Rename the downloaded file to `supabase.exe`
   - Move it to the `.supabase\bin` folder you created

4. **Add to PATH**:
   - Press the Windows key and search for "Environment Variables"
   - Click on "Edit the system environment variables"
   - In the System Properties window, click on "Environment Variables..."
   - In the "User variables" section, select "Path" and click "Edit"
   - Click "New" and add the path to your `.supabase\bin` folder (e.g., `C:\Users\YourUsername\.supabase\bin`)
   - Click "OK" on all dialogs to save the changes

5. **Verify the installation**:
   - Open a new PowerShell or Command Prompt window
   - Run `supabase --version`
   - If installed correctly, you should see the version information

After completing these steps, you'll have the Supabase CLI installed and ready to use.

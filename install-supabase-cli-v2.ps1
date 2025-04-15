# Define the installation directory
$installDir = "$env:USERPROFILE\.supabase\bin"

# Create the directory if it doesn't exist
if (!(Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
}

# Define the download URL for the latest version
$downloadUrl = "https://github.com/supabase/cli/releases/download/v1.142.2/supabase_windows_amd64.exe"

# Define the destination path
$destinationPath = "$installDir\supabase.exe"

# Download the CLI
Write-Host "Downloading Supabase CLI..."
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($downloadUrl, $destinationPath)
    Write-Host "Download completed successfully."
} catch {
    Write-Host "Error downloading file: $_"
    exit 1
}

# Add to PATH if not already there
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$installDir*") {
    Write-Host "Adding Supabase CLI to PATH..."
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$installDir", "User")
    $env:Path = "$env:Path;$installDir"
}

Write-Host "Supabase CLI installed successfully!"
Write-Host "Please restart your terminal to use the 'supabase' command."
Write-Host "You can verify the installation by running 'supabase --version'"

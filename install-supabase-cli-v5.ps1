# Define the installation directory
$installDir = "$env:USERPROFILE\.supabase\bin"

# Create the directory if it doesn't exist
if (!(Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
    Write-Host "Created directory: $installDir"
}

# Use a known working URL
$downloadUrl = "https://github.com/supabase/cli/releases/download/v1.110.1/supabase_windows_amd64.exe"
Write-Host "Using URL: $downloadUrl"

# Define the destination path
$destinationPath = "$installDir\supabase.exe"

# Download the CLI
Write-Host "Downloading Supabase CLI..."
try {
    # Configure TLS
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    
    # Use Invoke-WebRequest which might be more reliable
    Invoke-WebRequest -Uri $downloadUrl -OutFile $destinationPath -UseBasicParsing
    
    if (Test-Path $destinationPath) {
        $fileSize = (Get-Item $destinationPath).Length
        Write-Host "Download completed successfully. File size: $fileSize bytes."
    } else {
        Write-Host "Failed to download file."
        exit 1
    }
} catch {
    Write-Host "Download failed: $_"
    exit 1
}

# Add to PATH if not already there
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$installDir*") {
    Write-Host "Adding Supabase CLI to PATH..."
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$installDir", "User")
    $env:Path = "$env:Path;$installDir"
    Write-Host "Added to PATH: $installDir"
}

Write-Host "Supabase CLI installed successfully!"
Write-Host "Please restart your terminal to use the 'supabase' command."
Write-Host "You can verify the installation by running 'supabase --version'"

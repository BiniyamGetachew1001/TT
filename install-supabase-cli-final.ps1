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

# Download the CLI using .NET WebClient
Write-Host "Downloading Supabase CLI..."
try {
    Add-Type -AssemblyName System.Net.Http
    $httpClient = New-Object System.Net.Http.HttpClient
    $httpClient.DefaultRequestHeaders.Add("User-Agent", "PowerShell")
    
    $task = $httpClient.GetByteArrayAsync($downloadUrl)
    $task.Wait()
    
    [System.IO.File]::WriteAllBytes($destinationPath, $task.Result)
    
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

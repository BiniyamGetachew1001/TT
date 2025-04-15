# Define the installation directory
$installDir = "$env:USERPROFILE\.supabase\bin"

# Create the directory if it doesn't exist
if (!(Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
    Write-Host "Created directory: $installDir"
}

# Define the download URL for the latest version
$downloadUrl = "https://github.com/supabase/cli/releases/download/v1.142.2/supabase_windows_amd64.exe"

# Define the destination path
$destinationPath = "$installDir\supabase.exe"

# Download the CLI with retry logic
Write-Host "Downloading Supabase CLI from $downloadUrl..."
$maxRetries = 3
$retryCount = 0
$success = $false

while (-not $success -and $retryCount -lt $maxRetries) {
    try {
        # Configure TLS
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        
        # Use System.Net.WebClient for better reliability
        $webClient = New-Object System.Net.WebClient
        $webClient.Headers.Add("User-Agent", "PowerShell Script")
        $webClient.DownloadFile($downloadUrl, $destinationPath)
        
        if (Test-Path $destinationPath) {
            $fileSize = (Get-Item $destinationPath).Length
            if ($fileSize -gt 1000000) {  # Check if file size is reasonable (> 1MB)
                $success = $true
                Write-Host "Download completed successfully. File size: $fileSize bytes."
            } else {
                Write-Host "Downloaded file is too small ($fileSize bytes). Retrying..."
                Remove-Item $destinationPath -Force
            }
        }
    } catch {
        $retryCount++
        Write-Host "Attempt $retryCount failed: $_"
        Start-Sleep -Seconds 2
    }
    
    if (-not $success -and $retryCount -lt $maxRetries) {
        Write-Host "Retrying download... (Attempt $($retryCount + 1) of $maxRetries)"
    }
}

if (-not $success) {
    Write-Host "Failed to download Supabase CLI after $maxRetries attempts."
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

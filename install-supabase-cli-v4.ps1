# Define the installation directory
$installDir = "$env:USERPROFILE\.supabase\bin"

# Create the directory if it doesn't exist
if (!(Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
    Write-Host "Created directory: $installDir"
}

# Get the latest release info from GitHub API
Write-Host "Fetching latest release information..."
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $releaseInfo = Invoke-RestMethod -Uri "https://api.github.com/repos/supabase/cli/releases/latest" -Headers @{"Accept"="application/vnd.github.v3+json"}
    
    # Find the Windows asset
    $windowsAsset = $releaseInfo.assets | Where-Object { $_.name -like "*windows_amd64.exe" }
    
    if ($windowsAsset) {
        $downloadUrl = $windowsAsset.browser_download_url
        Write-Host "Found latest release: $($releaseInfo.tag_name)"
        Write-Host "Download URL: $downloadUrl"
    } else {
        Write-Host "Could not find Windows asset in the latest release."
        exit 1
    }
} catch {
    Write-Host "Failed to fetch release information: $_"
    # Fallback to a known version
    $downloadUrl = "https://github.com/supabase/cli/releases/download/v1.110.1/supabase_windows_amd64.exe"
    Write-Host "Using fallback URL: $downloadUrl"
}

# Define the destination path
$destinationPath = "$installDir\supabase.exe"

# Download the CLI with retry logic
Write-Host "Downloading Supabase CLI..."
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

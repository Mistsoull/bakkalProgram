# Bakkal CRM API Deployment Script for Plesk
# Bu script projeyi production için derler ve yayımlar

Write-Host "Starting deployment process..." -ForegroundColor Green

# Clean previous builds
Write-Host "Cleaning previous builds..." -ForegroundColor Yellow
dotnet clean --configuration Release

# Restore packages
Write-Host "Restoring NuGet packages..." -ForegroundColor Yellow
dotnet restore

# Build the project
Write-Host "Building project in Release mode..." -ForegroundColor Yellow
dotnet build --configuration Release --no-restore

# Publish the project
Write-Host "Publishing project..." -ForegroundColor Yellow
$publishPath = ".\publish"
dotnet publish --configuration Release --output $publishPath --no-build

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "Published files are in: $publishPath" -ForegroundColor Cyan

# Copy additional files if needed
Write-Host "Copying additional configuration files..." -ForegroundColor Yellow
Copy-Item ".\appsettings.Production.json" -Destination "$publishPath\" -Force
Copy-Item ".\web.config" -Destination "$publishPath\" -Force

Write-Host "Ready for Plesk deployment!" -ForegroundColor Green
Write-Host "Upload the contents of '$publishPath' folder to your Plesk httpdocs directory." -ForegroundColor Cyan

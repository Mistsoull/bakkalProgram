#!/bin/bash

# Bakkal Program Production Deployment Script
echo "🚀 Starting production deployment process..."

# Navigate to WebAPI project
cd src/bakkalProgram/WebAPI

# Set environment to Production
export ASPNETCORE_ENVIRONMENT=Production

echo "🧹 Cleaning previous builds..."
dotnet clean --configuration Release

echo "📦 Restoring NuGet packages..."
dotnet restore

echo "🔨 Building project in Release mode..."
dotnet build --configuration Release --no-restore

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

echo "📦 Publishing project for production..."
dotnet publish --configuration Release --output ./publish --no-build --self-contained false

if [ $? -ne 0 ]; then
    echo "❌ Publish failed! Please check the errors above."
    exit 1
fi

echo "📋 Copying configuration files..."
cp appsettings.Production.json ./publish/
cp web.config ./publish/

echo "🗂️ Creating logs directory..."
mkdir -p ./publish/logs

echo "✅ Deployment completed successfully!"
echo "📁 Published files are in: $(pwd)/publish"
echo ""
echo "🌐 To deploy to Plesk:"
echo "1. Compress the contents of the 'publish' folder"
echo "2. Upload to your Plesk httpdocs directory"
echo "3. Make sure the Application Pool is set to '.NET 8.0'"
echo "4. Restart the application"
echo ""
echo "🔍 Common CQRS troubleshooting:"
echo "- Ensure all appsettings sections are properly configured"
echo "- Check if MediatR handlers are being registered correctly"
echo "- Verify database connection string is working"
echo "- Check application logs for detailed error information"

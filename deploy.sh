#!/bin/bash

# 🚀 Royal Multiskill Hub - Quick Deployment Script
# This script helps you deploy your website to Vercel

echo "🎨 Royal Multiskill Hub - Deployment Helper"
echo "==========================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check if .gitignore exists
if [ ! -f .gitignore ]; then
    echo "⚠️  Warning: .gitignore not found"
else
    echo "✅ .gitignore found"
fi

# Add all files
echo ""
echo "📝 Adding files to git..."
git add .

# Commit
echo ""
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Update Royal Multiskill Hub website"
fi

git commit -m "$commit_msg"
echo "✅ Files committed"

# Check if remote exists
echo ""
if git remote | grep -q "origin"; then
    echo "✅ Remote 'origin' already exists"
    echo ""
    read -p "Do you want to push to existing remote? (y/n): " push_existing
    if [ "$push_existing" = "y" ]; then
        echo "📤 Pushing to GitHub..."
        git push origin main || git push origin master
        echo "✅ Pushed to GitHub"
    fi
else
    echo "⚠️  No remote repository found"
    echo ""
    echo "To add a remote repository:"
    echo "1. Create a new repository on GitHub"
    echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo "3. Run: git push -u origin main"
    echo ""
    read -p "Enter your GitHub repository URL (or press Enter to skip): " repo_url
    if [ ! -z "$repo_url" ]; then
        git remote add origin "$repo_url"
        echo "✅ Remote added"
        echo "📤 Pushing to GitHub..."
        git branch -M main
        git push -u origin main
        echo "✅ Pushed to GitHub"
    fi
fi

echo ""
echo "🎉 Git operations complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://vercel.com"
echo "2. Sign in with GitHub"
echo "3. Click 'Add New Project'"
echo "4. Import your repository"
echo "5. Click 'Deploy'"
echo ""
echo "🚀 Your website will be live in 1-2 minutes!"
echo ""
echo "📖 For detailed instructions, see: DEPLOYMENT_GUIDE.md"


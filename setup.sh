#!/bin/bash

# Casino Offer AI Researcher - Quick Setup Script
# This script helps you get started quickly

echo "🎰 Casino Offer AI Researcher - Quick Setup"
echo "==========================================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
node_version=$(node -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js $node_version found"
else
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Setup environment file
if [ ! -f .env ]; then
    echo "⚙️ Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your OpenAI API key!"
    echo "   OPENAI_API_KEY=sk-your-key-here"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your OpenAI API key"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "📚 For more information, see:"
echo "   - QUICKSTART.md for quick start guide"
echo "   - README.md for complete documentation"
echo "   - STATUS.md for project status"
echo ""
echo "Happy researching! 🎰✨"

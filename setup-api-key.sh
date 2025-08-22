#!/bin/bash

echo "TMDB API Key Setup for Movie App"
echo "=================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo ".env file not found. Creating from template..."
    cp env.example .env
fi

echo "To use this app, you need a TMDB API key:"
echo ""
echo "1. Visit: https://www.themoviedb.org/settings/api"
echo "2. Create an account if you don't have one"
echo "3. Request an API key"
echo "4. Copy your API key"
echo ""
echo "5. Edit the .env file and replace 'your_tmdb_api_key_here' with your actual key"
echo ""

# Check if API key is configured
if grep -q "your_tmdb_api_key_here" .env; then
    echo "API key not configured yet!"
    echo "   Current .env content:"
    echo "   ----------------------"
    cat .env
    echo "   ----------------------"
    echo ""
    echo "Please edit .env and add your API key, then restart the app."
else
    echo "API key appears to be configured!"
    echo "You can now start the app with: npm start"
fi

echo ""
echo "   After updating the .env file, restart your development server."
echo "   The app will automatically detect the API key and start working."


# Gemini API Setup Guide

This guide will help you set up the Google Gemini API for recipe generation fallback in CookMate.

## Overview

CookMate now includes a fallback mechanism that uses Google's Gemini AI to generate recipes when the Spoonacular API returns no results or fails. This ensures users always get recipe suggestions for their searches.

## Prerequisites

- A Google Cloud account with billing enabled
- Access to the Gemini API (currently free to use)

## Step 1: Get Your Gemini API Key

1. Go to the [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click on "Create API Key" in the top right corner
4. Choose to create a new API key in a new Google Cloud project or select an existing project
5. Copy your API key (it will look like: `AIzaSy...`)

## Step 2: Configure Environment Variables

Create or update your `.env.local` file in the root directory of your CookMate project:

```bash
# Spoonacular API (existing)
NEXT_PUBLIC_SPOONACULAR_API_KEY=your_spoonacular_api_key_here

# Gemini API (new)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Important:** Replace `your_gemini_api_key_here` with the actual API key you copied from Google AI Studio.

## Step 3: Verify Setup

To verify that your Gemini API integration is working correctly:

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Test the fallback mechanism by:
   - Searching for a very specific or obscure recipe that Spoonacular might not have
   - Or temporarily disabling your Spoonacular API key to force the fallback

3. You should see:
   - A blue fallback message indicating AI-generated recipes
   - Recipe cards marked with "AI Generated" badges
   - Additional ingredient information for AI-generated recipes

## How It Works

### Search Flow

1. **Primary Search**: CookMate first tries to fetch recipes from the Spoonacular API
2. **Fallback Trigger**: If Spoonacular returns:
   - No results (empty array)
   - Very few results (less than 3 recipes)
   - An error (API failure, invalid key, etc.)
3. **AI Generation**: The Gemini API generates a complete recipe based on the search query
4. **Seamless Display**: AI-generated recipes are displayed in the same format as Spoonacular recipes

### Recipe Generation

The Gemini API is prompted to generate recipes in a structured JSON format including:
- Title and description
- Ingredients list
- Step-by-step instructions
- Cooking time and servings
- Difficulty level
- Nutritional information (when available)
- Cuisine type and dietary information

### User Experience

- **Visual Indicators**: AI-generated recipes are clearly marked with "AI Generated" badges
- **Fallback Messages**: Users see informative messages when AI fallback is used
- **Consistent Format**: Both Spoonacular and AI recipes use the same display format
- **Full Functionality**: AI recipes can be viewed, saved to favorites, and used like any other recipe

## Error Handling

The system includes comprehensive error handling for:

- **Missing API Key**: Clear error message if `NEXT_PUBLIC_GEMINI_API_KEY` is not configured
- **API Failures**: Graceful fallback if Gemini API is unavailable
- **Invalid Responses**: Error handling for malformed or incomplete AI responses
- **Rate Limits**: Built-in retry logic for API rate limiting

## Security Notes

- **Environment Variables**: API keys are stored in environment variables and never exposed to the client
- **Client-Side Only**: The Gemini API calls are made from the client side using Next.js public environment variables
- **Key Protection**: Your `.env.local` file is included in `.gitignore` to prevent accidental key exposure

## Troubleshooting

### Common Issues

**Issue**: "Gemini API key is not configured" error
**Solution**: Ensure `NEXT_PUBLIC_GEMINI_API_KEY` is properly set in `.env.local` and restart your dev server

**Issue**: "models/gemini-pro is not found" error (404)
**Solution**: This error occurs because Google updated their API model names. The code has been updated to use `gemini-1.5-flash` which is the current recommended model. If you still encounter issues, ensure your Google Cloud project has the Gemini API enabled.

**Issue**: AI-generated recipes don't appear
**Solution**: 
- Check browser console for errors
- Verify your Gemini API key is valid and has API access enabled
- Try searching for something very specific to trigger the fallback
- Ensure your Google Cloud project has billing enabled (required for Gemini API)

**Issue**: Malformed recipe data from AI
**Solution**: The system includes error handling and will retry generation if the first attempt fails

### Testing the Fallback

To test the fallback mechanism:

1. **Temporary Key Removal**: Comment out your Spoonacular API key in `.env.local`
2. **Obscure Search**: Search for something very specific like "medieval peasant stew"
3. **Network Throttling**: Use browser dev tools to simulate slow network conditions

## Rate Limits and Costs

- **Gemini API**: Currently free to use with reasonable rate limits
- **Spoonacular API**: Free tier has 150 requests per day limit
- **Smart Fallback**: The system only uses Gemini when necessary, helping manage API usage

## Future Enhancements

Potential improvements for the AI fallback system:

- **Multiple Recipe Generation**: Generate several recipe options per query
- **Cuisine Preference**: Allow users to specify preferred cuisine for AI generation
- **Dietary Restrictions**: Incorporate user dietary preferences into AI prompts
- **Recipe Refinement**: Allow users to refine AI-generated recipes with follow-up prompts
- **Image Generation**: Integrate AI image generation for recipe photos

## Support

If you encounter any issues with the Gemini API integration:

1. Check the browser console for error messages
2. Verify your API keys are correctly configured
3. Ensure your Google Cloud project has billing enabled (required for Gemini API)
4. Review the Google AI Studio documentation for the latest API requirements

For additional help, refer to the main CookMate documentation or create an issue in the project repository.
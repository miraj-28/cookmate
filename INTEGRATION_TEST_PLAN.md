# Gemini API Fallback Integration Test Plan

This document outlines the testing strategy for the Gemini API fallback integration in CookMate.

## Test Overview

The goal is to ensure that the fallback mechanism works seamlessly when the Spoonacular API fails or returns insufficient results, while maintaining a consistent user experience.

## Test Environment Setup

### Prerequisites
1. ✅ Gemini API client implemented (`src/lib/gemini.ts`)
2. ✅ Unified recipe service created (`src/lib/recipeService.ts`)
3. ✅ Search page updated (`src/app/search/page.tsx`)
4. ✅ Environment variables configured (`.env.local`)
5. ✅ Setup documentation created (`GEMINI_SETUP.md`)

### Test Data
- **Valid Search Terms**: "chicken pasta", "vegetarian curry", "chocolate cake"
- **Obscure Search Terms**: "medieval peasant stew", "alien fusion tacos", "quantum soup"
- **Empty Results**: "xyz123abc", "nonexistent dish 987"

## Test Cases

### 1. Primary API Success (Happy Path)

**Objective**: Verify normal Spoonacular API functionality

**Steps**:
1. Start the development server: `npm run dev`
2. Navigate to the search page
3. Enter a common recipe: "chicken pasta"
4. Click search

**Expected Results**:
- ✅ Loading indicator appears
- ✅ Recipes display from Spoonacular API
- ✅ No fallback message shown
- ✅ Recipe cards show standard format (no "AI Generated" badges)
- ✅ All recipe information displays correctly (title, time, servings, rating)

### 2. Fallback Trigger - No Results

**Objective**: Test fallback when Spoonacular returns empty results

**Steps**:
1. Search for an obscure term: "medieval peasant stew"
2. Wait for search to complete

**Expected Results**:
- ✅ Loading indicator appears
- ✅ Blue fallback message appears: "No recipes found. Generating AI-powered recipe suggestions..."
- ✅ Recipe cards display with "AI Generated" badges
- ✅ Recipe cards show ingredient preview
- ✅ AI-generated recipe has complete information

### 3. Fallback Trigger - API Error

**Objective**: Test fallback when Spoonacular API fails

**Steps**:
1. Temporarily invalidate Spoonacular API key in `.env.local`
2. Restart development server
3. Search for any recipe: "chicken curry"
4. Observe the results

**Expected Results**:
- ✅ Loading indicator appears
- ✅ Blue fallback message appears: "Failed to retrieve recipes from Spoonacular API. Generating AI-powered recipe suggestions..."
- ✅ AI-generated recipes display with proper formatting
- ✅ Error handling prevents app crash

### 4. Fallback Trigger - Insufficient Results

**Objective**: Test fallback when Spoonacular returns very few results

**Steps**:
1. Search for a very specific term that might return 1-2 results
2. Observe if fallback is triggered

**Expected Results**:
- ✅ If Spoonacular returns < 3 results, fallback should trigger
- ✅ Both Spoonacular and AI recipes should display
- ✅ Clear distinction between API and AI recipes

### 5. Gemini API Configuration Error

**Objective**: Test behavior when Gemini API key is missing/invalid

**Steps**:
1. Remove or invalidate Gemini API key in `.env.local`
2. Restart development server
3. Search for an obscure term to trigger fallback
4. Check browser console for errors

**Expected Results**:
- ✅ Error message in console: "Gemini API key is not configured"
- ✅ Graceful error handling in UI
- ✅ App remains functional, shows appropriate error message

### 6. Gemini API Failure

**Objective**: Test behavior when Gemini API itself fails

**Steps**:
1. Use network throttling in browser dev tools
2. Search for obscure term to trigger fallback
3. Observe error handling

**Expected Results**:
- ✅ App handles network errors gracefully
- ✅ User sees appropriate error message
- ✅ Fallback to empty state with helpful message

### 7. UI/UX Consistency Tests

**Objective**: Ensure consistent user experience across both API sources

**Steps**:
1. Compare Spoonacular recipe cards with AI-generated recipe cards
2. Test all interactive elements on both types
3. Verify responsive design

**Expected Results**:
- ✅ Both recipe types use identical card layout
- ✅ "View Recipe" and "Favorite" buttons work on both
- ✅ Responsive design works for all screen sizes
- ✅ Loading states are consistent
- ✅ Error states are consistent

### 8. Performance Tests

**Objective**: Verify performance impact of AI fallback

**Steps**:
1. Measure load time for Spoonacular recipes
2. Measure load time for AI-generated recipes
3. Test with multiple rapid searches

**Expected Results**:
- ✅ AI generation adds reasonable delay (2-5 seconds)
- ✅ Loading indicators provide good feedback
- ✅ No memory leaks or performance degradation
- ✅ Rapid searches don't break the app

### 9. Data Validation Tests

**Objective**: Ensure AI-generated recipes have valid data structure

**Steps**:
1. Trigger AI fallback multiple times
2. Inspect generated recipe data
3. Verify all required fields are present

**Expected Results**:
- ✅ All AI recipes have: id, title, summary, readyInMinutes, servings, spoonacularScore
- ✅ Optional fields present when applicable: difficulty, cuisine, dietary, ingredients, instructions
- ✅ No undefined or null values in required fields
- ✅ Data types are consistent (numbers for time/servings, strings for text, etc.)

### 10. Error Recovery Tests

**Objective**: Test app recovery from various error states

**Steps**:
1. Trigger multiple error scenarios in sequence
2. Verify app can recover and continue functioning
3. Test state management during errors

**Expected Results**:
- ✅ App recovers from API failures
- ✅ State management handles errors correctly
- ✅ User can continue searching after errors
- ✅ No stuck loading states

## Test Automation

### Manual Testing Checklist
- [ ] Primary API success
- [ ] Fallback on no results
- [ ] Fallback on API error
- [ ] Fallback on insufficient results
- [ ] Missing API key handling
- [ ] Gemini API failure handling
- [ ] UI consistency verification
- [ ] Performance assessment
- [ ] Data validation
- [ ] Error recovery

### Automated Testing (Future)
```javascript
// Example test cases for future implementation
describe('Recipe Search Fallback', () => {
  test('should use Gemini when Spoonacular returns empty', async () => {
    // Mock Spoonacular to return empty array
    // Verify Gemini is called
    // Verify UI shows fallback message
  });

  test('should handle missing Gemini API key', async () => {
    // Remove API key
    // Verify error handling
    // Verify user-friendly message
  });
});
```

## Browser Testing Matrix

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | ✅ Required | Primary development browser |
| Firefox | Latest | ✅ Required | Cross-browser compatibility |
| Safari | Latest | ✅ Required | Apple ecosystem compatibility |
| Edge | Latest | ⚠️ Optional | Microsoft ecosystem |
| Mobile Chrome | iOS/Android | ✅ Required | Mobile responsiveness |

## Device Testing

- **Desktop**: 1920x1080, 1366x768
- **Tablet**: 768x1024, 820x1180
- **Mobile**: 375x667, 414x896

## Performance Benchmarks

| Metric | Target | Acceptable | Notes |
|--------|--------|------------|-------|
| Spoonacular search | < 2s | < 3s | Normal API response |
| Gemini generation | < 5s | < 8s | AI generation time |
| UI rendering | < 1s | < 2s | Client-side rendering |
| Error recovery | < 1s | < 2s | State reset time |

## Known Issues and Limitations

### Current Limitations
1. **Single Recipe Generation**: Currently generates only one AI recipe per search
2. **Fixed Cuisine**: AI generation defaults to Indian cuisine
3. **No Image Generation**: Uses placeholder images for AI recipes
4. **Client-Side Only**: API calls made from client, could be moved to server for better security

### Future Improvements
1. **Multiple AI Recipes**: Generate 3-5 recipe options
2. **Dynamic Cuisine**: Detect or ask for cuisine preference
3. **Image Integration**: Add AI image generation for recipe photos
4. **Server-Side API**: Move API calls to Next.js API routes

## Test Results Documentation

After completing tests, document:

1. ✅ **Pass/Fail Status** for each test case
2. ⚠️ **Issues Found** with screenshots and steps to reproduce
3. 🐛 **Bug Reports** filed in project tracker
4. 📊 **Performance Metrics** recorded
5. 💡 **Improvement Suggestions** for future iterations

## Sign-off

**Tester**: _________________________ **Date**: _______________

**Results**: 
- ✅ All tests passed
- ⚠️ Tests passed with minor issues
- ❌ Critical issues found (blocking release)

**Approval for Production**: _________________________

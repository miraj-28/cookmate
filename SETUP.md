# Cookmate Setup Guide

## Prerequisites

Before running the application, you need to set up Supabase for the search functionality to work properly.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up for an account
2. Create a new project
3. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

1. Once your project is created, go to Project Settings > API
2. Copy the **Project URL** and **anon public key**
3. You'll need these for the environment variables

## Step 3: Set Up Environment Variables

Create a file named `.env.local` in the root of your project with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with the actual values from your Supabase project.

## Step 4: Set Up the Database

1. Go to the Supabase dashboard for your project
2. Click on "SQL Editor" in the left sidebar
3. Click "New query" and run the following SQL to create the recipes table:

```sql
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  image_url TEXT,
  user_id TEXT NOT NULL,
  category TEXT
);

CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  recipe_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  username TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  website TEXT
);
```

## Step 5: Populate the Database (Optional)

Run the setup script to populate the database with sample Indian recipes:

```bash
node setup-supabase.js
```

This will add 10 authentic Indian recipes to your database (5 vegetarian, 5 non-vegetarian).

## Step 6: Run the Application

Now you can run the application:

```bash
npm run dev
```

The search functionality should now work with real data from your Supabase database.

## Troubleshooting

If you still see "No recipes found" or encounter errors:

1. Make sure your `.env.local` file is in the root directory
2. Verify that your Supabase project is active
3. Check that the recipes table exists and has data
4. Look at the browser console for any error messages

## Fallback Mode

If Supabase is not configured, the application will use mock data for demonstration purposes. You'll see a console message about missing environment variables, but the search will still work with sample recipes.

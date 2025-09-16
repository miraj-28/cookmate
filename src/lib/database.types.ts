export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at?: string
          username: string
          full_name: string
          avatar_url?: string
          website?: string
        }
        Insert: {
          id: string
          updated_at?: string
          username: string
          full_name: string
          avatar_url?: string
          website?: string
        }
        Update: {
          id?: string
          updated_at?: string
          username?: string
          full_name?: string
          avatar_url?: string
          website?: string
        }
      }
      recipes: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          ingredients: string[]
          instructions: string[]
          prep_time: number | null
          cook_time: number | null
          servings: number | null
          image_url: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          ingredients: string[]
          instructions: string[]
          prep_time?: number | null
          cook_time?: number | null
          servings?: number | null
          image_url?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          ingredients?: string[]
          instructions?: string[]
          prep_time?: number | null
          cook_time?: number | null
          servings?: number | null
          image_url?: string | null
          user_id?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          recipe_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipe_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipe_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

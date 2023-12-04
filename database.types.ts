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
      anime_guides: {
        Row: {
          author_id: string | null
          category_id: number | null
          created_at: string
          description: string | null
          id: number
          title: string
          updated_at: string | null
          views: number
        }
        Insert: {
          author_id?: string | null
          category_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          title: string
          updated_at?: string | null
          views?: number
        }
        Update: {
          author_id?: string | null
          category_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          title?: string
          updated_at?: string | null
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "anime_guides_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anime_guides_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          category: string
          id: number
        }
        Insert: {
          category: string
          id?: number
        }
        Update: {
          category?: string
          id?: number
        }
        Relationships: []
      }
      detailed_score: {
        Row: {
          accessibility: number | null
          audiovisual: number | null
          characters: number | null
          emotion: number | null
          id: number
          originality: number | null
          plot: number | null
          review_id: number
        }
        Insert: {
          accessibility?: number | null
          audiovisual?: number | null
          characters?: number | null
          emotion?: number | null
          id?: number
          originality?: number | null
          plot?: number | null
          review_id: number
        }
        Update: {
          accessibility?: number | null
          audiovisual?: number | null
          characters?: number | null
          emotion?: number | null
          id?: number
          originality?: number | null
          plot?: number | null
          review_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "detailed_score_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          }
        ]
      }
      guides_anime_map: {
        Row: {
          anime_id: number
          date_added: string
          guide_id: number
          id: number
          order: number
        }
        Insert: {
          anime_id: number
          date_added?: string
          guide_id: number
          id?: number
          order: number
        }
        Update: {
          anime_id?: number
          date_added?: string
          guide_id?: number
          id?: number
          order?: number
        }
        Relationships: [
          {
            foreignKeyName: "guides_anime_map_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "anime_guides"
            referencedColumns: ["id"]
          }
        ]
      }
      guides_users_map: {
        Row: {
          guide_id: number
          id: number
          user_id: string | null
        }
        Insert: {
          guide_id: number
          id?: number
          user_id?: string | null
        }
        Update: {
          guide_id?: number
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guides_users_map_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "anime_guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guides_users_map_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          anime_id: number
          author_id: string
          comment: string | null
          created_at: string
          detailed_review_svg: string | null
          id: number
          is_draft: boolean
          long_review: string | null
          long_review_preview: string | null
          overall_score: number | null
          updated_at: string | null
        }
        Insert: {
          anime_id: number
          author_id: string
          comment?: string | null
          created_at?: string
          detailed_review_svg?: string | null
          id?: number
          is_draft?: boolean
          long_review?: string | null
          long_review_preview?: string | null
          overall_score?: number | null
          updated_at?: string | null
        }
        Update: {
          anime_id?: number
          author_id?: string
          comment?: string | null
          created_at?: string
          detailed_review_svg?: string | null
          id?: number
          is_draft?: boolean
          long_review?: string | null
          long_review_preview?: string | null
          overall_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          mal_id: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          mal_id?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          mal_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      average_score: {
        Args: {
          p_anime_id: number
        }
        Returns: number
      }
      increment: {
        Args: {
          guide_id: number
        }
        Returns: undefined
      }
      increment_views: {
        Args: {
          p_guide_id: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

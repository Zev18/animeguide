export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      anime_guides: {
        Row: {
          author_id: string | null;
          created_at: string;
          id: number;
          updated_at: string | null;
        };
        Insert: {
          author_id?: string | null;
          created_at?: string;
          id?: number;
          updated_at?: string | null;
        };
        Update: {
          author_id?: string | null;
          created_at?: string;
          id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "anime_guides_author_id_fkey";
            columns: ["author_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      animes: {
        Row: {
          anilist_id: number | null;
          id: number;
          mal_id: number;
        };
        Insert: {
          anilist_id?: number | null;
          id?: number;
          mal_id: number;
        };
        Update: {
          anilist_id?: number | null;
          id?: number;
          mal_id?: number;
        };
        Relationships: [];
      };
      detailed_score: {
        Row: {
          accessibility: number | null;
          audiovisual: number | null;
          characters: number | null;
          emotion: number | null;
          id: number;
          originality: number | null;
          plot: number | null;
          review_id: number;
        };
        Insert: {
          accessibility?: number | null;
          audiovisual?: number | null;
          characters?: number | null;
          emotion?: number | null;
          id?: number;
          originality?: number | null;
          plot?: number | null;
          review_id: number;
        };
        Update: {
          accessibility?: number | null;
          audiovisual?: number | null;
          characters?: number | null;
          emotion?: number | null;
          id?: number;
          originality?: number | null;
          plot?: number | null;
          review_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "detailed_score_review_id_fkey";
            columns: ["review_id"];
            referencedRelation: "reviews";
            referencedColumns: ["id"];
          },
        ];
      };
      guides_anime_map: {
        Row: {
          anime_id: number | null;
          guide_id: number;
          id: number;
        };
        Insert: {
          anime_id?: number | null;
          guide_id: number;
          id?: number;
        };
        Update: {
          anime_id?: number | null;
          guide_id?: number;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "guides_anime_map_anime_id_fkey";
            columns: ["anime_id"];
            referencedRelation: "animes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "guides_anime_map_guide_id_fkey";
            columns: ["guide_id"];
            referencedRelation: "anime_guides";
            referencedColumns: ["id"];
          },
        ];
      };
      guides_users_map: {
        Row: {
          guide_id: number;
          id: number;
          user_id: string | null;
        };
        Insert: {
          guide_id: number;
          id?: number;
          user_id?: string | null;
        };
        Update: {
          guide_id?: number;
          id?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "guides_users_map_guide_id_fkey";
            columns: ["guide_id"];
            referencedRelation: "anime_guides";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "guides_users_map_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          anime_id: number | null;
          author_id: string | null;
          comment: string | null;
          created_at: string;
          detailed_score: number | null;
          id: number;
          long_review: string | null;
          overall_score: number | null;
          updated_at: string | null;
        };
        Insert: {
          anime_id?: number | null;
          author_id?: string | null;
          comment?: string | null;
          created_at?: string;
          detailed_score?: number | null;
          id?: number;
          long_review?: string | null;
          overall_score?: number | null;
          updated_at?: string | null;
        };
        Update: {
          anime_id?: number | null;
          author_id?: string | null;
          comment?: string | null;
          created_at?: string;
          detailed_score?: number | null;
          id?: number;
          long_review?: string | null;
          overall_score?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_anime_id_fkey";
            columns: ["anime_id"];
            referencedRelation: "animes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_author_id_fkey";
            columns: ["author_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_detailed_score_fkey";
            columns: ["detailed_score"];
            referencedRelation: "detailed_score";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          mal_id: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          mal_id?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          mal_id?: string | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      people: {
        Row: {
          id: string;
          name: string;
          nickname: string;
          relationship: string;
          status: string;
          birthday: string | null;
          location: string | null;
          description: string | null;
          photo_url: string | null;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          nickname: string;
          relationship?: string;
          status?: string;
          birthday?: string | null;
          location?: string | null;
          description?: string | null;
          photo_url?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          nickname?: string;
          relationship?: string;
          status?: string;
          birthday?: string | null;
          location?: string | null;
          description?: string | null;
          photo_url?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      diary_entries: {
        Row: {
          id: string;
          person_id: string;
          date: string;
          title: string;
          content: string;
          mood: string | null;
          tags: string[] | null;
          is_public: boolean;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          person_id: string;
          date: string;
          title: string;
          content: string;
          mood?: string | null;
          tags?: string[] | null;
          is_public?: boolean;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          person_id?: string;
          date?: string;
          title?: string;
          content?: string;
          mood?: string | null;
          tags?: string[] | null;
          is_public?: boolean;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      favorite_items: {
        Row: {
          id: string;
          person_id: string;
          category: string;
          label: string;
          value: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          person_id: string;
          category: string;
          label: string;
          value: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          person_id?: string;
          category?: string;
          label?: string;
          value?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      wishlist_items: {
        Row: {
          id: string;
          person_id: string;
          title: string;
          category: string;
          priority: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          person_id: string;
          title: string;
          category: string;
          priority?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          person_id?: string;
          title?: string;
          category?: string;
          priority?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      timeline_events: {
        Row: {
          id: string;
          person_id: string;
          date: string;
          title: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          person_id: string;
          date: string;
          title: string;
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          person_id?: string;
          date?: string;
          title?: string;
          description?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      little_things: {
        Row: {
          id: string;
          person_id: string;
          text: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          person_id: string;
          text: string;
          category?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          person_id?: string;
          text?: string;
          category?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          alt_text: string | null;
          created_at: string;
          diary_entry_id: string | null;
          id: string;
          person_id: string | null;
          source_type: string;
          storage_path: string | null;
          url: string;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string;
          diary_entry_id?: string | null;
          id?: string;
          person_id?: string | null;
          source_type?: string;
          storage_path?: string | null;
          url: string;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string;
          diary_entry_id?: string | null;
          id?: string;
          person_id?: string | null;
          source_type?: string;
          storage_path?: string | null;
          url?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

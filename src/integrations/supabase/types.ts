export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookmarks: {
        Row: {
          course_id: string
          created_at: string
          id: string
          lesson_id: string
          title: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          lesson_id: string
          title?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          lesson_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          id: string
          is_completed: boolean
          last_accessed_at: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          id?: string
          is_completed?: boolean
          last_accessed_at?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          id?: string
          is_completed?: boolean
          last_accessed_at?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: Database["public"]["Enums"]["course_category"]
          created_at: string
          description: string
          enrolled_count: number
          estimated_hours: number
          id: string
          instructor_id: string
          is_free: boolean
          learning_objectives: string[] | null
          level: Database["public"]["Enums"]["course_level"]
          price: number
          published_at: string | null
          rating: number
          requirements: string[] | null
          review_count: number
          short_description: string
          slug: string
          status: Database["public"]["Enums"]["course_status"]
          tags: string[] | null
          thumbnail: string | null
          title: string
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["course_category"]
          created_at?: string
          description?: string
          enrolled_count?: number
          estimated_hours?: number
          id?: string
          instructor_id: string
          is_free?: boolean
          learning_objectives?: string[] | null
          level?: Database["public"]["Enums"]["course_level"]
          price?: number
          published_at?: string | null
          rating?: number
          requirements?: string[] | null
          review_count?: number
          short_description?: string
          slug: string
          status?: Database["public"]["Enums"]["course_status"]
          tags?: string[] | null
          thumbnail?: string | null
          title: string
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["course_category"]
          created_at?: string
          description?: string
          enrolled_count?: number
          estimated_hours?: number
          id?: string
          instructor_id?: string
          is_free?: boolean
          learning_objectives?: string[] | null
          level?: Database["public"]["Enums"]["course_level"]
          price?: number
          published_at?: string | null
          rating?: number
          requirements?: string[] | null
          review_count?: number
          short_description?: string
          slug?: string
          status?: Database["public"]["Enums"]["course_status"]
          tags?: string[] | null
          thumbnail?: string | null
          title?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          course_id: string
          enrolled_at: string
          expires_at: string | null
          id: string
          status: Database["public"]["Enums"]["enrollment_status"]
          user_id: string
        }
        Insert: {
          course_id: string
          enrolled_at?: string
          expires_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          user_id: string
        }
        Update: {
          course_id?: string
          enrolled_at?: string
          expires_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string
          created_at: string
          has_quiz: boolean
          id: string
          is_free: boolean
          order: number
          quiz_id: string | null
          reading_time: number
          section_id: string
          slug: string
          title: string
        }
        Insert: {
          content?: string
          created_at?: string
          has_quiz?: boolean
          id?: string
          is_free?: boolean
          order?: number
          quiz_id?: string | null
          reading_time?: number
          section_id: string
          slug: string
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          has_quiz?: boolean
          id?: string
          is_free?: boolean
          order?: number
          quiz_id?: string | null
          reading_time?: number
          section_id?: string
          slug?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string
          course_id: string
          created_at: string
          id: string
          lesson_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          course_id: string
          created_at?: string
          id?: string
          lesson_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          course_id?: string
          created_at?: string
          id?: string
          lesson_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: string
          explanation: string | null
          id: string
          options: string[] | null
          order: number
          points: number
          question: string
          quiz_id: string
          type: Database["public"]["Enums"]["question_type"]
        }
        Insert: {
          correct_answer: string
          explanation?: string | null
          id?: string
          options?: string[] | null
          order?: number
          points?: number
          question: string
          quiz_id: string
          type?: Database["public"]["Enums"]["question_type"]
        }
        Update: {
          correct_answer?: string
          explanation?: string | null
          id?: string
          options?: string[] | null
          order?: number
          points?: number
          question?: string
          quiz_id?: string
          type?: Database["public"]["Enums"]["question_type"]
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          answers: Json
          completed_at: string | null
          id: string
          passed: boolean
          quiz_id: string
          score: number
          started_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          completed_at?: string | null
          id?: string
          passed?: boolean
          quiz_id: string
          score?: number
          started_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          lesson_id: string
          passing_score: number
          time_limit: number | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          lesson_id: string
          passing_score?: number
          time_limit?: number | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          lesson_id?: string
          passing_score?: number
          time_limit?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string
          course_id: string
          created_at: string
          id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string
          course_id: string
          created_at?: string
          id?: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          course_id?: string
          created_at?: string
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          order: number
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          order?: number
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          about_html: string | null
          accent_color: string | null
          applied_at: string
          approved_at: string | null
          banner_url: string | null
          certificate_bg_url: string | null
          certificate_template: string
          contact_email: string | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string
          primary_color: string | null
          slug: string
          social_links: Json | null
          status: Database["public"]["Enums"]["vendor_status"]
          updated_at: string
          website: string | null
        }
        Insert: {
          about_html?: string | null
          accent_color?: string | null
          applied_at?: string
          approved_at?: string | null
          banner_url?: string | null
          certificate_bg_url?: string | null
          certificate_template?: string
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id: string
          primary_color?: string | null
          slug: string
          social_links?: Json | null
          status?: Database["public"]["Enums"]["vendor_status"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          about_html?: string | null
          accent_color?: string | null
          applied_at?: string
          approved_at?: string | null
          banner_url?: string | null
          certificate_bg_url?: string | null
          certificate_template?: string
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          primary_color?: string | null
          slug?: string
          social_links?: Json | null
          status?: Database["public"]["Enums"]["vendor_status"]
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_course_id_from_lesson: {
        Args: { _lesson_id: string }
        Returns: string
      }
      get_course_id_from_section: {
        Args: { _section_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_course_instructor: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
      is_enrolled: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "instructor" | "admin"
      course_category:
        | "programming"
        | "data-science"
        | "business"
        | "design"
        | "marketing"
        | "personal-development"
        | "mathematics"
        | "science"
        | "humanities"
        | "language"
      course_level: "beginner" | "intermediate" | "advanced"
      course_status: "draft" | "pending_review" | "published" | "archived"
      enrollment_status: "active" | "completed" | "expired"
      question_type: "multiple_choice" | "true_false" | "short_answer"
      vendor_status: "pending" | "approved" | "rejected" | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "instructor", "admin"],
      course_category: [
        "programming",
        "data-science",
        "business",
        "design",
        "marketing",
        "personal-development",
        "mathematics",
        "science",
        "humanities",
        "language",
      ],
      course_level: ["beginner", "intermediate", "advanced"],
      course_status: ["draft", "pending_review", "published", "archived"],
      enrollment_status: ["active", "completed", "expired"],
      question_type: ["multiple_choice", "true_false", "short_answer"],
      vendor_status: ["pending", "approved", "rejected", "suspended"],
    },
  },
} as const

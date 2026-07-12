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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          admin_notes: string | null
          candidate_id: string
          cover_letter: string | null
          created_at: string
          cv_path: string | null
          email: string
          full_name: string
          id: string
          offer_id: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          candidate_id: string
          cover_letter?: string | null
          created_at?: string
          cv_path?: string | null
          email: string
          full_name: string
          id?: string
          offer_id: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          candidate_id?: string
          cover_letter?: string | null
          created_at?: string
          cv_path?: string | null
          email?: string
          full_name?: string
          id?: string
          offer_id?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "internship_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      business_documents: {
        Row: {
          created_at: string
          file_path: string
          id: string
          mime_type: string | null
          name: string
          request_id: string
          size_bytes: number | null
          type: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          mime_type?: string | null
          name: string
          request_id: string
          size_bytes?: number | null
          type: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          mime_type?: string | null
          name?: string
          request_id?: string
          size_bytes?: number | null
          type?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_documents_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "business_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      business_request_events: {
        Row: {
          actor_id: string | null
          comment: string | null
          created_at: string
          event_type: string
          from_status: string | null
          id: string
          request_id: string
          to_status: string | null
        }
        Insert: {
          actor_id?: string | null
          comment?: string | null
          created_at?: string
          event_type: string
          from_status?: string | null
          id?: string
          request_id: string
          to_status?: string | null
        }
        Update: {
          actor_id?: string | null
          comment?: string | null
          created_at?: string
          event_type?: string
          from_status?: string | null
          id?: string
          request_id?: string
          to_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_request_events_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "business_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      business_requests: {
        Row: {
          assigned_to: string | null
          budget: string | null
          company_id: string
          created_at: string
          deadline: string | null
          description: string
          details: Json | null
          id: string
          priority: string | null
          status: string
          submitter_id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          budget?: string | null
          company_id: string
          created_at?: string
          deadline?: string | null
          description: string
          details?: Json | null
          id?: string
          priority?: string | null
          status?: string
          submitter_id: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          budget?: string | null
          company_id?: string
          created_at?: string
          deadline?: string | null
          description?: string
          details?: Json | null
          id?: string
          priority?: string | null
          status?: string
          submitter_id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          city: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          country: string | null
          created_at: string
          id: string
          name: string
          niu: string | null
          owner_id: string
          rccm: string | null
          sector: string | null
          size: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name: string
          niu?: string | null
          owner_id: string
          rccm?: string | null
          sector?: string | null
          size?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name?: string
          niu?: string | null
          owner_id?: string
          rccm?: string | null
          sector?: string | null
          size?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      internship_offers: {
        Row: {
          contract_type: string
          created_at: string
          created_by: string | null
          description: string
          duration: string | null
          expires_at: string | null
          id: string
          location: string | null
          published: boolean
          requirements: string | null
          sector: string | null
          title: string
          updated_at: string
        }
        Insert: {
          contract_type?: string
          created_at?: string
          created_by?: string | null
          description: string
          duration?: string | null
          expires_at?: string | null
          id?: string
          location?: string | null
          published?: boolean
          requirements?: string | null
          sector?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          contract_type?: string
          created_at?: string
          created_by?: string | null
          description?: string
          duration?: string | null
          expires_at?: string | null
          id?: string
          location?: string | null
          published?: boolean
          requirements?: string | null
          sector?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read_at?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      pre_registrations: {
        Row: {
          created_at: string
          date_of_birth: string
          duration: string
          email: string
          financing_type: string
          full_name: string
          id: string
          id_document_number: string
          id_document_type: string
          neighborhood: string
          phone: string
          place_of_birth: string
          profession: string
          start_date: string
          status: string
          submitter_id: string | null
          training: string
        }
        Insert: {
          created_at?: string
          date_of_birth: string
          duration: string
          email: string
          financing_type: string
          full_name: string
          id?: string
          id_document_number: string
          id_document_type: string
          neighborhood: string
          phone: string
          place_of_birth: string
          profession: string
          start_date: string
          status?: string
          submitter_id?: string | null
          training: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string
          duration?: string
          email?: string
          financing_type?: string
          full_name?: string
          id?: string
          id_document_number?: string
          id_document_type?: string
          neighborhood?: string
          phone?: string
          place_of_birth?: string
          profession?: string
          start_date?: string
          status?: string
          submitter_id?: string | null
          training?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          marketing_opt_in: boolean
          phone: string | null
          preferred_contact: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          marketing_opt_in?: boolean
          phone?: string | null
          preferred_contact?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          marketing_opt_in?: boolean
          phone?: string | null
          preferred_contact?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          budget: string | null
          company: string | null
          created_at: string
          deadline: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string
          pole: string
          status: string
          submitter_id: string | null
        }
        Insert: {
          budget?: string | null
          company?: string | null
          created_at?: string
          deadline?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone: string
          pole: string
          status?: string
          submitter_id?: string | null
        }
        Update: {
          budget?: string | null
          company?: string | null
          created_at?: string
          deadline?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          pole?: string
          status?: string
          submitter_id?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          display_name: string
          display_title: string
          key: string
          signature_url: string | null
          updated_at: string
        }
        Insert: {
          display_name: string
          display_title: string
          key: string
          signature_url?: string | null
          updated_at?: string
        }
        Update: {
          display_name?: string
          display_title?: string
          key?: string
          signature_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "editor"
        | "client"
        | "formateur"
        | "entreprise"
        | "candidat"
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
      app_role: [
        "admin",
        "editor",
        "client",
        "formateur",
        "entreprise",
        "candidat",
      ],
    },
  },
} as const

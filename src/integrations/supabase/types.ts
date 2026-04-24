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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      account_team_members: {
        Row: {
          account_id: string
          created_at: string | null
          id: string
          role_on_account: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          created_at?: string | null
          id?: string
          role_on_account?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          created_at?: string | null
          id?: string
          role_on_account?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_team_members_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          created_at: string | null
          id: string
          industry: string | null
          lifecycle_stage: string | null
          mrr: number | null
          name: string
          notes: string | null
          owner_id: string | null
          phone: string | null
          primary_contact_email: string | null
          primary_contact_name: string | null
          slug: string | null
          status: string | null
          tier: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          industry?: string | null
          lifecycle_stage?: string | null
          mrr?: number | null
          name: string
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          slug?: string | null
          status?: string | null
          tier?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          industry?: string | null
          lifecycle_stage?: string | null
          mrr?: number | null
          name?: string
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          slug?: string | null
          status?: string | null
          tier?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string | null
          custom_properties: Json | null
          device_type: string | null
          event_category: string | null
          event_label: string | null
          event_name: string
          event_value: number | null
          id: string
          ip_address: unknown
          os: string | null
          page_url: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          custom_properties?: Json | null
          device_type?: string | null
          event_category?: string | null
          event_label?: string | null
          event_name: string
          event_value?: number | null
          id?: string
          ip_address?: unknown
          os?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          custom_properties?: Json | null
          device_type?: string | null
          event_category?: string | null
          event_label?: string | null
          event_name?: string
          event_value?: number | null
          id?: string
          ip_address?: unknown
          os?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_lighthouse_runs: {
        Row: {
          accessibility_score: number | null
          audit_id: string
          best_practices_score: number | null
          cls: number | null
          device: string
          fcp_ms: number | null
          fetched_at: string | null
          id: string
          lcp_ms: number | null
          performance_score: number | null
          pwa_score: number | null
          raw_audits: Json | null
          seo_score: number | null
          speed_index: number | null
          tbt_ms: number | null
        }
        Insert: {
          accessibility_score?: number | null
          audit_id: string
          best_practices_score?: number | null
          cls?: number | null
          device?: string
          fcp_ms?: number | null
          fetched_at?: string | null
          id?: string
          lcp_ms?: number | null
          performance_score?: number | null
          pwa_score?: number | null
          raw_audits?: Json | null
          seo_score?: number | null
          speed_index?: number | null
          tbt_ms?: number | null
        }
        Update: {
          accessibility_score?: number | null
          audit_id?: string
          best_practices_score?: number | null
          cls?: number | null
          device?: string
          fcp_ms?: number | null
          fetched_at?: string | null
          id?: string
          lcp_ms?: number | null
          performance_score?: number | null
          pwa_score?: number | null
          raw_audits?: Json | null
          seo_score?: number | null
          speed_index?: number | null
          tbt_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_lighthouse_runs_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          after_state: Json | null
          before_state: Json | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
        }
        Insert: {
          action: string
          actor_id?: string | null
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
        }
        Update: {
          action?: string
          actor_id?: string | null
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
        }
        Relationships: []
      }
      audits: {
        Row: {
          accessibility_score: number | null
          ai_recommendations: Json | null
          best_practices_score: number | null
          contact_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown
          overall_score: number | null
          pdf_url: string | null
          performance_score: number | null
          recommendation_statuses: Json
          seo_score: number | null
          source: string | null
          status: string | null
          updated_at: string | null
          url: string
          user_agent: string | null
          visitor_email: string | null
          visitor_name: string | null
        }
        Insert: {
          accessibility_score?: number | null
          ai_recommendations?: Json | null
          best_practices_score?: number | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          overall_score?: number | null
          pdf_url?: string | null
          performance_score?: number | null
          recommendation_statuses?: Json
          seo_score?: number | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          url: string
          user_agent?: string | null
          visitor_email?: string | null
          visitor_name?: string | null
        }
        Update: {
          accessibility_score?: number | null
          ai_recommendations?: Json | null
          best_practices_score?: number | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          overall_score?: number | null
          pdf_url?: string | null
          performance_score?: number | null
          recommendation_statuses?: Json
          seo_score?: number | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          url?: string
          user_agent?: string | null
          visitor_email?: string | null
          visitor_name?: string | null
        }
        Relationships: []
      }
      automation_logs: {
        Row: {
          actions_executed: Json | null
          contact_id: string | null
          created_at: string | null
          error_message: string | null
          execution_time: number | null
          id: string
          status: string | null
          trigger_event: string | null
          workflow_id: string | null
        }
        Insert: {
          actions_executed?: Json | null
          contact_id?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_time?: number | null
          id?: string
          status?: string | null
          trigger_event?: string | null
          workflow_id?: string | null
        }
        Update: {
          actions_executed?: Json | null
          contact_id?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_time?: number | null
          id?: string
          status?: string | null
          trigger_event?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_logs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "automation_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_workflows: {
        Row: {
          actions: Json
          created_at: string | null
          id: string
          name: string
          status: string | null
          trigger_conditions: Json | null
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          actions: Json
          created_at?: string | null
          id?: string
          name: string
          status?: string | null
          trigger_conditions?: Json | null
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json
          created_at?: string | null
          id?: string
          name?: string
          status?: string | null
          trigger_conditions?: Json | null
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          categories: string[] | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          shares_count: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author?: string | null
          categories?: string[] | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          shares_count?: number | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author?: string | null
          categories?: string[] | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          shares_count?: number | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      campaign_files: {
        Row: {
          account_id: string | null
          category: string | null
          created_at: string | null
          file_url: string
          id: string
          mime_type: string | null
          name: string
          size_bytes: number | null
          uploaded_by: string | null
        }
        Insert: {
          account_id?: string | null
          category?: string | null
          created_at?: string | null
          file_url: string
          id?: string
          mime_type?: string | null
          name: string
          size_bytes?: number | null
          uploaded_by?: string | null
        }
        Update: {
          account_id?: string | null
          category?: string | null
          created_at?: string | null
          file_url?: string
          id?: string
          mime_type?: string | null
          name?: string
          size_bytes?: number | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_files_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_logs: {
        Row: {
          ai_response: string
          id: string
          session_id: string
          timestamp: string | null
          user_id: string
          user_message: string
        }
        Insert: {
          ai_response: string
          id?: string
          session_id: string
          timestamp?: string | null
          user_id: string
          user_message: string
        }
        Update: {
          ai_response?: string
          id?: string
          session_id?: string
          timestamp?: string | null
          user_id?: string
          user_message?: string
        }
        Relationships: []
      }
      client_campaigns: {
        Row: {
          client_id: string
          health_score: number | null
          id: string
          ppc_data: Json | null
          report_month: string | null
          report_pdf_url: string | null
          seo_data: Json | null
          social_data: Json | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          health_score?: number | null
          id?: string
          ppc_data?: Json | null
          report_month?: string | null
          report_pdf_url?: string | null
          seo_data?: Json | null
          social_data?: Json | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          health_score?: number | null
          id?: string
          ppc_data?: Json | null
          report_month?: string | null
          report_pdf_url?: string | null
          seo_data?: Json | null
          social_data?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          assigned_to: string | null
          budget_range: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string | null
          email: string
          follow_up_date: string | null
          id: string
          industry: string | null
          last_contacted: string | null
          lead_score: number | null
          message: string
          name: string
          notes: string | null
          phone: string | null
          service: string | null
          source: string | null
          status: string | null
          updated_at: string | null
          urgency: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          assigned_to?: string | null
          budget_range?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          follow_up_date?: string | null
          id?: string
          industry?: string | null
          last_contacted?: string | null
          lead_score?: number | null
          message: string
          name: string
          notes?: string | null
          phone?: string | null
          service?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          urgency?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          assigned_to?: string | null
          budget_range?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          follow_up_date?: string | null
          id?: string
          industry?: string | null
          last_contacted?: string | null
          lead_score?: number | null
          message?: string
          name?: string
          notes?: string | null
          phone?: string | null
          service?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          urgency?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      content_personalization: {
        Row: {
          case_study_ids: string[] | null
          content_id: string | null
          content_priority: string | null
          content_type: string
          engagement_score: number | null
          featured_services: string[] | null
          hero_message: string | null
          id: string
          is_active: boolean | null
          pricing_recommendation: string | null
          primary_cta: string | null
          secondary_cta: string | null
          shown_at: string | null
          testimonial_ids: string[] | null
          variant: string | null
          visitor_id: string
          visitor_type: string | null
        }
        Insert: {
          case_study_ids?: string[] | null
          content_id?: string | null
          content_priority?: string | null
          content_type: string
          engagement_score?: number | null
          featured_services?: string[] | null
          hero_message?: string | null
          id?: string
          is_active?: boolean | null
          pricing_recommendation?: string | null
          primary_cta?: string | null
          secondary_cta?: string | null
          shown_at?: string | null
          testimonial_ids?: string[] | null
          variant?: string | null
          visitor_id: string
          visitor_type?: string | null
        }
        Update: {
          case_study_ids?: string[] | null
          content_id?: string | null
          content_priority?: string | null
          content_type?: string
          engagement_score?: number | null
          featured_services?: string[] | null
          hero_message?: string | null
          id?: string
          is_active?: boolean | null
          pricing_recommendation?: string | null
          primary_cta?: string | null
          secondary_cta?: string | null
          shown_at?: string | null
          testimonial_ids?: string[] | null
          variant?: string | null
          visitor_id?: string
          visitor_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_personalization_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitor_profiles"
            referencedColumns: ["visitor_id"]
          },
        ]
      }
      crm_activities: {
        Row: {
          account_id: string | null
          body: string | null
          created_at: string | null
          deal_id: string | null
          done_at: string | null
          due_date: string | null
          id: string
          owner_id: string | null
          subject: string | null
          type: string
        }
        Insert: {
          account_id?: string | null
          body?: string | null
          created_at?: string | null
          deal_id?: string | null
          done_at?: string | null
          due_date?: string | null
          id?: string
          owner_id?: string | null
          subject?: string | null
          type?: string
        }
        Update: {
          account_id?: string | null
          body?: string | null
          created_at?: string | null
          deal_id?: string | null
          done_at?: string | null
          due_date?: string | null
          id?: string
          owner_id?: string | null
          subject?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_deals: {
        Row: {
          account_id: string | null
          audit_id: string | null
          closed_at: string | null
          contact_id: string | null
          created_at: string | null
          currency: string | null
          expected_close_date: string | null
          id: string
          lost_reason: string | null
          notes: string | null
          owner_id: string | null
          probability: number | null
          service_interest: string | null
          source: string | null
          stage_id: string | null
          title: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          account_id?: string | null
          audit_id?: string | null
          closed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          expected_close_date?: string | null
          id?: string
          lost_reason?: string | null
          notes?: string | null
          owner_id?: string | null
          probability?: number | null
          service_interest?: string | null
          source?: string | null
          stage_id?: string | null
          title: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          account_id?: string | null
          audit_id?: string | null
          closed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          expected_close_date?: string | null
          id?: string
          lost_reason?: string | null
          notes?: string | null
          owner_id?: string | null
          probability?: number | null
          service_interest?: string | null
          source?: string | null
          stage_id?: string | null
          title?: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_deals_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "crm_pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_pipeline_stages: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          is_lost: boolean | null
          is_won: boolean | null
          name: string
          position: number
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_lost?: boolean | null
          is_won?: boolean | null
          name: string
          position?: number
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_lost?: boolean | null
          is_won?: boolean | null
          name?: string
          position?: number
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          bounced_count: number | null
          clicked_count: number | null
          content: string
          created_at: string | null
          id: string
          name: string
          opened_count: number | null
          recipients_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject: string
          template_id: string | null
          unsubscribed_count: number | null
          updated_at: string | null
        }
        Insert: {
          bounced_count?: number | null
          clicked_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          name: string
          opened_count?: number | null
          recipients_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          template_id?: string | null
          unsubscribed_count?: number | null
          updated_at?: string | null
        }
        Update: {
          bounced_count?: number | null
          clicked_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          name?: string
          opened_count?: number | null
          recipients_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          template_id?: string | null
          unsubscribed_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      email_interactions: {
        Row: {
          campaign_id: string | null
          clicked_url: string | null
          created_at: string | null
          id: string
          interaction_type: string
          subscriber_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          clicked_url?: string | null
          created_at?: string | null
          id?: string
          interaction_type: string
          subscriber_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          clicked_url?: string | null
          created_at?: string | null
          id?: string
          interaction_type?: string
          subscriber_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_interactions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_interactions_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "newsletter_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_email: string
          client_id: string | null
          client_name: string
          created_at: string | null
          currency: string | null
          due_date: string | null
          id: string
          invoice_number: string
          items: Json
          paid_at: string | null
          payment_gateway: string | null
          payment_link: string | null
          quotation_id: string | null
          status: string | null
          subtotal: number
          tax_amount: number | null
          total: number
        }
        Insert: {
          client_email: string
          client_id?: string | null
          client_name: string
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          items?: Json
          paid_at?: string | null
          payment_gateway?: string | null
          payment_link?: string | null
          quotation_id?: string | null
          status?: string | null
          subtotal: number
          tax_amount?: number | null
          total: number
        }
        Update: {
          client_email?: string
          client_id?: string | null
          client_name?: string
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          items?: Json
          paid_at?: string | null
          payment_gateway?: string | null
          payment_link?: string | null
          quotation_id?: string | null
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_articles: {
        Row: {
          body: string
          category: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          body: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          assigned_to: string | null
          budget: string | null
          closing_date: string | null
          company: string | null
          contact_id: string | null
          conversion_probability: number | null
          created_at: string | null
          email: string | null
          estimated_value: number | null
          id: string
          lead_score: number
          name: string | null
          notes: string | null
          phone: string | null
          service: string
          source: string | null
          status: string | null
          timeline: string | null
          updated_at: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          website: string | null
        }
        Insert: {
          assigned_to?: string | null
          budget?: string | null
          closing_date?: string | null
          company?: string | null
          contact_id?: string | null
          conversion_probability?: number | null
          created_at?: string | null
          email?: string | null
          estimated_value?: number | null
          id?: string
          lead_score?: number
          name?: string | null
          notes?: string | null
          phone?: string | null
          service: string
          source?: string | null
          status?: string | null
          timeline?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          website?: string | null
        }
        Update: {
          assigned_to?: string | null
          budget?: string | null
          closing_date?: string | null
          company?: string | null
          contact_id?: string | null
          conversion_probability?: number | null
          created_at?: string | null
          email?: string | null
          estimated_value?: number | null
          id?: string
          lead_score?: number
          name?: string | null
          notes?: string | null
          phone?: string | null
          service?: string
          source?: string | null
          status?: string | null
          timeline?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          last_email_sent: string | null
          name: string | null
          preferences: Json | null
          source: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          last_email_sent?: string | null
          name?: string | null
          preferences?: Json | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_email_sent?: string | null
          name?: string | null
          preferences?: Json | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          link: string | null
          read: boolean | null
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          id: string
          metric_name: string
          metric_unit: string | null
          metric_value: number
          page_url: string | null
          tags: Json | null
          timestamp: string | null
        }
        Insert: {
          id?: string
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          page_url?: string | null
          tags?: Json | null
          timestamp?: string | null
        }
        Update: {
          id?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          page_url?: string | null
          tags?: Json | null
          timestamp?: string | null
        }
        Relationships: []
      }
      personalized_recommendations: {
        Row: {
          clicked_at: string | null
          converted_at: string | null
          id: string
          reason: string | null
          recommendation_type: string
          score: number | null
          service_id: string
          shown_at: string | null
          visitor_id: string
        }
        Insert: {
          clicked_at?: string | null
          converted_at?: string | null
          id?: string
          reason?: string | null
          recommendation_type: string
          score?: number | null
          service_id: string
          shown_at?: string | null
          visitor_id: string
        }
        Update: {
          clicked_at?: string | null
          converted_at?: string | null
          id?: string
          reason?: string | null
          recommendation_type?: string
          score?: number | null
          service_id?: string
          shown_at?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personalized_recommendations_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitor_profiles"
            referencedColumns: ["visitor_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          account_id: string | null
          budget: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          owner_id: string | null
          service_line: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          owner_id?: string | null
          service_line?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          service_line?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_check_logs: {
        Row: {
          check_results: Json
          created_at: string | null
          id: string
          timestamp: string
          triggered_by: string
        }
        Insert: {
          check_results: Json
          created_at?: string | null
          id?: string
          timestamp: string
          triggered_by?: string
        }
        Update: {
          check_results?: Json
          created_at?: string | null
          id?: string
          timestamp?: string
          triggered_by?: string
        }
        Relationships: []
      }
      quotations: {
        Row: {
          client_email: string
          client_id: string | null
          client_name: string
          created_at: string | null
          created_by: string | null
          currency: string | null
          id: string
          items: Json
          notes: string | null
          quote_number: string
          status: string | null
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          total: number
          validity_date: string | null
        }
        Insert: {
          client_email: string
          client_id?: string | null
          client_name: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          id?: string
          items?: Json
          notes?: string | null
          quote_number: string
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          validity_date?: string | null
        }
        Update: {
          client_email?: string
          client_id?: string | null
          client_name?: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          id?: string
          items?: Json
          notes?: string | null
          quote_number?: string
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          validity_date?: string | null
        }
        Relationships: []
      }
      seo_data: {
        Row: {
          created_at: string | null
          external_links_count: number | null
          h1_tags: string[] | null
          h2_tags: string[] | null
          id: string
          image_count: number | null
          internal_links_count: number | null
          keywords: string[] | null
          last_crawled: string | null
          meta_description: string | null
          mobile_friendly: boolean | null
          page_speed_score: number | null
          page_title: string | null
          page_url: string
        }
        Insert: {
          created_at?: string | null
          external_links_count?: number | null
          h1_tags?: string[] | null
          h2_tags?: string[] | null
          id?: string
          image_count?: number | null
          internal_links_count?: number | null
          keywords?: string[] | null
          last_crawled?: string | null
          meta_description?: string | null
          mobile_friendly?: boolean | null
          page_speed_score?: number | null
          page_title?: string | null
          page_url: string
        }
        Update: {
          created_at?: string | null
          external_links_count?: number | null
          h1_tags?: string[] | null
          h2_tags?: string[] | null
          id?: string
          image_count?: number | null
          internal_links_count?: number | null
          keywords?: string[] | null
          last_crawled?: string | null
          meta_description?: string | null
          mobile_friendly?: boolean | null
          page_speed_score?: number | null
          page_title?: string | null
          page_url?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          message: string
          sender_id: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          message: string
          sender_id: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          message?: string
          sender_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          estimate_hours: number | null
          id: string
          priority: string | null
          project_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimate_hours?: number | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assignee_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimate_hours?: number | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          billable: boolean | null
          created_at: string | null
          duration_minutes: number
          entry_date: string | null
          id: string
          notes: string | null
          task_id: string | null
          user_id: string
        }
        Insert: {
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          billable?: boolean | null
          created_at?: string | null
          duration_minutes?: number
          entry_date?: string | null
          id?: string
          notes?: string | null
          task_id?: string | null
          user_id: string
        }
        Update: {
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          billable?: boolean | null
          created_at?: string | null
          duration_minutes?: number
          entry_date?: string | null
          id?: string
          notes?: string | null
          task_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
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
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitor_interactions: {
        Row: {
          action: string
          data: Json | null
          id: string
          page_url: string | null
          session_id: string | null
          timestamp: string | null
          visitor_id: string
        }
        Insert: {
          action: string
          data?: Json | null
          id?: string
          page_url?: string | null
          session_id?: string | null
          timestamp?: string | null
          visitor_id: string
        }
        Update: {
          action?: string
          data?: Json | null
          id?: string
          page_url?: string | null
          session_id?: string | null
          timestamp?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visitor_interactions_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitor_profiles"
            referencedColumns: ["visitor_id"]
          },
        ]
      }
      visitor_profiles: {
        Row: {
          budget: string | null
          company_size: string | null
          created_at: string | null
          device_type: string | null
          id: string
          industry: string | null
          interests: string[] | null
          last_visit: string | null
          lead_score: number | null
          location: string | null
          page_views: number | null
          previous_services: string[] | null
          referral_source: string | null
          time_on_site: number | null
          type: string
          updated_at: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          visitor_id: string
        }
        Insert: {
          budget?: string | null
          company_size?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          industry?: string | null
          interests?: string[] | null
          last_visit?: string | null
          lead_score?: number | null
          location?: string | null
          page_views?: number | null
          previous_services?: string[] | null
          referral_source?: string | null
          time_on_site?: number | null
          type: string
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_id: string
        }
        Update: {
          budget?: string | null
          company_size?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          industry?: string | null
          interests?: string[] | null
          last_visit?: string | null
          lead_score?: number | null
          location?: string | null
          page_views?: number | null
          previous_services?: string[] | null
          referral_source?: string | null
          time_on_site?: number | null
          type?: string
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      visitor_segment_memberships: {
        Row: {
          id: string
          joined_at: string | null
          segment_id: string
          visitor_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          segment_id: string
          visitor_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          segment_id?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visitor_segment_memberships_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "visitor_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitor_segment_memberships_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitor_profiles"
            referencedColumns: ["visitor_id"]
          },
        ]
      }
      visitor_segments: {
        Row: {
          conditions: Json
          created_at: string | null
          criteria: Json | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          priority: number | null
          updated_at: string | null
        }
        Insert: {
          conditions: Json
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          priority?: number | null
          updated_at?: string | null
        }
        Update: {
          conditions?: Json
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string | null
          endpoint_url: string
          failure_count: number | null
          headers: Json | null
          http_method: string | null
          id: string
          last_triggered: string | null
          name: string
          payload_template: Json | null
          status: string | null
          success_count: number | null
          trigger_events: string[]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint_url: string
          failure_count?: number | null
          headers?: Json | null
          http_method?: string | null
          id?: string
          last_triggered?: string | null
          name: string
          payload_template?: Json | null
          status?: string | null
          success_count?: number | null
          trigger_events: string[]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint_url?: string
          failure_count?: number | null
          headers?: Json | null
          http_method?: string | null
          id?: string
          last_triggered?: string | null
          name?: string
          payload_template?: Json | null
          status?: string | null
          success_count?: number | null
          trigger_events?: string[]
          updated_at?: string | null
        }
        Relationships: []
      }
      whatsapp_conversations: {
        Row: {
          account_id: string | null
          assignee_id: string | null
          contact_id: string | null
          contact_name: string | null
          created_at: string | null
          id: string
          last_message_at: string | null
          last_message_text: string | null
          phone_number: string
          status: string | null
          tags: string[] | null
          unread_count: number | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          assignee_id?: string | null
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          last_message_text?: string | null
          phone_number: string
          status?: string | null
          tags?: string[] | null
          unread_count?: number | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          assignee_id?: string | null
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          last_message_text?: string | null
          phone_number?: string
          status?: string | null
          tags?: string[] | null
          unread_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          contact_name: string | null
          id: string
          message_text: string
          message_type: string | null
          phone_number: string
          response_type: string | null
          timestamp: string | null
        }
        Insert: {
          contact_name?: string | null
          id?: string
          message_text: string
          message_type?: string | null
          phone_number: string
          response_type?: string | null
          timestamp?: string | null
        }
        Update: {
          contact_name?: string | null
          id?: string
          message_text?: string
          message_type?: string | null
          phone_number?: string
          response_type?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      whatsapp_messages_v2: {
        Row: {
          body: string | null
          conversation_id: string
          created_at: string | null
          direction: string
          error_message: string | null
          id: string
          media_type: string | null
          media_url: string | null
          meta_message_id: string | null
          sent_at: string | null
          sent_by: string | null
          status: string | null
          template_id: string | null
        }
        Insert: {
          body?: string | null
          conversation_id: string
          created_at?: string | null
          direction?: string
          error_message?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          meta_message_id?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string | null
          template_id?: string | null
        }
        Update: {
          body?: string | null
          conversation_id?: string
          created_at?: string | null
          direction?: string
          error_message?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          meta_message_id?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_v2_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_v2_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_settings: {
        Row: {
          access_token_secret_name: string | null
          business_account_id: string | null
          created_at: string | null
          display_phone_number: string | null
          id: string
          last_verified_at: string | null
          phone_number_id: string | null
          status: string | null
          updated_at: string | null
          webhook_verify_token: string | null
        }
        Insert: {
          access_token_secret_name?: string | null
          business_account_id?: string | null
          created_at?: string | null
          display_phone_number?: string | null
          id?: string
          last_verified_at?: string | null
          phone_number_id?: string | null
          status?: string | null
          updated_at?: string | null
          webhook_verify_token?: string | null
        }
        Update: {
          access_token_secret_name?: string | null
          business_account_id?: string | null
          created_at?: string | null
          display_phone_number?: string | null
          id?: string
          last_verified_at?: string | null
          phone_number_id?: string | null
          status?: string | null
          updated_at?: string | null
          webhook_verify_token?: string | null
        }
        Relationships: []
      }
      whatsapp_templates: {
        Row: {
          body_text: string
          buttons: Json | null
          category: string | null
          created_at: string | null
          footer_text: string | null
          header_text: string | null
          id: string
          language: string | null
          meta_status: string | null
          meta_template_id: string | null
          name: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body_text: string
          buttons?: Json | null
          category?: string | null
          created_at?: string | null
          footer_text?: string | null
          header_text?: string | null
          id?: string
          language?: string | null
          meta_status?: string | null
          meta_template_id?: string | null
          name: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body_text?: string
          buttons?: Json | null
          category?: string | null
          created_at?: string | null
          footer_text?: string | null
          header_text?: string | null
          id?: string
          language?: string | null
          meta_status?: string | null
          meta_template_id?: string | null
          name?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      chat_analytics: {
        Row: {
          chat_date: string | null
          total_conversations: number | null
          unique_sessions: number | null
          unique_users: number | null
        }
        Relationships: []
      }
      lead_conversion_funnel: {
        Row: {
          count: number | null
          percentage: number | null
          status: string | null
        }
        Relationships: []
      }
      team_workload_weekly: {
        Row: {
          billable_hours: number | null
          tasks_worked: number | null
          total_hours: number | null
          user_id: string | null
          week_start: string | null
        }
        Relationships: []
      }
      visitor_analytics: {
        Row: {
          avg_lead_score: number | null
          avg_page_views: number | null
          budget: string | null
          company_size: string | null
          converted_visitors: number | null
          high_value_visitors: number | null
          industry: string | null
          referral_source: string | null
          type: string | null
          visitor_count: number | null
        }
        Relationships: []
      }
      whatsapp_analytics: {
        Row: {
          automated_responses: number | null
          manual_responses: number | null
          message_date: string | null
          total_messages: number | null
          unique_contacts: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_lead_score: {
        Args: {
          contact_budget: string
          contact_company: string
          contact_email: string
          contact_service: string
          contact_urgency: string
        }
        Returns: number
      }
      check_rls_enabled: { Args: { table_name: string }; Returns: boolean }
      get_analytics_summary: {
        Args: { days_back?: number }
        Returns: {
          form_submissions: number
          page_views: number
          top_pages: string[]
          top_sources: string[]
          total_events: number
          unique_sessions: number
        }[]
      }
      get_contact_stats: {
        Args: never
        Returns: {
          avg_lead_score: number
          contacted_contacts: number
          converted_contacts: number
          new_contacts: number
          qualified_contacts: number
          this_month_contacts: number
          this_week_contacts: number
          today_contacts: number
          total_contacts: number
        }[]
      }
      get_personalized_recommendations: {
        Args: { visitor_id_param: string }
        Returns: {
          reason: string
          recommendation_score: number
          service_id: string
        }[]
      }
      get_user_role: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      project_billing_summary: {
        Args: { p_account_id?: string }
        Returns: {
          account_id: string
          billable_hours: number
          budget: number
          estimated_hours: number
          logged_hours: number
          project_id: string
          project_name: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      task_logged_hours: { Args: { p_task_id: string }; Returns: number }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "account_manager"
        | "finance"
        | "content_writer"
        | "seo_specialist"
        | "client"
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
        "super_admin",
        "account_manager",
        "finance",
        "content_writer",
        "seo_specialist",
        "client",
      ],
    },
  },
} as const

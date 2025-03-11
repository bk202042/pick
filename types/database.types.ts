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
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          neighborhood: string | null;
          price: number;
          property_type: string;
          bedrooms: number | null;
          bathrooms: number | null;
          square_footage: number | null;
          parking: boolean;
          parking_fee: number;
          pet_friendly: boolean;
          pet_deposit: number;
          utilities: string[] | null;
          utilities_cost: number;
          security_deposit: number | null;
          minimum_lease: number | null;
          available_date: string | null;
          application_fee: number | null;
          latitude: number | null;
          longitude: number | null;
          nearby_transportation: string[] | null;
          amenities: string[] | null;
          image_urls: string[] | null;
          approved: boolean;
          featured: boolean;
          property_manager: string | null;
          contact_phone: string | null;
          contact_email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          neighborhood?: string | null;
          price: number;
          property_type: string;
          bedrooms?: number | null;
          bathrooms?: number | null;
          square_footage?: number | null;
          parking?: boolean;
          parking_fee?: number;
          pet_friendly?: boolean;
          pet_deposit?: number;
          utilities?: string[] | null;
          utilities_cost?: number;
          security_deposit?: number | null;
          minimum_lease?: number | null;
          available_date?: string | null;
          application_fee?: number | null;
          latitude?: number | null;
          longitude?: number | null;
          nearby_transportation?: string[] | null;
          amenities?: string[] | null;
          image_urls?: string[] | null;
          approved?: boolean;
          featured?: boolean;
          property_manager?: string | null;
          contact_phone?: string | null;
          contact_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          neighborhood?: string | null;
          price?: number;
          property_type?: string;
          bedrooms?: number | null;
          bathrooms?: number | null;
          square_footage?: number | null;
          parking?: boolean;
          parking_fee?: number;
          pet_friendly?: boolean;
          pet_deposit?: number;
          utilities?: string[] | null;
          utilities_cost?: number;
          security_deposit?: number | null;
          minimum_lease?: number | null;
          available_date?: string | null;
          application_fee?: number | null;
          latitude?: number | null;
          longitude?: number | null;
          nearby_transportation?: string[] | null;
          amenities?: string[] | null;
          image_urls?: string[] | null;
          approved?: boolean;
          featured?: boolean;
          property_manager?: string | null;
          contact_phone?: string | null;
          contact_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      saved_listings: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          listing_id: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          listing_id?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: {
      [key: string]: {
        [key: string]: string;
      };
    };
  };
};

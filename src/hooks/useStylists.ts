import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Stylist {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  specialties: string[] | null;
  is_available: boolean;
  rating: number | null;
  created_at: string;
}

export function useStylists() {
  return useQuery({
    queryKey: ["stylists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stylists")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Stylist[];
    },
  });
}

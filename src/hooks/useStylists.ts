import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staff as mockStaff } from "@/data/mockData";

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

// In-memory store for demo mode
let stylistsStore: Stylist[] = mockStaff.map((s) => ({
  id: s.id,
  name: s.name,
  email: s.email,
  phone: s.phone,
  avatar_url: s.avatar,
  role: s.role,
  specialties: s.specialties,
  is_available: s.available,
  rating: s.rating,
  created_at: new Date().toISOString(),
}));

export function useStylists() {
  return useQuery({
    queryKey: ["stylists"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [...stylistsStore];
    },
  });
}

export function useCreateStylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stylist: Omit<Stylist, "id" | "created_at">) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newStylist: Stylist = {
        ...stylist,
        id: `stylist-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      stylistsStore = [...stylistsStore, newStylist];
      return newStylist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stylists"] });
    },
  });
}

export function useUpdateStylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Stylist> & { id: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      stylistsStore = stylistsStore.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      );
      return stylistsStore.find((s) => s.id === id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stylists"] });
    },
  });
}

export function useDeleteStylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      stylistsStore = stylistsStore.filter((s) => s.id !== id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stylists"] });
    },
  });
}

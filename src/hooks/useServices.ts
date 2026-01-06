import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { services as mockServices } from "@/data/mockData";

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// In-memory store for demo mode
let servicesStore: Service[] = mockServices.map((s) => ({
  id: s.id,
  name: s.name,
  description: s.description,
  price: s.price,
  duration: s.duration,
  category: s.category,
  image_url: null,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [...servicesStore];
    },
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Omit<Service, "id" | "created_at" | "updated_at">) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newService: Service = {
        ...service,
        id: `service-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      servicesStore = [...servicesStore, newService];
      return newService;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Service> & { id: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      servicesStore = servicesStore.map((s) =>
        s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s
      );
      return servicesStore.find((s) => s.id === id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      servicesStore = servicesStore.filter((s) => s.id !== id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointments as mockAppointments } from "@/data/mockData";

export interface Appointment {
  id: string;
  customer_id: string;
  service_id: string;
  stylist_id: string | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  services?: {
    name: string;
    price: number;
    duration: number;
  };
  stylists?: {
    name: string;
    avatar_url: string | null;
  };
}

// In-memory store for demo mode
let appointmentsStore: Appointment[] = mockAppointments.map((apt) => ({
  id: apt.id,
  customer_id: "demo-user",
  service_id: apt.id,
  stylist_id: apt.id,
  appointment_date: apt.date,
  appointment_time: apt.time,
  status: apt.status,
  notes: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  services: {
    name: apt.service,
    price: apt.price,
    duration: apt.duration,
  },
  stylists: {
    name: apt.staff,
    avatar_url: apt.staffAvatar,
  },
}));

export function useAppointments() {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [...appointmentsStore];
    },
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointment: {
      service_id: string;
      stylist_id: string;
      appointment_date: string;
      appointment_time: string;
      notes?: string;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        customer_id: "demo-user",
        service_id: appointment.service_id,
        stylist_id: appointment.stylist_id,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
        status: "pending",
        notes: appointment.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        services: {
          name: "Booked Service",
          price: 100,
          duration: 60,
        },
        stylists: {
          name: "Selected Stylist",
          avatar_url: null,
        },
      };
      appointmentsStore = [...appointmentsStore, newAppointment];
      return newAppointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      appointmentsStore = appointmentsStore.map((apt) =>
        apt.id === id ? { ...apt, status, updated_at: new Date().toISOString() } : apt
      );
      return appointmentsStore.find((apt) => apt.id === id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      appointmentsStore = appointmentsStore.map((apt) =>
        apt.id === id ? { ...apt, status: "cancelled", updated_at: new Date().toISOString() } : apt
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

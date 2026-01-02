import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, User, Sparkles, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppointments, Appointment } from "@/hooks/useAppointments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  confirmed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  completed: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Appointments() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const queryClient = useQueryClient();

  const { data: appointments, isLoading, error } = useAppointments();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const filteredAppointments = selectedDate && appointments
    ? appointments.filter((apt) => isSameDay(parseISO(apt.appointment_date), selectedDate))
    : appointments || [];

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment status updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (error) {
    return (
      <AppLayout title="All Appointments" subtitle="Manage customer bookings">
        <Card className="shadow-soft">
          <CardContent className="p-12 text-center">
            <p className="text-destructive">Failed to load appointments. Please try again.</p>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="All Appointments" subtitle="Manage customer bookings">
      <div className="grid gap-6 lg:grid-cols-3 animate-fade-in">
        {/* Calendar */}
        <Card className="shadow-soft lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold">{format(currentDate, "MMMM yyyy")}</h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (<div key={d} className="py-2 font-medium">{d}</div>))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (<div key={`empty-${i}`} />))}
              {days.map((day) => {
                const hasAppointments = appointments?.some((apt) => isSameDay(parseISO(apt.appointment_date), day));
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                return (
                  <button key={day.toISOString()} onClick={() => setSelectedDate(day)}
                    className={cn("relative h-10 rounded-lg text-sm font-medium transition-all duration-200",
                      isToday(day) && !isSelected && "bg-primary/10 text-primary ring-1 ring-primary/20",
                      isSelected && "gradient-primary text-primary-foreground shadow-luxury",
                      !isSelected && !isToday(day) && "hover:bg-muted"
                    )}>
                    {format(day, "d")}
                    {hasAppointments && !isSelected && (<span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" />)}
                  </button>
                );
              })}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4" 
              onClick={() => setSelectedDate(null)}
            >
              View All Appointments
            </Button>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-lg">
                {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "All Appointments"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {filteredAppointments.length} appointments {selectedDate ? "scheduled" : "total"}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="shadow-soft">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.length === 0 ? (
                <Card className="shadow-soft">
                  <CardContent className="p-12 text-center">
                    <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No appointments scheduled</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedDate ? "This day is open for new bookings" : "No appointments in the system yet"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredAppointments.map((apt) => (
                  <Card key={apt.id} className="shadow-soft hover-lift">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 ring-2 ring-background">
                            <AvatarImage src={apt.stylists?.avatar_url || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {apt.stylists?.name?.split(" ").map((n) => n[0]).join("") || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{apt.services?.name || "Unknown Service"}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(parseISO(apt.appointment_date), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right text-sm">
                            <div className="flex items-center gap-1 text-foreground font-medium">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              {apt.appointment_time}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <User className="h-3.5 w-3.5" />
                              {apt.stylists?.name || "No stylist"}
                            </div>
                          </div>
                          <Badge variant="outline" className={cn("capitalize", statusStyles[apt.status || "pending"])}>
                            {apt.status || "pending"}
                          </Badge>
                          <p className="font-heading font-semibold text-primary text-lg">
                            ${apt.services?.price || 0}
                          </p>
                        </div>
                      </div>
                      
                      {/* Admin Actions */}
                      {apt.status === "pending" && (
                        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-success hover:text-success hover:bg-success/10"
                            onClick={() => updateStatusMutation.mutate({ id: apt.id, status: "confirmed" })}
                            disabled={updateStatusMutation.isPending}
                          >
                            {updateStatusMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => updateStatusMutation.mutate({ id: apt.id, status: "cancelled" })}
                            disabled={updateStatusMutation.isPending}
                          >
                            {updateStatusMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                            )}
                            Cancel
                          </Button>
                        </div>
                      )}
                      {apt.status === "confirmed" && (
                        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => updateStatusMutation.mutate({ id: apt.id, status: "completed" })}
                            disabled={updateStatusMutation.isPending}
                          >
                            {updateStatusMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            Mark Complete
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

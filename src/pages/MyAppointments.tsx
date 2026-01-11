import { useState } from "react";
import { format, parseISO, isPast, isToday } from "date-fns";
import { Plus, Clock, Calendar, User, X, Sparkles, CalendarPlus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppointments, useCancelAppointment } from "@/hooks/useAppointments";
import { useServices } from "@/hooks/useServices";
import { BookingModal } from "@/components/booking/BookingModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  confirmed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  completed: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function MyAppointments() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  
  const { data: appointments, isLoading, error } = useAppointments();
  const { data: services } = useServices();
  const cancelMutation = useCancelAppointment();

  const upcomingAppointments = appointments?.filter(
    (apt) => !isPast(parseISO(apt.appointment_date)) || isToday(parseISO(apt.appointment_date))
  ).filter(apt => apt.status !== "cancelled") || [];

  const pastAppointments = appointments?.filter(
    (apt) => isPast(parseISO(apt.appointment_date)) && !isToday(parseISO(apt.appointment_date))
  ) || [];

  const handleCancelAppointment = async () => {
    if (!cancellingId) return;
    try {
      await cancelMutation.mutateAsync(cancellingId);
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
    setCancellingId(null);
  };

  if (error) {
    return (
      <AppLayout title="My Appointments" subtitle="View and manage your bookings">
        <Card className="shadow-soft">
          <CardContent className="p-12 text-center">
            <p className="text-destructive">Failed to load appointments. Please try again.</p>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  const AppointmentCard = ({ appointment, showCancel = false }: { appointment: NonNullable<typeof appointments>[0], showCancel?: boolean }) => (
    <Card className="shadow-soft hover-lift">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-background">
              <AvatarImage src={appointment.stylists?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {appointment.stylists?.name?.split(" ").map((n) => n[0]).join("") || "S"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{appointment.services?.name || "Service"}</p>
              <p className="text-sm text-muted-foreground">with {appointment.stylists?.name || "Stylist"}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className={cn("capitalize", statusStyles[appointment.status || "pending"])}>
              {appointment.status}
            </Badge>
            <p className="font-heading font-semibold text-primary text-lg">
              ₹{Number(appointment.services?.price || 0).toFixed(0)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(parseISO(appointment.appointment_date), "EEE, MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.appointment_time}</span>
            </div>
          </div>
          {showCancel && appointment.status !== "cancelled" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setCancellingId(appointment.id)}
            >
              <X className="mr-1 h-4 w-4" /> Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout title="My Appointments" subtitle="View and manage your bookings">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-muted-foreground">
              {upcomingAppointments.length} upcoming appointment{upcomingAppointments.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button className="gradient-primary shadow-luxury" onClick={() => setShowBookingModal(true)}>
            <Plus className="mr-2 h-4 w-4" /> Book Appointment
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
              <TabsTrigger value="history">History ({pastAppointments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <Card className="shadow-soft">
                  <CardContent className="p-12 text-center">
                    <CalendarPlus className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No upcoming appointments</p>
                    <p className="text-sm text-muted-foreground mt-1">Book your first appointment today!</p>
                    <Button className="mt-4 gradient-primary" onClick={() => setShowBookingModal(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Book Now
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                upcomingAppointments.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} showCancel />
                ))
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {pastAppointments.length === 0 ? (
                <Card className="shadow-soft">
                  <CardContent className="p-12 text-center">
                    <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No past appointments</p>
                    <p className="text-sm text-muted-foreground mt-1">Your booking history will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                pastAppointments.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        open={showBookingModal}
        onOpenChange={setShowBookingModal}
        showServiceSelection
      />

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!cancellingId} onOpenChange={() => setCancellingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelAppointment}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}

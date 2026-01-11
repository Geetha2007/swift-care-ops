import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, User, Sparkles, Check, ChevronRight, ChevronLeft, Scissors } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useStylists, Stylist } from "@/hooks/useStylists";
import { useServices, Service } from "@/hooks/useServices";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service;
  showServiceSelection?: boolean;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

type Step = "service" | "stylist" | "datetime" | "confirm";

export function BookingModal({ open, onOpenChange, service, showServiceSelection = false }: BookingModalProps) {
  const [step, setStep] = useState<Step>(showServiceSelection ? "service" : "stylist");
  const [selectedService, setSelectedService] = useState<Service | null>(service || null);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: stylists, isLoading: stylistsLoading } = useStylists();
  const createAppointment = useCreateAppointment();
  const { toast } = useToast();

  const handleClose = () => {
    setStep(showServiceSelection ? "service" : "stylist");
    setSelectedService(service || null);
    setSelectedStylist(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setNotes("");
    onOpenChange(false);
  };

  const handleBook = async () => {
    if (!selectedService || !selectedStylist || !selectedDate || !selectedTime) return;

    try {
      await createAppointment.mutateAsync({
        service_id: selectedService.id,
        stylist_id: selectedStylist.id,
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
        appointment_time: selectedTime,
        notes: notes || undefined,
      });

      toast({
        title: "Appointment Booked!",
        description: `Your ${selectedService.name} appointment with ${selectedStylist.name} is confirmed.`,
      });
      handleClose();
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case "service":
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">Choose the service you'd like to book.</p>
            {servicesLoading ? (
              <div className="text-center py-8">Loading services...</div>
            ) : (
              <div className="grid gap-3 max-h-[400px] overflow-y-auto">
                {services?.map((svc) => (
                  <Card
                    key={svc.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedService?.id === svc.id && "ring-2 ring-primary shadow-md"
                    )}
                    onClick={() => setSelectedService(svc)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Scissors className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{svc.name}</h4>
                        <p className="text-sm text-muted-foreground">{svc.category} • {svc.duration} min</p>
                      </div>
                      <div className="text-right">
                        <p className="font-heading font-semibold text-primary">₹{Number(svc.price).toFixed(0)}</p>
                      </div>
                      {selectedService?.id === svc.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <Button
              className="w-full gradient-primary"
              disabled={!selectedService}
              onClick={() => setStep("stylist")}
            >
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case "stylist":
        return (
          <div className="space-y-4">
            {showServiceSelection && (
              <Button variant="ghost" size="sm" onClick={() => setStep("service")} className="mb-2">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Services
              </Button>
            )}
            <p className="text-muted-foreground">Choose your preferred stylist for this service.</p>
            {stylistsLoading ? (
              <div className="text-center py-8">Loading stylists...</div>
            ) : (
              <div className="grid gap-3">
                {stylists?.map((stylist) => (
                  <Card
                    key={stylist.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedStylist?.id === stylist.id && "ring-2 ring-primary shadow-md"
                    )}
                    onClick={() => setSelectedStylist(stylist)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                        <AvatarImage src={stylist.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {stylist.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{stylist.name}</h4>
                        <p className="text-sm text-muted-foreground">{stylist.role}</p>
                        {stylist.specialties && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {stylist.specialties.slice(0, 2).map((s) => (
                              <Badge key={s} variant="secondary" className="text-xs">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-medium text-primary">
                          ★ {stylist.rating?.toFixed(1) || "5.0"}
                        </div>
                      </div>
                      {selectedStylist?.id === stylist.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <Button
              className="w-full gradient-primary"
              disabled={!selectedStylist}
              onClick={() => setStep("datetime")}
            >
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case "datetime":
        return (
          <div className="space-y-4">
            <Button variant="ghost" size="sm" onClick={() => setStep("stylist")} className="mb-2">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Stylists
            </Button>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label className="text-base font-semibold mb-3 block">Select Date</Label>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md border"
                />
              </div>
              <div>
                <Label className="text-base font-semibold mb-3 block">Select Time</Label>
                <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      className={cn(selectedTime === time && "gradient-primary")}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <Button
              className="w-full gradient-primary"
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep("confirm")}
            >
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case "confirm":
        return (
          <div className="space-y-4">
            <Button variant="ghost" size="sm" onClick={() => setStep("datetime")} className="mb-2">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Date & Time
            </Button>
            
            <Card className="shadow-soft">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{selectedService?.name}</h4>
                    <p className="text-sm text-muted-foreground">₹{selectedService?.price} • {selectedService?.duration} min</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedStylist?.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Any special requests or notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button
              className="w-full gradient-primary shadow-luxury"
              size="lg"
              onClick={handleBook}
              disabled={createAppointment.isPending}
            >
              {createAppointment.isPending ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        );
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "service":
        return "Choose a Service";
      case "stylist":
        return "Choose Your Stylist";
      case "datetime":
        return "Select Date & Time";
      case "confirm":
        return "Confirm Booking";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">{getStepTitle()}</DialogTitle>
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Clock, User, Sparkles } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { appointments } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusStyles = {
  confirmed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  completed: "bg-muted text-muted-foreground border-border",
};

export default function Appointments() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const filteredAppointments = selectedDate
    ? appointments.filter((apt) => isSameDay(new Date(apt.date), selectedDate))
    : appointments;

  return (
    <AppLayout title="Appointments" subtitle="Manage your bookings and schedule">
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
                const hasAppointments = appointments.some((apt) => isSameDay(new Date(apt.date), day));
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
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-lg">{selectedDate ? format(selectedDate, "EEEE, MMMM d") : "All Appointments"}</h3>
              <p className="text-sm text-muted-foreground">{filteredAppointments.length} appointments scheduled</p>
            </div>
            <Button className="gradient-primary shadow-luxury">
              <Plus className="mr-2 h-4 w-4" /> Book Appointment
            </Button>
          </div>
          <div className="space-y-3">
            {filteredAppointments.length === 0 ? (
              <Card className="shadow-soft">
                <CardContent className="p-12 text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No appointments scheduled</p>
                  <p className="text-sm text-muted-foreground mt-1">This day is open for new bookings</p>
                </CardContent>
              </Card>
            ) : (
              filteredAppointments.map((apt) => (
                <Card key={apt.id} className="shadow-soft hover-lift">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-background">
                          <AvatarImage src={apt.clientAvatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">{apt.client.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{apt.client}</p>
                          <p className="text-sm text-muted-foreground">{apt.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <div className="flex items-center gap-1 text-foreground font-medium"><Clock className="h-3.5 w-3.5 text-muted-foreground" />{apt.time}</div>
                          <div className="flex items-center gap-1 text-muted-foreground"><User className="h-3.5 w-3.5" />{apt.staff}</div>
                        </div>
                        <Badge variant="outline" className={cn("capitalize", statusStyles[apt.status])}>{apt.status}</Badge>
                        <p className="font-heading font-semibold text-primary text-lg">${apt.price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

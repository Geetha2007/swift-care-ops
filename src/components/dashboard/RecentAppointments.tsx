import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Sparkles } from "lucide-react";
import { recentAppointments } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const statusStyles = {
  confirmed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  completed: "bg-muted text-muted-foreground border-border",
};

export function RecentAppointments() {
  return (
    <Card className="shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-heading font-semibold">Today's Appointments</CardTitle>
          <p className="text-sm text-muted-foreground">Upcoming client sessions</p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/appointments" className="text-primary gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentAppointments.map((appointment, index) => (
            <div
              key={appointment.id}
              className={cn(
                "flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:shadow-soft hover:border-primary/20",
                index === 0 && "border-primary/30 bg-primary/5"
              )}
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-11 w-11 ring-2 ring-background">
                  <AvatarImage src={appointment.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {appointment.client
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    {appointment.client}
                    {index === 0 && <Sparkles className="h-3.5 w-3.5 text-primary" />}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.service} • {appointment.staff}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {appointment.time}
                  </div>
                  <p className="text-xs text-muted-foreground">{appointment.date}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize font-medium",
                    statusStyles[appointment.status]
                  )}
                >
                  {appointment.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

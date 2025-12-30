import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Appointments</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/appointments" className="text-primary">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={appointment.avatar} />
                  <AvatarFallback>
                    {appointment.client
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{appointment.client}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.service} • {appointment.staff}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {appointment.time}
                  </div>
                  <p className="text-xs text-muted-foreground">{appointment.date}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { todaySchedule } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export function TodaySchedule() {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {todaySchedule.map((slot, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                slot.available
                  ? "bg-muted/30"
                  : "bg-accent"
              )}
            >
              <div className="flex items-center gap-2 w-24">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {slot.time}
                </span>
              </div>
              {slot.available ? (
                <span className="text-sm text-muted-foreground italic">Available</span>
              ) : (
                <span className="text-sm font-medium text-accent-foreground">
                  {slot.appointment}
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

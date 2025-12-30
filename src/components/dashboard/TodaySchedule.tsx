import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { todaySchedule } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Clock, Sparkles } from "lucide-react";

export function TodaySchedule() {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-heading font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Schedule
        </CardTitle>
        <p className="text-sm text-muted-foreground">Your day at a glance</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {todaySchedule.map((slot, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                slot.available
                  ? "bg-muted/30 border border-dashed border-border"
                  : "bg-primary/5 border border-primary/10"
              )}
            >
              <div className="flex items-center gap-2 w-20">
                <Clock className={cn(
                  "h-3.5 w-3.5",
                  slot.available ? "text-muted-foreground" : "text-primary"
                )} />
                <span className={cn(
                  "text-sm font-medium",
                  slot.available ? "text-muted-foreground" : "text-foreground"
                )}>
                  {slot.time}
                </span>
              </div>
              {slot.available ? (
                <span className="text-sm text-muted-foreground italic">Open slot</span>
              ) : (
                <span className="text-sm font-medium text-foreground truncate">
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

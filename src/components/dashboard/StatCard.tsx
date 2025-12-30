import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  prefix?: string;
  variant?: "default" | "primary" | "gold";
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  prefix = "",
  variant = "default",
}: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className={cn(
      "hover-lift overflow-hidden",
      variant === "default" && "shadow-soft",
      variant === "primary" && "gradient-primary text-primary-foreground shadow-luxury",
      variant === "gold" && "gradient-gold text-white shadow-gold"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={cn(
              "text-sm font-medium",
              variant === "default" ? "text-muted-foreground" : "text-white/80"
            )}>{title}</p>
            <p className={cn(
              "text-3xl font-heading font-bold",
              variant === "default" && "text-foreground"
            )}>
              {prefix}
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {change !== undefined && (
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  variant === "default" && isPositive && "text-success",
                  variant === "default" && isNegative && "text-destructive",
                  variant !== "default" && "text-white/90"
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : isNegative ? (
                  <TrendingDown className="h-4 w-4" />
                ) : null}
                <span>
                  {isPositive ? "+" : ""}
                  {change}% from last month
                </span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              variant === "default" && "bg-primary/10 text-primary",
              variant !== "default" && "bg-white/20 text-white"
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

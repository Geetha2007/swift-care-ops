import { useState } from "react";
import { 
  Calendar, DollarSign, Users, UserCheck, TrendingUp, TrendingDown,
  Clock, ArrowRight, Sparkles, Bell, Search, ChevronDown, Star,
  Scissors, Heart, MoreHorizontal, Crown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for UI demo
const stats = {
  appointments: { value: 24, change: 12 },
  revenue: { value: 12850, change: 8.5 },
  customers: { value: 1248, change: 5.2 },
  staff: { value: 8, change: 0 },
};

const revenueData = [
  { month: "Jan", revenue: 8500, expenses: 4200 },
  { month: "Feb", revenue: 9200, expenses: 4500 },
  { month: "Mar", revenue: 10800, expenses: 4800 },
  { month: "Apr", revenue: 9800, expenses: 4600 },
  { month: "May", revenue: 11500, expenses: 5000 },
  { month: "Jun", revenue: 12850, expenses: 5200 },
];

const serviceData = [
  { name: "Haircut", value: 35, color: "hsl(350, 60%, 65%)" },
  { name: "Coloring", value: 25, color: "hsl(40, 70%, 55%)" },
  { name: "Styling", value: 20, color: "hsl(220, 10%, 35%)" },
  { name: "Treatment", value: 15, color: "hsl(340, 55%, 55%)" },
  { name: "Other", value: 5, color: "hsl(30, 50%, 65%)" },
];

const appointments = [
  { id: 1, client: "Sarah Johnson", service: "Hair Coloring", staff: "Emma W.", time: "9:00 AM", status: "confirmed", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
  { id: 2, client: "Emily Chen", service: "Haircut & Style", staff: "Mia T.", time: "10:30 AM", status: "confirmed", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" },
  { id: 3, client: "Michael Brown", service: "Beard Trim", staff: "James L.", time: "11:00 AM", status: "pending", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
  { id: 4, client: "Jessica Williams", service: "Deep Treatment", staff: "Emma W.", time: "2:00 PM", status: "confirmed", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" },
];

const schedule = [
  { time: "9:00 AM", appointment: "Sarah Johnson - Coloring", available: false },
  { time: "10:00 AM", appointment: null, available: true },
  { time: "11:00 AM", appointment: "Michael Brown - Trim", available: false },
  { time: "12:00 PM", appointment: null, available: true },
  { time: "1:00 PM", appointment: "Lunch Break", available: false },
  { time: "2:00 PM", appointment: "Jessica Williams", available: false },
  { time: "3:00 PM", appointment: null, available: true },
];

const topStylists = [
  { name: "Emma Watson", role: "Senior Stylist", rating: 4.9, bookings: 156, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100" },
  { name: "Mia Thompson", role: "Color Specialist", rating: 4.8, bookings: 142, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100" },
  { name: "James Liu", role: "Barber", rating: 4.9, bookings: 138, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" },
];

const statusStyles: Record<string, string> = {
  confirmed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  completed: "bg-muted text-muted-foreground border-border",
};

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  prefix = "", 
  variant = "default" 
}: { 
  title: string; 
  value: number; 
  change: number; 
  icon: any; 
  prefix?: string; 
  variant?: "default" | "primary" | "gold"; 
}) {
  const isPositive = change > 0;

  return (
    <Card className={cn(
      "hover-lift overflow-hidden transition-all duration-300",
      variant === "default" && "shadow-soft hover:shadow-md",
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
              "text-3xl font-heading font-bold tracking-tight",
              variant === "default" && "text-foreground"
            )}>
              {prefix}{value.toLocaleString()}
            </p>
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              variant === "default" && isPositive && "text-success",
              variant === "default" && !isPositive && "text-muted-foreground",
              variant !== "default" && "text-white/90"
            )}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{isPositive ? "+" : ""}{change}% from last month</span>
            </div>
          </div>
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl transition-transform hover:scale-105",
            variant === "default" && "bg-primary/10 text-primary",
            variant !== "default" && "bg-white/20 text-white backdrop-blur-sm"
          )}>
            <Icon className="h-7 w-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [isAdmin] = useState(true); // Toggle this to see customer vs admin view

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-luxury">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-bold text-foreground">Salon Smart</h1>
              <p className="text-xs text-muted-foreground">Premium Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search clients, services..." 
                className="pl-10 w-64 h-9 bg-muted/30 border-border/50"
              />
            </div>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">3</span>
            </Button>

            <div className="flex items-center gap-3 pl-4 border-l border-border/50">
              <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">VR</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">Victoria Rose</p>
                <p className="text-xs text-muted-foreground">{isAdmin ? "Admin" : "Customer"}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Good morning, Victoria! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Here's your salon overview for today." : "Welcome back! View your appointments and services."}
          </p>
        </div>

        <div className="space-y-6">
          {/* Stats Grid */}
          <div className={cn(
            "grid gap-4 sm:grid-cols-2",
            isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-2"
          )}>
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <StatCard
                title="Today's Appointments"
                value={stats.appointments.value}
                change={stats.appointments.change}
                icon={Calendar}
                variant="primary"
              />
            </div>
            {isAdmin && (
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <StatCard
                  title="Monthly Revenue"
                  value={stats.revenue.value}
                  change={stats.revenue.change}
                  icon={DollarSign}
                  prefix="$"
                  variant="gold"
                />
              </div>
            )}
            {isAdmin && (
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <StatCard
                  title="Total Customers"
                  value={stats.customers.value}
                  change={stats.customers.change}
                  icon={UserCheck}
                />
              </div>
            )}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <StatCard
                title="Active Staff"
                value={stats.staff.value}
                change={stats.staff.change}
                icon={Users}
              />
            </div>
          </div>

          {/* Charts Row - Admin Only */}
          {isAdmin && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Revenue Chart */}
              <Card className="shadow-soft animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-heading font-semibold">Revenue Overview</CardTitle>
                      <p className="text-sm text-muted-foreground">Monthly revenue vs expenses</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(350, 60%, 65%)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(350, 60%, 65%)" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(40, 70%, 55%)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(40, 70%, 55%)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 90%)" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(220, 10%, 45%)", fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(220, 10%, 45%)", fontSize: 12 }} tickFormatter={(v) => `$${v/1000}k`} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(0, 0%, 100%)", 
                            border: "1px solid hsl(30, 15%, 90%)", 
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                          }}
                          formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="hsl(350, 60%, 65%)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                        <Area type="monotone" dataKey="expenses" stroke="hsl(40, 70%, 55%)" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" name="Expenses" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Service Distribution */}
              <Card className="shadow-soft animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-heading font-semibold">Services Distribution</CardTitle>
                      <p className="text-sm text-muted-foreground">Popular services this month</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="h-[250px] w-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={serviceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {serviceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 flex-1 ml-8">
                      {serviceData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground font-medium">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Bottom Section */}
          <div className={cn("grid gap-6", isAdmin ? "lg:grid-cols-3" : "lg:grid-cols-2")}>
            {/* Today's Appointments */}
            <Card className={cn("shadow-soft animate-fade-in", isAdmin && "lg:col-span-2")} style={{ animationDelay: '0.7s' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-heading font-semibold">Today's Appointments</CardTitle>
                  <p className="text-sm text-muted-foreground">Upcoming client sessions</p>
                </div>
                <Button variant="ghost" size="sm" className="text-primary gap-1">
                  View all <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.map((apt, index) => (
                    <div
                      key={apt.id}
                      className={cn(
                        "flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:shadow-soft hover:border-primary/20",
                        index === 0 && "border-primary/30 bg-primary/5"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-11 w-11 ring-2 ring-background">
                          <AvatarImage src={apt.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {apt.client.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground flex items-center gap-2">
                            {apt.client}
                            {index === 0 && <Sparkles className="h-3.5 w-3.5 text-primary" />}
                          </p>
                          <p className="text-sm text-muted-foreground">{apt.service} • {apt.staff}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {apt.time}
                          </div>
                          <p className="text-xs text-muted-foreground">Today</p>
                        </div>
                        <Badge variant="outline" className={cn("capitalize font-medium", statusStyles[apt.status])}>
                          {apt.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card className="shadow-soft animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-heading font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Today's Schedule
                </CardTitle>
                <p className="text-sm text-muted-foreground">Your day at a glance</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {schedule.map((slot, index) => (
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
                        <Clock className={cn("h-3.5 w-3.5", slot.available ? "text-muted-foreground" : "text-primary")} />
                        <span className={cn("text-sm font-medium", slot.available ? "text-muted-foreground" : "text-foreground")}>
                          {slot.time}
                        </span>
                      </div>
                      <span className={cn("text-sm truncate", slot.available ? "text-muted-foreground italic" : "font-medium text-foreground")}>
                        {slot.available ? "Open slot" : slot.appointment}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Stylists - Admin Only */}
          {isAdmin && (
            <Card className="shadow-soft animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-heading font-semibold flex items-center gap-2">
                    <Crown className="h-5 w-5 text-accent" />
                    Top Performers
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">This month's star stylists</p>
                </div>
                <Button variant="ghost" size="sm" className="text-primary gap-1">
                  View all <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {topStylists.map((stylist, index) => (
                    <div key={stylist.name} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/20 hover:shadow-soft transition-all">
                      <div className="relative">
                        <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                          <AvatarImage src={stylist.avatar} />
                          <AvatarFallback>{stylist.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-accent flex items-center justify-center">
                            <Crown className="h-3.5 w-3.5 text-accent-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{stylist.name}</p>
                        <p className="text-sm text-muted-foreground">{stylist.role}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                            <span className="text-sm font-medium">{stylist.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{stylist.bookings} bookings</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

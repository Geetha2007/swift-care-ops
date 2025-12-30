import { Plus, Mail, Phone, Star, Calendar, Edit2, Sparkles } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { staff } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Staff() {
  return (
    <AppLayout title="Staff" subtitle="Manage your team members">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-muted-foreground">{staff.length} team members</p>
          </div>
          <Button className="gradient-primary shadow-luxury">
            <Plus className="mr-2 h-4 w-4" /> Add Staff Member
          </Button>
        </div>

        {/* Staff Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((member) => (
            <Card key={member.id} className="shadow-soft hover-lift group overflow-hidden">
              <CardContent className="p-0">
                {/* Header with gradient */}
                <div className="h-20 gradient-primary relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 bg-white/20 hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="px-5 pb-5 -mt-10 relative">
                  {/* Avatar */}
                  <Avatar className="h-20 w-20 ring-4 ring-background mb-4">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-semibold text-lg">{member.name}</h3>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            member.available
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {member.available ? "Available" : "Busy"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs font-normal">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-3 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-warning fill-warning" />
                        <span className="font-semibold text-foreground">{member.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{member.appointmentsCompleted.toLocaleString()} appointments</span>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Mail className="h-3.5 w-3.5" /> Email
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Phone className="h-3.5 w-3.5" /> Call
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

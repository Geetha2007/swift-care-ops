import { useState } from "react";
import { Plus, Mail, Phone, Star, Edit2, Sparkles } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useStylists } from "@/hooks/useStylists";
import { useAuth } from "@/contexts/AuthContext";
import { AddStaffModal } from "@/components/staff/AddStaffModal";
import { EditStaffModal } from "@/components/staff/EditStaffModal";
import { cn } from "@/lib/utils";

interface Stylist {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  specialties: string[] | null;
  is_available: boolean | null;
  avatar_url: string | null;
  rating: number | null;
}

export default function Staff() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Stylist | null>(null);
  const { data: stylists, isLoading, error } = useStylists();
  const { isAdmin } = useAuth();

  if (error) {
    return (
      <AppLayout title="Staff" subtitle="Manage your team members">
        <Card className="shadow-soft">
          <CardContent className="p-12 text-center">
            <p className="text-destructive">Failed to load staff. Please try again.</p>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={isAdmin ? "Staff" : "Stylists"} subtitle={isAdmin ? "Manage your team members" : "Meet our talented team"}>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-muted-foreground">{stylists?.length || 0} team members</p>
          </div>
          {isAdmin && (
            <Button className="gradient-primary shadow-luxury" onClick={() => setShowAddModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Staff Member
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="shadow-soft">
                <CardContent className="p-0">
                  <div className="h-20 bg-muted" />
                  <div className="px-5 pb-5 -mt-10 relative">
                    <Skeleton className="h-20 w-20 rounded-full mb-4" />
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Staff Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stylists?.map((member) => (
              <Card key={member.id} className="shadow-soft hover-lift group overflow-hidden">
                <CardContent className="p-0">
                  {/* Header with gradient */}
                  <div className="h-20 gradient-primary relative">
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 bg-white/20 hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setEditingStaff(member as Stylist)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="px-5 pb-5 -mt-10 relative">
                    {/* Avatar */}
                    <Avatar className="h-20 w-20 ring-4 ring-background mb-4">
                      <AvatarImage src={member.avatar_url || undefined} />
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
                              member.is_available
                                ? "bg-success/10 text-success border-success/20"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {member.is_available ? "Available" : "Busy"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>

                      {/* Specialties */}
                      {member.specialties && member.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {member.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs font-normal">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-4 pt-3 border-t border-border">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-warning fill-warning" />
                          <span className="font-semibold text-foreground">{member.rating || 5.0}</span>
                        </div>
                      </div>

                      {/* Contact - Only for Admin */}
                      {isAdmin && (
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1 gap-1">
                            <Mail className="h-3.5 w-3.5" /> Email
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 gap-1">
                            <Phone className="h-3.5 w-3.5" /> Call
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && (!stylists || stylists.length === 0) && (
          <Card className="shadow-soft">
            <CardContent className="p-12 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No staff members found</p>
              {isAdmin && (
                <Button className="mt-4 gradient-primary" onClick={() => setShowAddModal(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Staff Member
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Staff Modal */}
      <AddStaffModal open={showAddModal} onOpenChange={setShowAddModal} />
      
      {/* Edit Staff Modal */}
      <EditStaffModal 
        open={!!editingStaff} 
        onOpenChange={(open) => !open && setEditingStaff(null)} 
        staff={editingStaff}
      />
    </AppLayout>
  );
}

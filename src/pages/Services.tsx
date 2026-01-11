import { useState } from "react";
import { Plus, Edit2, Clock, IndianRupee, Sparkles, Search, Calendar } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useServices, Service } from "@/hooks/useServices";
import { useAuth } from "@/contexts/AuthContext";
import { BookingModal } from "@/components/booking/BookingModal";
import { EditServiceModal } from "@/components/services/EditServiceModal";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Hair: "bg-primary/10 text-primary border-primary/20",
  Treatment: "bg-success/10 text-success border-success/20",
  Nails: "bg-warning/10 text-warning border-warning/20",
  Skincare: "bg-secondary/10 text-secondary border-secondary/20",
  Massage: "bg-chart-5/10 text-chart-5 border-chart-5/20",
};

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: services, isLoading, error } = useServices();
  const { isAdmin } = useAuth();

  const categories = services ? [...new Set(services.map((s) => s.category))] : [];

  const filteredServices = services?.filter((service) => {
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesCategory && matchesSearch;
  }) ?? [];

  if (error) {
    return (
      <AppLayout title="Services" subtitle="Manage your salon service menu">
        <Card className="shadow-soft">
          <CardContent className="p-12 text-center">
            <p className="text-destructive">Failed to load services. Please try again.</p>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Services" subtitle={isAdmin ? "Manage your salon service menu" : "Browse and book our services"}>
      <div className="space-y-6 animate-fade-in">
        {/* Header with Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {isAdmin && (
            <Button className="gradient-primary shadow-luxury" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Service
            </Button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            className={cn(selectedCategory === null && "gradient-primary")}
            onClick={() => setSelectedCategory(null)}
          >
            All Services
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={cn(selectedCategory === category && "gradient-primary")}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="shadow-soft">
                <CardContent className="p-5 space-y-4">
                  <Skeleton className="h-40 w-full rounded-lg" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Services Grid */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="shadow-soft hover-lift group relative overflow-hidden"
              >
                {/* Service Image */}
                {service.image_url && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <CardContent className="p-5">
                  <div className="space-y-4">
                    <div>
                      <Badge
                        variant="outline"
                        className={cn("text-xs mb-2", categoryColors[service.category] || "bg-muted")}
                      >
                        {service.category}
                      </Badge>
                      <h3 className="font-heading font-semibold text-foreground">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm">
                          <IndianRupee className="h-4 w-4 text-primary" />
                          <span className="font-heading font-semibold text-foreground">
                            ₹{Number(service.price).toFixed(0)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{service.duration}min</span>
                        </div>
                      </div>

                      {isAdmin ? (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setEditingService(service)}
                          >
                            <Edit2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="gradient-primary"
                          onClick={() => setBookingService(service)}
                        >
                          <Calendar className="mr-1 h-3.5 w-3.5" /> Book
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredServices.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="p-12 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No services found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Modal */}
      {bookingService && (
        <BookingModal
          open={!!bookingService}
          onOpenChange={(open) => !open && setBookingService(null)}
          service={bookingService}
        />
      )}

      {/* Edit Service Modal */}
      <EditServiceModal
        open={!!editingService}
        onOpenChange={(open) => !open && setEditingService(null)}
        service={editingService}
        mode="edit"
      />

      {/* Add Service Modal */}
      <EditServiceModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        mode="add"
      />
    </AppLayout>
  );
}

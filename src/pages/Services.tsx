import { useState } from "react";
import { Plus, Edit2, Trash2, Clock, DollarSign, Sparkles, Search, Star } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { services } from "@/data/mockData";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Hair: "bg-primary/10 text-primary border-primary/20",
  Skin: "bg-success/10 text-success border-success/20",
  Nails: "bg-warning/10 text-warning border-warning/20",
  Body: "bg-secondary/10 text-secondary border-secondary/20",
  Makeup: "bg-chart-5/10 text-chart-5 border-chart-5/20",
};

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [...new Set(services.map((s) => s.category))];

  const filteredServices = services.filter((service) => {
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AppLayout title="Services" subtitle="Manage your salon service menu">
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
          <Button className="gradient-primary shadow-luxury">
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
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

        {/* Services Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className={cn(
                "shadow-soft hover-lift group relative overflow-hidden",
                service.popular && "ring-1 ring-primary/30"
              )}
            >
              {service.popular && (
                <div className="absolute top-3 right-3">
                  <Badge className="gradient-gold text-white border-0 gap-1">
                    <Star className="h-3 w-3 fill-white" /> Popular
                  </Badge>
                </div>
              )}
              <CardContent className="p-5">
                <div className="space-y-4">
                  <div>
                    <Badge
                      variant="outline"
                      className={cn("text-xs mb-2", categoryColors[service.category])}
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
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="font-heading font-semibold text-foreground">{service.price}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{service.duration}min</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="p-12 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No services found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

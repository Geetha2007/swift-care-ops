import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Service } from "@/hooks/useServices";

interface ServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  mode: "add" | "edit";
}

const categories = ["Hair", "Treatment", "Nails", "Skincare", "Massage"];

export function ServiceModal({ open, onOpenChange, service, mode }: ServiceModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "Hair",
    image_url: "",
    is_active: true,
  });

  useEffect(() => {
    if (service && mode === "edit") {
      setFormData({
        name: service.name,
        description: service.description || "",
        price: String(service.price),
        duration: String(service.duration),
        category: service.category,
        image_url: service.image_url || "",
        is_active: service.is_active,
      });
    } else if (mode === "add") {
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        category: "Hair",
        image_url: "",
        is_active: true,
      });
    }
  }, [service, mode, open]);

  const createServiceMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("services").insert({
        name: data.name,
        description: data.description || null,
        price: parseFloat(data.price),
        duration: parseInt(data.duration),
        category: data.category,
        image_url: data.image_url || null,
        is_active: data.is_active,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service added successfully!");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!service) return;
      const { error } = await supabase
        .from("services")
        .update({
          name: data.name,
          description: data.description || null,
          price: parseFloat(data.price),
          duration: parseInt(data.duration),
          category: data.category,
          image_url: data.image_url || null,
          is_active: data.is_active,
        })
        .eq("id", service.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service updated successfully!");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async () => {
      if (!service) return;
      const { error } = await supabase.from("services").delete().eq("id", service.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service deleted successfully!");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      toast.error("Valid duration is required");
      return;
    }

    if (mode === "add") {
      createServiceMutation.mutate(formData);
    } else {
      updateServiceMutation.mutate(formData);
    }
  };

  const isPending = createServiceMutation.isPending || updateServiceMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {mode === "add" ? "Add Service" : "Edit Service"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service-name">Name *</Label>
            <Input
              id="service-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter service name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-description">Description</Label>
            <Textarea
              id="service-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the service..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service-price">Price ($) *</Label>
              <Input
                id="service-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-duration">Duration (min) *</Label>
              <Input
                id="service-duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="30"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-image">Image URL</Label>
            <Input
              id="service-image"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="service-active">Active</Label>
            <Switch
              id="service-active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            {mode === "edit" && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => deleteServiceMutation.mutate()}
                disabled={deleteServiceMutation.isPending}
              >
                {deleteServiceMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 gradient-primary"
              disabled={isPending}
            >
              {isPending ? "Saving..." : mode === "add" ? "Add Service" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from "react";
import { useCreateService, useUpdateService, useDeleteService, Service } from "@/hooks/useServices";
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

interface ServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  mode: "add" | "edit";
}

const categories = ["Hair", "Treatment", "Nails", "Skincare", "Massage"];

export function ServiceModal({ open, onOpenChange, service, mode }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "Hair",
    image_url: "",
    is_active: true,
  });

  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

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

    const serviceData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      category: formData.category,
      image_url: formData.image_url || null,
      is_active: formData.is_active,
    };

    if (mode === "add") {
      createServiceMutation.mutate(serviceData, {
        onSuccess: () => {
          toast.success("Service added successfully!");
          onOpenChange(false);
        },
        onError: (error: Error) => {
          toast.error(error.message);
        },
      });
    } else if (service) {
      updateServiceMutation.mutate(
        { id: service.id, ...serviceData },
        {
          onSuccess: () => {
            toast.success("Service updated successfully!");
            onOpenChange(false);
          },
          onError: (error: Error) => {
            toast.error(error.message);
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (!service) return;
    deleteServiceMutation.mutate(service.id, {
      onSuccess: () => {
        toast.success("Service deleted successfully!");
        onOpenChange(false);
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
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
                onClick={handleDelete}
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

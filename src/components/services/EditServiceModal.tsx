import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Service, useUpdateService, useCreateService, useDeleteService } from "@/hooks/useServices";
import { toast } from "sonner";

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute").max(480, "Duration cannot exceed 8 hours"),
  category: z.string().min(1, "Category is required"),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  is_active: z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const categories = ["Hair", "Treatment", "Nails", "Skincare", "Massage"];

interface EditServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  mode: "edit" | "add";
}

export function EditServiceModal({ open, onOpenChange, service, mode }: EditServiceModalProps) {
  const updateService = useUpdateService();
  const createService = useCreateService();
  const deleteService = useDeleteService();

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 30,
      category: "Hair",
      image_url: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (service && mode === "edit") {
      form.reset({
        name: service.name,
        description: service.description || "",
        price: Number(service.price),
        duration: service.duration,
        category: service.category,
        image_url: service.image_url || "",
        is_active: service.is_active,
      });
    } else if (mode === "add") {
      form.reset({
        name: "",
        description: "",
        price: 0,
        duration: 30,
        category: "Hair",
        image_url: "",
        is_active: true,
      });
    }
  }, [service, mode, form]);

  const onSubmit = async (data: ServiceFormData) => {
    try {
      if (mode === "edit" && service) {
        await updateService.mutateAsync({
          id: service.id,
          name: data.name,
          description: data.description || null,
          price: data.price,
          duration: data.duration,
          category: data.category,
          image_url: data.image_url || null,
          is_active: data.is_active,
        });
        toast.success("Service updated successfully");
      } else {
        await createService.mutateAsync({
          name: data.name,
          description: data.description || null,
          price: data.price,
          duration: data.duration,
          category: data.category,
          image_url: data.image_url || null,
          is_active: data.is_active,
        });
        toast.success("Service created successfully");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(mode === "edit" ? "Failed to update service" : "Failed to create service");
    }
  };

  const handleDelete = async () => {
    if (!service) return;
    
    try {
      await deleteService.mutateAsync(service.id);
      toast.success("Service deleted successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Service" : "Add New Service"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Haircut & Style" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the service..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₹)</FormLabel>
                  <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="480" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Inactive services won't be visible to customers
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              {mode === "edit" && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteService.isPending}
                >
                  Delete
                </Button>
              )}
              <div className="flex-1" />
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="gradient-primary"
                disabled={updateService.isPending || createService.isPending}
              >
                {mode === "edit" ? "Save Changes" : "Add Service"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

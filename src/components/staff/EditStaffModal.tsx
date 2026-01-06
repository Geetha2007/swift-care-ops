import { useState, useEffect } from "react";
import { useUpdateStylist, useDeleteStylist } from "@/hooks/useStylists";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

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

interface EditStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Stylist | null;
}

export function EditStaffModal({ open, onOpenChange, staff }: EditStaffModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Stylist",
    specialties: "",
    is_available: true,
  });

  const updateStaffMutation = useUpdateStylist();
  const deleteStaffMutation = useDeleteStylist();

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email || "",
        phone: staff.phone || "",
        role: staff.role,
        specialties: staff.specialties?.join(", ") || "",
        is_available: staff.is_available ?? true,
      });
    }
  }, [staff]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!staff) return;

    updateStaffMutation.mutate(
      {
        id: staff.id,
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        role: formData.role,
        specialties: formData.specialties ? formData.specialties.split(",").map(s => s.trim()) : null,
        is_available: formData.is_available,
      },
      {
        onSuccess: () => {
          toast.success("Staff member updated successfully!");
          onOpenChange(false);
        },
        onError: (error: Error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!staff) return;
    deleteStaffMutation.mutate(staff.id, {
      onSuccess: () => {
        toast.success("Staff member deleted successfully!");
        onOpenChange(false);
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Edit Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter staff name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="staff@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input
              id="edit-phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-role">Role</Label>
            <Input
              id="edit-role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="Stylist, Senior Stylist, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-specialties">Specialties (comma separated)</Label>
            <Input
              id="edit-specialties"
              value={formData.specialties}
              onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
              placeholder="Haircut, Coloring, Styling"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="edit-is_available">Available</Label>
            <Switch
              id="edit-is_available"
              checked={formData.is_available}
              onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteStaffMutation.isPending}
            >
              {deleteStaffMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
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
              disabled={updateStaffMutation.isPending}
            >
              {updateStaffMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

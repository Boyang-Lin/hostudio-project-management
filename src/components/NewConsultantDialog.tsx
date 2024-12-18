import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { ConsultantGroup } from "../data/mockData";

interface NewConsultantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  groups: Record<string, ConsultantGroup>;
}

export function NewConsultantDialog({ open, onOpenChange, onSave, groups }: NewConsultantDialogProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialty: "",
      company: "",
      address: "",
      groups: [] as string[],
    },
  });

  const handleSubmit = (data: any) => {
    onSave(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Consultant</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter specialty" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="groups"
              render={() => (
                <FormItem>
                  <FormLabel>Groups</FormLabel>
                  <div className="space-y-2">
                    {Object.entries(groups).map(([key, group]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          checked={form.watch('groups').includes(key)}
                          onCheckedChange={(checked) => {
                            const currentGroups = form.watch('groups');
                            if (checked) {
                              form.setValue('groups', [...currentGroups, key]);
                            } else {
                              form.setValue('groups', currentGroups.filter(g => g !== key));
                            }
                          }}
                        />
                        <span>{group.title}</span>
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Add Consultant</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
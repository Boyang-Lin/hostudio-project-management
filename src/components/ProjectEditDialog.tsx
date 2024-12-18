import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Project } from "../data/mockData";
import { toast } from "sonner";
import { useEffect } from "react";

interface ProjectEditDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (project: Partial<Project>) => void;
}

export function ProjectEditDialog({
  project,
  open,
  onOpenChange,
  onSave,
}: ProjectEditDialogProps) {
  const form = useForm({
    defaultValues: {
      title: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      constructionCost: 0,
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        clientName: project.clientName,
        clientEmail: project.clientEmail,
        clientPhone: project.clientPhone,
        constructionCost: project.constructionCost,
      });
    }
  }, [project, form]);

  const handleSubmit = (data: Partial<Project>) => {
    onSave(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Create Project"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter client email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client phone number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="constructionCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Construction Cost</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter construction cost" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
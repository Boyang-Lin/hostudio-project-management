import { useState } from "react";
import { projects as initialProjects, consultantGroups as initialConsultantGroups, Project, Consultant } from "../data/mockData";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ProjectsList } from "@/components/ProjectsList";
import { ConsultantsList } from "@/components/ConsultantsList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Index() {
  const [localProjects, setLocalProjects] = useState(initialProjects);
  const [localConsultantGroups, setLocalConsultantGroups] = useState(initialConsultantGroups);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showNewConsultantDialog, setShowNewConsultantDialog] = useState(false);
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const projectForm = useForm({
    defaultValues: {
      title: "",
      dueDate: "",
    },
  });

  const consultantForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialty: "",
      company: "",
    },
  });

  const handleNewProject = (data: any) => {
    const newProject: Project = {
      id: (localProjects.length + 1).toString(),
      title: data.title,
      status: "active",
      dueDate: data.dueDate,
      consultants: [],
    };

    setLocalProjects([...localProjects, newProject]);
    setShowNewProjectDialog(false);
    projectForm.reset();
    toast.success("New project has been created");
  };

  const handleAddConsultant = (data: any) => {
    const newConsultant: Consultant = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      specialty: data.specialty,
      company: data.company,
    };

    const newGroups = { ...localConsultantGroups };
    newGroups.engineers.consultants.push(newConsultant);
    setLocalConsultantGroups(newGroups);
    setShowNewConsultantDialog(false);
    consultantForm.reset();
    toast.success("New consultant has been added");
  };

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      const newGroups = { ...localConsultantGroups };
      newGroups[newGroupName.toLowerCase()] = {
        title: newGroupName,
        consultants: [],
      };
      setLocalConsultantGroups(newGroups);
      toast.success(`Group "${newGroupName}" has been created`);
      setNewGroupName("");
      setShowNewGroupDialog(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <ProjectsList
        projects={localProjects}
        onProjectsChange={setLocalProjects}
        onNewProject={() => setShowNewProjectDialog(true)}
      />

      <ConsultantsList
        consultantGroups={localConsultantGroups}
        onConsultantGroupsChange={setLocalConsultantGroups}
        onNewConsultant={() => setShowNewConsultantDialog(true)}
        onNewGroup={() => setShowNewGroupDialog(true)}
      />

      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <Form {...projectForm}>
            <form onSubmit={projectForm.handleSubmit(handleNewProject)} className="space-y-4 pt-4">
              <FormField
                control={projectForm.control}
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
                control={projectForm.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Create Project</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewConsultantDialog} onOpenChange={setShowNewConsultantDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Consultant</DialogTitle>
          </DialogHeader>
          <Form {...consultantForm}>
            <form onSubmit={consultantForm.handleSubmit(handleAddConsultant)} className="space-y-4 pt-4">
              <FormField
                control={consultantForm.control}
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
                control={consultantForm.control}
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
                control={consultantForm.control}
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
                control={consultantForm.control}
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
                control={consultantForm.control}
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
              <Button type="submit" className="w-full">Add Consultant</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewGroupDialog} onOpenChange={setShowNewGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Enter group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <Button onClick={handleAddGroup} className="w-full">
              Create Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
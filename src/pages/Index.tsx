import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { ConsultantCard } from "@/components/ConsultantCard";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { projects, consultantGroups, Project, Consultant } from "../data/mockData";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

export default function Index() {
  const { toast } = useToast();
  const [localProjects, setLocalProjects] = useState(projects);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showNewConsultantDialog, setShowNewConsultantDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);

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
    toast({
      title: "Success",
      description: "New project has been created.",
    });
  };

  const handleAddConsultant = (data: any) => {
    const newConsultant: Consultant = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      specialty: data.specialty,
      company: data.company,
    };

    // Add to engineers group for demo purposes
    consultantGroups.engineers.consultants.push(newConsultant);
    setShowNewConsultantDialog(false);
    consultantForm.reset();
    toast({
      title: "Success",
      description: "New consultant has been added.",
    });
  };

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      consultantGroups[newGroupName.toLowerCase()] = {
        title: newGroupName,
        consultants: [],
      };
      toast({
        title: "Success",
        description: `Group "${newGroupName}" has been created.`,
      });
      setNewGroupName("");
      setShowNewGroupDialog(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Projects</h1>
          <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Project
              </Button>
            </DialogTrigger>
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localProjects.map((project) => (
            <Link key={project.id} to={`/project/${project.id}`}>
              <ProjectCard {...project} />
            </Link>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Consultants</h2>
          <div className="space-x-2">
            <Dialog open={showNewGroupDialog} onOpenChange={setShowNewGroupDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> New Group
                </Button>
              </DialogTrigger>
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
            <Dialog open={showNewConsultantDialog} onOpenChange={setShowNewConsultantDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Consultant
                </Button>
              </DialogTrigger>
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
          </div>
        </div>
        {Object.entries(consultantGroups).map(([key, group]) => (
          <div key={key} className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{group.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.consultants.map((consultant) => (
                <ConsultantCard 
                  key={consultant.email} 
                  {...consultant}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
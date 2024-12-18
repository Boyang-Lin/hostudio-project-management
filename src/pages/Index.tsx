import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { ConsultantCard } from "@/components/ConsultantCard";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { projects, consultantGroups } from "../data/mockData";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Index() {
  const { toast } = useToast();
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);

  const handleNewProject = () => {
    toast({
      title: "Coming Soon",
      description: "New project creation functionality will be available soon.",
    });
  };

  const handleAddConsultant = () => {
    toast({
      title: "Coming Soon",
      description: "Consultant addition functionality will be available soon.",
    });
  };

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      // In a real application, this would be handled by an API call
      // For now, we'll just show a toast
      toast({
        title: "New Group Created",
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
          <Button onClick={handleNewProject}>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
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
            <Button onClick={handleAddConsultant}>
              <Plus className="mr-2 h-4 w-4" /> Add Consultant
            </Button>
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
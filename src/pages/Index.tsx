import { useState, useEffect } from "react";
import { projects as initialProjects, consultantGroups as initialConsultantGroups, Project } from "../data/mockData";
import { ProjectsList } from "@/components/ProjectsList";
import { ConsultantsList } from "@/components/ConsultantsList";
import { NewProjectDialog } from "@/components/NewProjectDialog";
import { NewConsultantDialog } from "@/components/NewConsultantDialog";
import { NewGroupDialog } from "@/components/NewGroupDialog";

export default function Index() {
  const [localProjects, setLocalProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : initialProjects;
  });

  const [localConsultantGroups, setLocalConsultantGroups] = useState(() => {
    const savedGroups = localStorage.getItem('consultantGroups');
    return savedGroups ? JSON.parse(savedGroups) : initialConsultantGroups;
  });

  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showNewConsultantDialog, setShowNewConsultantDialog] = useState(false);
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(localProjects));
  }, [localProjects]);

  useEffect(() => {
    localStorage.setItem('consultantGroups', JSON.stringify(localConsultantGroups));
  }, [localConsultantGroups]);

  const handleNewProject = (newProject: Omit<Project, 'id'>) => {
    const project: Project = {
      ...newProject,
      id: (localProjects.length + 1).toString(),
      status: "active" as const,
      consultants: []
    };
    setLocalProjects([...localProjects, project]);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <ProjectsList
        projects={localProjects}
        onProjectsChange={setLocalProjects}
        onNewProject={() => setShowNewProjectDialog(true)}
      />

      <ConsultantsList
        consultantGroups={localConsultantGroups || {}}
        onConsultantGroupsChange={setLocalConsultantGroups}
        onNewConsultant={() => setShowNewConsultantDialog(true)}
        onNewGroup={() => setShowNewGroupDialog(true)}
      />

      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
        onSave={handleNewProject}
      />

      <NewConsultantDialog
        open={showNewConsultantDialog}
        onOpenChange={setShowNewConsultantDialog}
        groups={localConsultantGroups}
        onSave={(newConsultant) => {
          const groupKey = newConsultant.group;
          const { group, ...consultantData } = newConsultant;
          const newGroups = { ...localConsultantGroups };
          newGroups[groupKey].consultants.push(consultantData);
          setLocalConsultantGroups(newGroups);
        }}
      />

      <NewGroupDialog
        open={showNewGroupDialog}
        onOpenChange={setShowNewGroupDialog}
        onSave={(groupName) => {
          setLocalConsultantGroups({
            ...localConsultantGroups,
            [groupName.toLowerCase()]: {
              title: groupName,
              consultants: [],
            },
          });
        }}
      />
    </div>
  );
}
import { ProjectsList } from "@/components/ProjectsList";
import { ConsultantsList } from "@/components/ConsultantsList";

export default function Index() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <ProjectsList
        projects={[]}
        onProjectsChange={() => {}}
        onNewProject={() => {}}
      />

      <ConsultantsList
        consultantGroups={{}}
        onConsultantGroupsChange={() => {}}
        onNewConsultant={() => {}}
        onNewGroup={() => {}}
      />
    </div>
  );
}
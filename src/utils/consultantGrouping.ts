import { ProjectConsultant } from "../data/mockData";

export const SPECIALTY_TO_GROUP_MAP: Record<string, string> = {
  "UI/UX Design": "Engineers",
  "Civil Engineer": "Engineers",
  "Urban Planner": "Planners",
  "Landscape Architect": "Landscape Architects"
};

export const groupConsultantsBySpecialty = (consultants: ProjectConsultant[]) => {
  const groups: Record<string, ProjectConsultant[]> = {};
  
  consultants.forEach(consultant => {
    const groupName = SPECIALTY_TO_GROUP_MAP[consultant.specialty] || consultant.specialty;
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(consultant);
  });
  
  return groups;
};
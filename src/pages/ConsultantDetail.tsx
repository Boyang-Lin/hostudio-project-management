import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Briefcase, Mail, Phone, MapPin, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { projects, consultantGroups } from "@/data/mockData";

export default function ConsultantDetail() {
  const { email } = useParams();
  
  // Find consultant in any group
  const consultant = Object.values(consultantGroups)
    .flatMap(group => group.consultants)
    .find(c => c.email === email);

  // Find all projects this consultant is involved in
  const consultantProjects = projects.filter(project => 
    project.consultants.some(c => c.email === email)
  );

  if (!consultant) {
    return <div>Consultant not found</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Link to="/" className="flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Consultants
      </Link>

      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {consultant.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-bold">{consultant.name}</CardTitle>
            <p className="text-gray-600">{consultant.specialty}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{consultant.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{consultant.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-gray-500" />
              <span>{consultant.company}</span>
            </div>
            {consultant.address && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{consultant.address}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center">
          <Briefcase className="mr-2 h-5 w-5" />
          Project Engagements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {consultantProjects.map(project => (
            <Link key={project.id} to={`/project/${project.id}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Quote: ${project.consultants.find(c => c.email === email)?.quote.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    Status: {project.consultants.find(c => c.email === email)?.status || 'Not set'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
          {consultantProjects.length === 0 && (
            <p className="text-gray-600 col-span-full">
              No project engagements found for this consultant.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
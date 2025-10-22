import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, ExternalLink, Calendar } from "lucide-react";
import type { Certification } from "@shared/schema";
import { format } from "date-fns";

export default function Certifications() {
  const { data: certifications, isLoading } = useQuery<Certification[]>({
    queryKey: ["/api/certifications"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading certifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Free Certifications</h1>
        <p className="text-muted-foreground mt-2">
          Discover free certification opportunities to boost your career
        </p>
      </div>

      {certifications && certifications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <Card key={cert.id} className="flex flex-col" data-testid={`cert-card-${cert.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary">Free</Badge>
                </div>
                <CardTitle className="text-xl">{cert.title}</CardTitle>
                <CardDescription>{cert.provider}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Added {format(new Date(cert.dateAdded), "MMM d, yyyy")}</span>
                </div>
                <Button
                  asChild
                  className="w-full"
                  data-testid={`button-view-cert-${cert.id}`}
                >
                  <a href={cert.link} target="_blank" rel="noopener noreferrer">
                    View Certification
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No certifications available yet</p>
            <p className="text-sm text-muted-foreground">
              Check back soon for new certification opportunities
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

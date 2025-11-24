"use client";

import { NavBar } from "@/components/ui/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function JobsPage() {
  const jobs = [
    { title: "Frontend Engineer", location: "Remote", type: "Full-time" },
    { title: "Backend Engineer", location: "Hyderabad", type: "Contract" },
    { title: "DevOps Engineer", location: "Bangalore", type: "Full-time" },
  ];

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <NavBar />
      <main className="container py-10">
        <h1 className="mb-6 text-2xl font-semibold">Open Positions</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((job) => (
            <Card key={job.title}>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 text-sm">
                  <span>{job.location}</span>
                  <Badge variant="outline">{job.type}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
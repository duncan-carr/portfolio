type Dates = { startDate: string; endDate: string };
export type Portfolio = {
  importedAt: string;
  profile: {
    firstName: string;
    lastName: string;
    headline: string;
    summary: string;
    location: string;
    industry: string;
  };
  positions: (Dates & {
    company: string;
    title: string;
    description: string;
    location: string;
    hideFromMain?: boolean;
  })[];
  education: (Dates & {
    school: string;
    degree: string;
    notes: string;
    activities: string;
  })[];
  certifications: (Dates & { name: string; authority: string; url: string })[];
  skills: string[];
  organizations: (Dates & {
    name: string;
    role: string;
    description: string;
  })[];
  exams: { name: string; description: string; startDate: string }[];
  projects: (Dates & { name: string; description: string; url: string })[];
  honors: { name: string; issuer: string; description: string; date: string }[];
  languages: { name: string; proficiency: string }[];
  volunteering: (Dates & {
    organization: string;
    role: string;
    description: string;
  })[];
};

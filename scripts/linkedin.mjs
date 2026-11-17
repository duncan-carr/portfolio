import { parse } from "csv-parse/sync";
import { parsePortfolioDate } from "../src/lib/dates.mjs";

// Explicit allowlist: raw exports must never be copied into the application.
export const sources = {
  profile: "Profile.csv",
  summary: "Profile Summary.csv",
  positions: "Positions.csv",
  education: "Education.csv",
  certifications: "Certifications.csv",
  skills: "Skills.csv",
  organizations: "Organizations.csv",
  exams: "TestScores.csv",
  projects: "Projects.csv",
  honors: "Honors.csv",
  languages: "Languages.csv",
  volunteering: "Volunteering.csv",
};

export function parseCsv(contents) {
  return parse(contents, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
    trim: true,
  });
}
const clean = (value) => (typeof value === "string" ? value.trim() : "");
const pick = (row, ...keys) =>
  keys.map((key) => clean(row[key])).find(Boolean) || "";
export function safeUrl(value) {
  const input = clean(value);
  if (!input) return "";
  try {
    const url = new URL(
      /^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`,
    );
    return ["http:", "https:"].includes(url.protocol) &&
      url.hostname &&
      !url.username &&
      !url.password
      ? url.href
      : "";
  } catch {
    return "";
  }
}
function dateValue(value) {
  return parsePortfolioDate(value)?.start ?? 0;
}
const recentFirst = (items) =>
  items.sort((a, b) => dateValue(b.startDate) - dateValue(a.startDate));
const dates = (row) => ({
  startDate: pick(row, "Started On", "Start Date"),
  endDate: pick(row, "Finished On", "End Date"),
});

export function normalizeExport(tables, importedAt = new Date().toISOString()) {
  const raw = tables.profile?.[0];
  if (!raw || (!clean(raw["First Name"]) && !clean(raw["Last Name"])))
    throw new Error(
      "Profile.csv must contain a profile with a first or last name.",
    );
  return {
    importedAt,
    profile: {
      firstName: clean(raw["First Name"]),
      lastName: clean(raw["Last Name"]),
      headline: clean(raw.Headline),
      summary:
        clean(raw.Summary) ||
        pick(tables.summary?.[0] || {}, "Profile Summary", "Summary"),
      location: clean(raw["Geo Location"]),
      industry: clean(raw.Industry),
    },
    positions: recentFirst(
      (tables.positions || [])
        .map((row) => ({
          company: clean(row["Company Name"]),
          title: clean(row.Title),
          description: clean(row.Description),
          location: clean(row.Location),
          ...(["true", "yes", "1"].includes(clean(row["Hide From Main"]).toLowerCase())
            ? { hideFromMain: true }
            : {}),
          ...dates(row),
        }))
        .filter((row) => row.company || row.title),
    ),
    education: recentFirst(
      (tables.education || [])
        .map((row) => ({
          school: clean(row["School Name"]),
          degree: clean(row["Degree Name"]),
          notes: clean(row.Notes),
          activities: clean(row.Activities),
          ...dates(row),
        }))
        .filter((row) => row.school),
    ),
    certifications: recentFirst(
      (tables.certifications || [])
        .map((row) => ({
          name: clean(row.Name),
          authority: clean(row.Authority),
          url: safeUrl(row.Url),
          ...dates(row),
        }))
        .filter((row) => row.name),
    ),
    skills: [
      ...new Set(
        (tables.skills || []).map((row) => clean(row.Name)).filter(Boolean),
      ),
    ],
    organizations: recentFirst(
      (tables.organizations || [])
        .map((row) => ({
          name: clean(row.Name),
          role: clean(row.Position),
          description: clean(row.Description),
          ...dates(row),
        }))
        .filter((row) => row.name),
    ),
    exams: recentFirst(
      (tables.exams || [])
        .map((row) => ({
          name: clean(row.Name),
          description: clean(row.Description),
          startDate: clean(row["Tested On"]),
        }))
        .filter((row) => row.name),
    ),
    projects: (tables.projects || [])
      .map((row) => ({
        name: pick(row, "Title", "Name"),
        description: clean(row.Description),
        url: safeUrl(pick(row, "Url", "URL")),
        ...dates(row),
      }))
      .filter((row) => row.name),
    honors: (tables.honors || [])
      .map((row) => ({
        name: pick(row, "Title", "Name"),
        issuer: pick(row, "Issuer", "Issuing Organization"),
        description: clean(row.Description),
        date: pick(row, "Issued On", "Date"),
      }))
      .filter((row) => row.name),
    languages: (tables.languages || [])
      .map((row) => ({
        name: clean(row.Name),
        proficiency: clean(row.Proficiency),
      }))
      .filter((row) => row.name),
    volunteering: recentFirst(
      (tables.volunteering || [])
        .map((row) => ({
          organization: pick(row, "Organization", "Company Name"),
          role: pick(row, "Role", "Position"),
          description: clean(row.Description),
          ...dates(row),
        }))
        .filter((row) => row.organization),
    ),
  };
}

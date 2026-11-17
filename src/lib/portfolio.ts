import imported from "@/data/linkedin.json";

import type { Portfolio } from "./types";

export const portfolio: Portfolio = imported;
// Re-importing never overwrites editorial copy or optional links.
export const site = {
  // Leave empty to derive the introduction from the position active today.
  introduction: "",
  description:
    "From property and casualty insurance to software prototypes, I bring an analytical mindset and a people-first approach to the work I do.",
  email: "",
  linkedin: "https://www.linkedin.com/in/duncan-carr-277468263/",
  github: "https://github.com/duncan-carr",
};
export function dateRange(start: string, end: string, ongoing = true) {
  return [start, end || (ongoing ? "Present" : "")].filter(Boolean).join(" — ");
}
export function descriptionParts(description: string) {
  return description
    .split(/(?:\r?\n\s*[-•]\s*|\s+-\s+)/)
    .map((part) => part.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}
export function skillLabel(skill: string) {
  return skill.replace(/ \((?:Programming Language|Software)\)$/, "");
}

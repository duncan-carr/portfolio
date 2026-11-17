import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { safeUrl } from "../../scripts/linkedin.mjs";
import type { Portfolio } from "./types";

export type Project = Portfolio["projects"][number] & {
  slug?: string;
  content?: string;
};

const projectDirectory = path.join(process.cwd(), "content/projects");

export async function getMarkdownProjects(): Promise<Project[]> {
  "use cache";
  let files: string[];
  try {
    files = await readdir(projectDirectory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  return Promise.all(
    files.filter((file) => file.endsWith(".md")).sort().map(async (file) => {
      const slug = file.slice(0, -3);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new Error(`${file}: use lowercase words separated by hyphens.`);
      }
      const { data, content } = matter(
        await readFile(path.join(projectDirectory, file), "utf8"),
      );
      for (const field of ["name", "description"]) {
        if (typeof data[field] !== "string" || !data[field].trim()) {
          throw new Error(`${file}: front matter requires a ${field} string.`);
        }
      }
      for (const field of ["startDate", "endDate", "url"]) {
        if (data[field] !== undefined && typeof data[field] !== "string") {
          throw new Error(`${file}: ${field} must be a quoted string.`);
        }
      }
      if (!content.trim()) throw new Error(`${file}: add Markdown page content.`);
      const url = safeUrl(data.url ?? "");
      if (data.url && !url) throw new Error(`${file}: url must use HTTP or HTTPS.`);
      return {
        slug,
        name: data.name.trim(),
        description: data.description.trim(),
        startDate: data.startDate ?? "",
        endDate: data.endDate ?? "",
        url,
        content,
      };
    }),
  );
}

export async function getProjects(imported: Portfolio["projects"]): Promise<Project[]> {
  const markdown = await getMarkdownProjects();
  const names = new Set(markdown.map((project) => project.name.toLowerCase()));
  return [
    ...markdown,
    ...imported.filter((project) => !names.has(project.name.trim().toLowerCase())),
  ];
}

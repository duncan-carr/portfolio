import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Arrow } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { dateRange, portfolio } from "@/lib/portfolio";
import { getMarkdownProjects } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

async function getProject(params: Props["params"]) {
  const { slug } = await params;
  const project = (await getMarkdownProjects()).find((entry) => entry.slug === slug);
  if (!project) notFound();
  return project;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params);
  const title = `${project.name} — ${portfolio.profile.firstName} ${portfolio.profile.lastName}`;
  return {
    title,
    description: project.description,
    openGraph: { title, description: project.description, type: "article" },
  };
}

export default function ProjectPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <main className="container section" aria-busy="true">
          Loading project…
        </main>
      }
    >
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: Props) {
  const project = await getProject(params);
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <SiteHeader />
      <main id="main" className="container project-page">
        <article>
          <header className="project-heading">
            {(project.startDate || project.endDate) && (
              <p className="entry-date">{dateRange(project.startDate, project.endDate, false)}</p>
            )}
            <h1>{project.name}</h1>
            <p className="hero-description">{project.description}</p>
            {project.url && (
              <a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">
                Explore project <Arrow diagonal />
              </a>
            )}
          </header>
          <div className="project-content">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                a({ href, title, children }) {
                  const external = /^(?:https?:)?\/\//i.test(href ?? "");
                  return (
                    <a
                      href={href}
                      title={title}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                    >
                      {children}
                    </a>
                  );
                },
              }}
            >
              {project.content}
            </Markdown>
          </div>
        </article>
      </main>
      <footer className="site-footer container">
        <Link href="/#projects">Back to projects</Link>
      </footer>
    </>
  );
}

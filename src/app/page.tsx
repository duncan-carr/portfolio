import { Arrow } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { portfolioToday, positionTimeline } from "@/lib/dates.mjs";
import { groupExperience } from "@/lib/experience.mjs";
import { getProjects, type Project } from "@/lib/projects";
import {
  dateRange,
  descriptionParts,
  portfolio,
  site,
  skillLabel,
} from "@/lib/portfolio";

function Description({ text }: { text: string }) {
  const parts = descriptionParts(text);
  if (!parts.length) return null;
  if (parts.length === 1) return <p className="body-copy">{parts[0]}</p>;
  return (
    <ul className="description-list">
      {parts.map((part, index) => (
        <li key={index}>{part}</li>
      ))}
    </ul>
  );
}

function Position({
  position,
}: {
  position: (typeof portfolio.positions)[number] & {
    upcoming: boolean;
    dateLabel: string;
  };
}) {
  return (
    <article className="position">
      <div className="position-date">
        {position.dateLabel}
        {position.location && <span>{position.location}</span>}
      </div>
      <div>
        <h3>{position.title}</h3>
        {position.upcoming && <p className="eyebrow">Upcoming</p>}
        <p className="company">{position.company}</p>
        <Description text={position.description} />
      </div>
    </article>
  );
}

export default async function Home() {
  const projects = await getProjects(portfolio.projects);
  return (
    <Suspense
      fallback={
        <main className="container section" aria-busy="true">
          Loading portfolio…
        </main>
      }
    >
      <HomeContent projects={projects} />
    </Suspense>
  );
}

async function HomeContent({ projects }: { projects: Project[] }) {
  await connection();
  const {
    profile,
    education,
    certifications,
    skills,
    organizations,
    exams,
    honors,
    languages,
    volunteering,
  } = portfolio;
  const positions = positionTimeline(portfolio.positions, portfolioToday());
  const name = `${profile.firstName} ${profile.lastName}`.trim();
  const current = positions.find((position) => position.current);
  const latest = positions.find((position) => !position.upcoming);
  const introduction = current
    ? `${current.title} @ ${current.company}`
    : latest
      ? `Previously ${latest.title} @ ${latest.company}`
      : profile.headline;
  const { featured, other } = groupExperience(positions);
  const links = [
    { label: "LinkedIn", url: site.linkedin },
    { label: "GitHub", url: site.github },
  ].filter((link) => link.url);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader home showProjects={projects.length > 0} />
      <main id="main" className="container">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-main">
            <p className="eyebrow">
              {profile.industry || "Portfolio"} & technology
            </p>
            <h1 id="hero-heading">{name}</h1>
            <p className="hero-statement">
              {site.introduction || introduction}
            </p>
            <p className="hero-description">
              {profile.summary || site.description}
            </p>
            <a className="hero-link" href="#experience">
              View experience <Arrow />
            </a>
          </div>
          <aside
            className="profile-note"
            aria-label="Current role and location"
          >
            <p className="eyebrow">{current ? "Currently" : "Latest experience"}</p>
            <h2>{current?.title || latest?.title || "Experience"}</h2>
            {current && <p className="profile-company">{current.company}</p>}
            {profile.location && (
              <p className="location">
                {profile.location.replace(", United States", "")}
              </p>
            )}
          </aside>
        </section>
        {skills.length > 0 && (
          <section className="skills-section" aria-labelledby="skills-heading">
            <h2 id="skills-heading" className="eyebrow">
              Skills
            </h2>
            <ul className="skills">
              {skills.map((skill) => (
                <li className="skill" key={skill}>
                  {skillLabel(skill)}
                </li>
              ))}
            </ul>
          </section>
        )}
        {positions.length > 0 && (
          <section
            id="experience"
            className="section"
            aria-labelledby="experience-heading"
          >
            <div className="section-heading">
              <div>
                <h2 id="experience-heading">Experience</h2>
              </div>
            </div>
            <div className="positions">
              {featured.map((position, index) => (
                <Position position={position} key={index} />
              ))}
            </div>
            {other.length > 0 && (
              <details className="other-experiences">
                <summary>
                  Other Experiences ({other.length})
                  <span className="expand-icon" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="positions">
                  {other.map((position, index) => (
                    <Position position={position} key={index} />
                  ))}
                </div>
              </details>
            )}
          </section>
        )}
        {(exams.length > 0 || certifications.length > 0) && (
          <section
            id="credentials"
            className="section"
            aria-labelledby="credentials-heading"
          >
            <div className="section-heading">
              <div>
                <h2 id="credentials-heading">Credentials</h2>
              </div>
            </div>
            <div className="credentials">
              {exams.map((exam, index) => (
                <article className="credential" key={`exam-${index}`}>
                  <p className="entry-date">{exam.startDate}</p>
                  <div>
                    <h3>{exam.name}</h3>
                    <p className="credential-type">Actuarial exam</p>
                    {exam.description && (
                      <p className="body-copy">{exam.description}</p>
                    )}
                  </div>
                </article>
              ))}
              {certifications.map((certification, index) => (
                <article className="credential" key={`cert-${index}`}>
                  <p className="entry-date">
                    {dateRange(
                      certification.startDate,
                      certification.endDate,
                      false,
                    )}
                  </p>
                  <div>
                    <h3>{certification.name}</h3>
                    <p className="credential-type">
                      {certification.authority} · Certification
                    </p>
                  </div>
                  {certification.url && (
                    <a
                      className="text-link"
                      href={certification.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View credential <Arrow diagonal />
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
        <section
          id="education"
          className="section"
          aria-labelledby="education-heading"
        >
          <div className="section-heading">
            <div>
              <h2 id="education-heading">Education & community</h2>
            </div>
          </div>
          <div className="about-grid">
            {education.length > 0 && (
              <div>
                <h3 className="subsection-title">Education</h3>
                {education.map((entry, index) => (
                  <article className="education-entry" key={index}>
                    <p className="entry-date">
                      {dateRange(entry.startDate, entry.endDate, false)}
                    </p>
                    <h4>{entry.school}</h4>
                    {entry.degree && <p>{entry.degree}</p>}
                    {entry.notes && <p className="body-copy">{entry.notes}</p>}
                    {entry.activities && (
                      <p className="body-copy">{entry.activities}</p>
                    )}
                  </article>
                ))}
              </div>
            )}
            {organizations.length > 0 && (
              <div>
                <h3 className="subsection-title">Community & leadership</h3>
                {organizations.map((entry, index) => (
                  <article className="organization-entry" key={index}>
                    <p className="entry-date">
                      {dateRange(entry.startDate, entry.endDate)}
                    </p>
                    <h4>{entry.role || entry.name}</h4>
                    {entry.role && <p className="company">{entry.name}</p>}
                    <Description text={entry.description} />
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
        {projects.length > 0 && (
          <section
            id="projects"
            className="section"
            aria-labelledby="projects-heading"
          >
            <p className="eyebrow section-kicker">Selected work</p>
            <h2 id="projects-heading">Projects</h2>
            <div className="extra-grid">
              {projects.map((entry, index) => (
                <article key={index}>
                  <h3>{entry.name}</h3>
                  <Description text={entry.description} />
                  {entry.slug && (
                    <Link className="text-link" href={`/projects/${entry.slug}`}>
                      Read about the project <Arrow />
                    </Link>
                  )}
                  {entry.url && (
                    <a
                      className="text-link"
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Explore project <Arrow diagonal />
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
        {honors.length > 0 && (
          <section className="section" aria-labelledby="honors-heading">
            <h2 id="honors-heading">Honors & recognition</h2>
            <div className="extra-grid">
              {honors.map((entry, index) => (
                <article key={index}>
                  <p className="entry-date">{entry.date}</p>
                  <h3>{entry.name}</h3>
                  <p>{entry.issuer}</p>
                  <Description text={entry.description} />
                </article>
              ))}
            </div>
          </section>
        )}
        {volunteering.length > 0 && (
          <section className="section" aria-labelledby="volunteering-heading">
            <h2 id="volunteering-heading">Giving back</h2>
            <div className="extra-grid">
              {volunteering.map((entry, index) => (
                <article key={index}>
                  <p className="entry-date">
                    {dateRange(entry.startDate, entry.endDate)}
                  </p>
                  <h3>{entry.role || entry.organization}</h3>
                  <p>{entry.organization}</p>
                  <Description text={entry.description} />
                </article>
              ))}
            </div>
          </section>
        )}
        {languages.length > 0 && (
          <section className="section" aria-labelledby="languages-heading">
            <h2 id="languages-heading">Languages</h2>
            <div className="skills">
              {languages.map((entry, index) => (
                <span className="skill" key={index}>
                  {entry.name}
                  {entry.proficiency && ` · ${entry.proficiency}`}
                </span>
              ))}
            </div>
          </section>
        )}
        {(site.email || links.length > 0) && (
          <section className="contact" aria-labelledby="contact-heading">
            <h2 id="contact-heading">Get in touch</h2>
            {site.email && (
              <a className="text-link" href={`mailto:${site.email}`}>
                {site.email} <Arrow diagonal />
              </a>
            )}
            {links.length > 0 && (
              <div className="social-links">
                {links.map((link) => (
                  <a
                    className="text-link"
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label} <Arrow diagonal />
                  </a>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
      <footer className="site-footer container">
        <span>
          © {new Date(portfolio.importedAt).getUTCFullYear()} {name}
        </span>
        <a href="#">Back to top ↑</a>
      </footer>
    </>
  );
}

import Link from "next/link";
import { Arrow } from "./icons";
import { SiteNavigation } from "./site-navigation";
import { portfolio, site } from "@/lib/portfolio";

export function SiteHeader({
  home = false,
  showProjects = true,
}: {
  home?: boolean;
  showProjects?: boolean;
}) {
  const name = `${portfolio.profile.firstName} ${portfolio.profile.lastName}`.trim();

  return (
    <header className="site-header container">
      <Link className="wordmark" href={home ? "#" : "/"} aria-label={`${name}, home`}>
        {name}
      </Link>
      <SiteNavigation home={home} showProjects={showProjects} />
      {site.email ? (
        <a className="header-link" href={`mailto:${site.email}`}>
          Say hello <Arrow diagonal />
        </a>
      ) : (
        <span className="header-location">
          {portfolio.profile.location.split(",").slice(0, 2).join(",")}
        </span>
      )}
    </header>
  );
}

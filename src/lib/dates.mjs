export const portfolioTimeZone = "America/Chicago";

const months = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

/** Parse an ISO day/month, English month and year, or year into inclusive bounds. */
export function parsePortfolioDate(value) {
  const input = value.trim().replace(/^starting\s*:\s*/i, "");
  const iso = input.match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/);
  const named = input.match(/^([a-z]+)\s+(\d{4})$/i);
  if (!iso && !named) return null;
  const year = Number(iso?.[1] ?? named?.[2]);
  const month = named
    ? months.indexOf(named[1].slice(0, 3).toLowerCase())
    : Number(iso?.[2] ?? 1) - 1;
  const day = Number(iso?.[3] ?? 1);
  if (year < 1000 || month < 0 || month > 11) return null;
  const start = Date.UTC(year, month, day);
  if (new Date(start).getUTCMonth() !== month || day < 1) return null;
  const yearOnly = Boolean(iso && !iso[2]);
  const end = iso?.[3]
    ? start
    : Date.UTC(year, yearOnly ? 12 : month + 1, 0);
  const label = yearOnly
    ? String(year)
    : new Intl.DateTimeFormat("en-US", {
        timeZone: "UTC",
        month: "short",
        ...(iso?.[3] ? { day: "numeric" } : {}),
        year: "numeric",
      }).format(new Date(start));
  return { start, end, label };
}

export function portfolioToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: portfolioTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

/** @template {{ startDate: string, endDate: string }} T
 * @param {T[]} positions
 * @param {string} today An ISO calendar day in the portfolio time zone.
 */
export function positionTimeline(positions, today) {
  const currentDay = parsePortfolioDate(today);
  if (!currentDay) throw new Error("Expected a valid portfolio date.");
  return [...positions]
    .sort((a, b) =>
      (parsePortfolioDate(b.startDate)?.start ?? 0) -
      (parsePortfolioDate(a.startDate)?.start ?? 0),
    )
    .map((position) => {
      const start = parsePortfolioDate(position.startDate);
      const end = parsePortfolioDate(position.endDate);
      const upcoming = Boolean(start && start.start > currentDay.start);
      const current = Boolean(
        start && !upcoming &&
        (!position.endDate || /^(present|current)$/i.test(position.endDate) ||
          (end && end.end >= currentDay.start)),
      );
      const startLabel = start?.label ?? position.startDate;
      const endLabel = current ? "Present" : end?.label ?? position.endDate;
      return {
        ...position,
        upcoming,
        current,
        dateLabel: upcoming
          ? `Starts ${startLabel}`
          : [startLabel, endLabel].filter(Boolean).join(" — "),
      };
    });
}

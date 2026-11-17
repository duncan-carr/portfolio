import test from "node:test";
import assert from "node:assert/strict";
import { parsePortfolioDate, portfolioToday, positionTimeline } from "../src/lib/dates.mjs";

const positions = [
  { title: "Actuarial Analyst", startDate: "Starting: Jan 2027", endDate: "" },
  { title: "Actuarial Intern", startDate: "May 2025", endDate: "Dec 2026" },
];

test("keeps the internship current until the future analyst role begins", () => {
  const before = positionTimeline(positions, "2026-12-31");
  assert.equal(before.find((position) => position.current)?.title, "Actuarial Intern");
  const analyst = before.find((position) => position.title === "Actuarial Analyst");
  assert.equal(analyst.upcoming, true);
  assert.equal(analyst.dateLabel, "Starts Jan 2027");
  const after = positionTimeline(positions, "2027-01-01");
  assert.equal(after.find((position) => position.current)?.title, "Actuarial Analyst");
  assert.equal(after.find((position) => position.title === "Actuarial Intern").dateLabel, "May 2025 — Dec 2026");
  assert.equal(after[0].upcoming, false);
  assert.equal(positions[0].startDate, "Starting: Jan 2027");
});

test("uses Chicago calendar dates across midnight and daylight saving time", () => {
  assert.equal(portfolioToday(new Date("2027-01-01T05:59:59Z")), "2026-12-31");
  assert.equal(portfolioToday(new Date("2027-01-01T06:00:00Z")), "2027-01-01");
  assert.equal(portfolioToday(new Date("2027-07-01T04:59:59Z")), "2027-06-30");
  assert.equal(portfolioToday(new Date("2027-07-01T05:00:00Z")), "2027-07-01");
});

test("respects exact days, inclusive month ends, gaps, and unknown dates", () => {
  const roles = [
    { title: "Next", startDate: "2027-03-15", endDate: "" },
    { title: "Previous", startDate: "2026-01", endDate: "Feb 2027" },
    { title: "Unknown", startDate: "TBD", endDate: "" },
  ];
  assert.equal(positionTimeline(roles, "2027-02-28").find((role) => role.current)?.title, "Previous");
  assert.equal(positionTimeline(roles, "2027-03-01").some((role) => role.current), false);
  assert.equal(positionTimeline(roles, "2027-03-14")[0].upcoming, true);
  assert.equal(positionTimeline(roles, "2027-03-15")[0].current, true);
  assert.equal(parsePortfolioDate("2027-02-29"), null);
  assert.equal(parsePortfolioDate("2027-13"), null);
  assert.equal(parsePortfolioDate("2028-02").end, Date.UTC(2028, 1, 29));
});

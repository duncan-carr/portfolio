import test from "node:test";
import assert from "node:assert/strict";
import { normalizeExport, parseCsv, safeUrl } from "./linkedin.mjs";
const profile = [
  {
    "First Name": "Duncan",
    "Last Name": "Carr",
    "Birth Date": "private birthday",
    Address: "private address",
    "Zip Code": "private postcode",
  },
];
test("handles CSV BOM, quoted commas, multiline descriptions, and escaped quotes", () => {
  const rows = parseCsv(
    '\uFEFFName,Description\r\n"Carr, Duncan","Line one\nLine two with ""quotes"""\r\n',
  );
  assert.deepEqual(rows, [
    { Name: "Carr, Duncan", Description: 'Line one\nLine two with "quotes"' },
  ]);
});
test("omits private profile data, account data, and raw exam scores", () => {
  const result = normalizeExport({
    profile,
    messages: [{ body: "private message" }],
    exams: [
      { Name: "SOA Exam P", Score: "private score", "Tested On": "Jul 2024" },
    ],
  });
  assert.equal(result.profile.firstName, "Duncan");
  assert.doesNotMatch(JSON.stringify(result), /private/);
  assert.equal(result.exams[0].name, "SOA Exam P");
});
test("sorts work newest first, deduplicates skills, and tolerates missing optional files", () => {
  const result = normalizeExport({
    profile,
    positions: [
      { Title: "Old", "Started On": "Jan 2024" },
      { Title: "New", "Started On": "May 2025" },
    ],
    skills: [{ Name: "Python" }, { Name: "Python" }, { Name: "" }],
  });
  assert.deepEqual(
    result.positions.map((p) => p.title),
    ["New", "Old"],
  );
  assert.deepEqual(result.skills, ["Python"]);
  assert.deepEqual(result.certifications, []);
});
test("requires a named profile before replacing a snapshot", () => {
  assert.throws(() => normalizeExport({}), /Profile.csv/);
  assert.throws(() => normalizeExport({ profile: [{}] }), /Profile.csv/);
});
test("imports optional experience visibility without changing older exports", () => {
  const result = normalizeExport({
    profile,
    positions: [
      { Title: "Hidden", "Hide From Main": " TRUE " },
      { Title: "Also hidden", "Hide From Main": "yes" },
      { Title: "Visible", "Hide From Main": "false" },
      { Title: "Legacy" },
    ],
  });
  assert.equal(result.positions[0].hideFromMain, true);
  assert.equal(result.positions[1].hideFromMain, true);
  assert.equal(result.positions[2].hideFromMain, undefined);
  assert.equal(result.positions[3].hideFromMain, undefined);
});
test("sorts future positions with prefixed and ISO dates without losing their dates", () => {
  const result = normalizeExport({
    profile,
    positions: [
      { Title: "Intern", "Started On": "May 2025", "Finished On": "Dec 2026" },
      { Title: "Later", "Started On": "Starting: Sep 2027" },
      { Title: "Analyst", "Started On": "2027-01-15" },
    ],
  });
  assert.deepEqual(result.positions.map((position) => position.title), ["Later", "Analyst", "Intern"]);
  assert.equal(result.positions[0].startDate, "Starting: Sep 2027");
});
test("normalizes certification URLs and rejects unsafe protocols", () => {
  assert.equal(safeUrl("ude.my/credential"), "https://ude.my/credential");
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "file:///etc/passwd",
    "https://user:password@example.com",
    "",
  ])
    assert.equal(safeUrl(url), "");
});

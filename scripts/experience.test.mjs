import test from "node:test";
import assert from "node:assert/strict";
import { groupExperience } from "../src/lib/experience.mjs";

test("shows three unhidden jobs even when hidden jobs appear first", () => {
  const positions = [
    { title: "Hidden recent job", hideFromMain: true },
    { title: "First visible job" },
    { title: "Hidden middle job", hideFromMain: true },
    { title: "Second visible job", hideFromMain: false },
    { title: "Third visible job" },
    { title: "Fourth visible job" },
  ];
  const { featured, other } = groupExperience(positions);
  assert.deepEqual(featured.map((job) => job.title), [
    "First visible job", "Second visible job", "Third visible job",
  ]);
  assert.deepEqual(other.map((job) => job.title), [
    "Hidden recent job", "Hidden middle job", "Fourth visible job",
  ]);
  assert.equal(featured.length + other.length, positions.length);
});

test("handles empty data, fewer than three visible jobs, and all hidden jobs", () => {
  assert.deepEqual(groupExperience([]), { featured: [], other: [] });
  const visible = [{ title: "One" }, { title: "Two" }];
  assert.deepEqual(groupExperience(visible), { featured: visible, other: [] });
  const hidden = [{ title: "One", hideFromMain: true }];
  assert.deepEqual(groupExperience(hidden), { featured: [], other: hidden });
});

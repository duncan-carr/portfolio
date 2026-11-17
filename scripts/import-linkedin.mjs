import { readFile, writeFile, rename, mkdir, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeExport, parseCsv, sources } from "./linkedin.mjs";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const defaultPath = resolve(
  homedir(),
  "Downloads/LinkedIn_Data_Export_11_1_2026",
);
const argument =
  process.argv[2] || process.env.LINKEDIN_EXPORT_DIR || defaultPath;
let source = resolve(argument.replace(/^~(?=\/|$)/, homedir()));
try {
  // The initial export is an extracted directory with a .zip suffix.
  if (
    !(await stat(source).catch(() => null)) &&
    !process.argv[2] &&
    !process.env.LINKEDIN_EXPORT_DIR
  )
    source += ".zip";
  if (!(await stat(source)).isDirectory())
    throw new Error(
      "The source must be an extracted folder, not a ZIP archive. Unzip it first.",
    );
  const tables = {};
  const found = [];
  for (const [key, filename] of Object.entries(sources)) {
    try {
      tables[key] = parseCsv(await readFile(resolve(source, filename), "utf8"));
      found.push(filename);
    } catch (error) {
      if (error.code === "ENOENT" && key !== "profile") continue;
      throw new Error(`${filename}: ${error.message}`, { cause: error });
    }
  }
  const data = normalizeExport(tables);
  const output = resolve(projectRoot, "src/data/linkedin.json");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(`${output}.tmp`, `${JSON.stringify(data, null, 2)}\n`);
  await rename(`${output}.tmp`, output);
  console.log(
    `Imported ${data.profile.firstName} ${data.profile.lastName} from ${found.length} professional profile files.`,
  );
  console.log(
    `${data.positions.length} positions · ${data.education.length} education entries · ${data.certifications.length} certifications · ${data.skills.length} skills · ${data.exams.length} exams`,
  );
  console.log(
    "Updated src/data/linkedin.json. Raw exports and private account fields were not copied.",
  );
} catch (error) {
  console.error(`LinkedIn import failed: ${error.message}`);
  console.error(
    'Usage: npm run import:linkedin -- "/path/to/extracted/export"',
  );
  process.exitCode = 1;
}

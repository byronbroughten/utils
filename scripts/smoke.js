// @ts-check
// JS so Node runs it bare, as utils has no tsx: pack utils, install the tarball into a temp project, import it from Node and check its types with tsc.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { fileURLToPath, URL } from "node:url";

const utilsDir = fileURLToPath(new URL("..", import.meta.url));
const tscPath = createRequire(import.meta.url).resolve("typescript/bin/tsc");

const consumerFiles = {
  "package.json": JSON.stringify({
    name: "utils-smoke",
    private: true,
    type: "module",
  }),
  "runtime.js": `import { SerialDate } from "@byronbroughten/utils/serial-date";
const serial = SerialDate.fromYmd({ year: 1900, month: 1, day: 1 });
if (serial !== 2) {
  throw new Error(\`expected serial 2 for 1900-01-01, got \${serial}\`);
}
`,
  "types.ts": `import { SerialDate } from "@byronbroughten/utils/serial-date";
function takesSerial(serial: SerialDate): SerialDate {
  return serial;
}
takesSerial(SerialDate.fromYmd({ year: 2024, month: 1, day: 1 }));
// @ts-expect-error a raw number is not a SerialDate
takesSerial(45000);
`,
  "tsconfig.json": JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      module: "nodenext",
      strict: true,
      noEmit: true,
      types: [],
    },
    files: ["types.ts"],
  }),
};

const scratchDir = mkdtempSync(join(tmpdir(), "utils-smoke-"));
try {
  const [{ filename }] = JSON.parse(
    run("npm", ["pack", "--json", "--pack-destination", scratchDir], utilsDir),
  );
  Object.entries(consumerFiles).forEach(([name, content]) =>
    writeFileSync(join(scratchDir, name), content),
  );
  run(
    "npm",
    [
      "install",
      "--no-audit",
      "--no-fund",
      "--no-package-lock",
      join(scratchDir, filename),
    ],
    scratchDir,
  );
  run(process.execPath, ["runtime.js"], scratchDir);
  process.stdout.write(
    "runtime: Node imports @byronbroughten/utils/serial-date and SerialDate.fromYmd works\n",
  );
  run(process.execPath, [tscPath, "-p", "."], scratchDir);
  process.stdout.write(
    "types: tsc resolves the packed types and rejects a raw number as a SerialDate\n",
  );
} finally {
  rmSync(scratchDir, { recursive: true, force: true });
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {string} cwd
 */
function run(command, args, cwd) {
  return execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
}

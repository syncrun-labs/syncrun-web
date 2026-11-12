import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { checkCommit } from "./commit-rules.mjs";

const message = readFileSync(process.argv[2], "utf8");
const stagedFiles = execFileSync("git", ["diff", "--cached", "--name-only", "--no-renames", "-z"], {
  encoding: "utf8",
}).split("\0");
const errors = checkCommit(message, stagedFiles);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
}

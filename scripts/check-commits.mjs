import { execFileSync } from "node:child_process";
import { checkCommit } from "./commit-rules.mjs";

const base = process.argv[2];
if (!base) {
  console.error("기준 커밋을 지정해 주세요. node scripts/check-commits.mjs <base>");
  process.exit(1);
}

const git = (...args) => execFileSync("git", args, { encoding: "utf8" });
const commits = git("log", "--no-merges", "--format=%H", `${base}..HEAD`, "--").trim().split("\n").filter(Boolean);

for (const commit of commits) {
  const message = git("show", "-s", "--format=%B", commit);
  const changedFiles = git(
    "diff-tree",
    "--root",
    "--no-commit-id",
    "-r",
    "--name-only",
    "--no-renames",
    "-z",
    commit,
  ).split("\0");
  const errors = checkCommit(message, changedFiles);

  if (errors.length) {
    console.error(`${commit.slice(0, 12)}\n${errors.join("\n")}`);
    process.exitCode = 1;
  }
}

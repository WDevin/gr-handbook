import fs from "fs";
import path from "path";
import YAML from "yaml";
import type { CompareFile, PapersPayload, SolutionsFile } from "./types";

const contentDir = path.join(process.cwd(), "content");

export function loadSolutions(): SolutionsFile {
  const raw = fs.readFileSync(
    path.join(contentDir, "solutions.yaml"),
    "utf8",
  );
  return YAML.parse(raw) as SolutionsFile;
}

export function loadCompare(): CompareFile {
  const raw = fs.readFileSync(path.join(contentDir, "compare.yaml"), "utf8");
  return YAML.parse(raw) as CompareFile;
}

export function loadMarkdown(filename: string): string {
  return fs.readFileSync(path.join(contentDir, filename), "utf8");
}

export function loadPapersPayload(): PapersPayload | null {
  const jsonPath = path.join(process.cwd(), "public", "data", "papers-latest.json");
  if (!fs.existsSync(jsonPath)) return null;
  const raw = fs.readFileSync(jsonPath, "utf8");
  return JSON.parse(raw) as PapersPayload;
}

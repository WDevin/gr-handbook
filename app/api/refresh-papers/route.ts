import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function POST() {
  const root = process.cwd();
  const script = path.join(root, "scripts", "fetch-papers.mjs");

  try {
    const { stdout, stderr } = await execFileAsync(process.execPath, [script], {
      cwd: root,
      env: { ...process.env },
      timeout: 120_000,
      maxBuffer: 10 * 1024 * 1024,
    });

    return Response.json({
      ok: true,
      stdout: stdout.toString().trim(),
      stderr: stderr.toString().trim(),
    });
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException & {
      stdout?: Buffer;
      stderr?: Buffer;
      code?: string | number | null;
    };
    const stderr = err.stderr?.toString().trim() ?? "";
    const stdout = err.stdout?.toString().trim() ?? "";
    return Response.json(
      {
        ok: false,
        error: err.message ?? String(e),
        code: err.code,
        stdout,
        stderr,
      },
      { status: 500 },
    );
  }
}

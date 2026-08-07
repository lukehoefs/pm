import os from "os";
import path from "path";

/**
 * Where the JSON store and uploaded PDFs live. Serverless hosts (Vercel,
 * Netlify) only permit writes under the OS temp dir, so data is ephemeral
 * there — fine for demos; set DATA_DIR to a mounted volume for persistence.
 */
export const DATA_DIR =
  process.env.DATA_DIR ??
  (process.env.VERCEL || process.env.NETLIFY
    ? path.join(os.tmpdir(), "pasco-pm-data")
    : path.join(process.cwd(), "data"));

// Diagnostic: trace whoever scandirs the Windows user-profile junctions.
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const HOME = process.env.USERPROFILE ?? "C:\\Users\\USER";

function hook(name, orig) {
  return function (p, ...rest) {
    try {
      const s = typeof p === "string" ? p : String(p);
      if (s.includes("\\Users\\") && s.toLowerCase().includes(HOME.toLowerCase())) {
        console.error(`\n[TRACE] fs.${name} -> ${s}`);
        console.error(new Error("scandir caller").stack);
      }
    } catch {
      /* ignore */
    }
    return orig.call(this, p, ...rest);
  };
}

fs.readdirSync = hook("readdirSync", fs.readdirSync);
fs.readdir = hook("readdir", fs.readdir);
if (fs.promises?.readdir) {
  fs.promises.readdir = hook("promises.readdir", fs.promises.readdir);
}

console.error("[TRACE] home =", HOME);

// Re-exec next build in this same patched process.
const { createRequire } = await import("node:module");
const require = createRequire(import.meta.url);
process.argv = [process.argv[0], "next", "build"];
require("next/dist/bin/next");

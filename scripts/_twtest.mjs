import postcss from "postcss";
import fs from "node:fs";
import twPlugin from "@tailwindcss/postcss";

const css = fs.readFileSync("src/styles/globals.css", "utf8");
console.log("cwd:", process.cwd());
try {
  const res = await postcss([twPlugin()]).process(css, {
    from: "src/styles/globals.css",
  });
  console.log("OK, output length:", res.css.length);
} catch (e) {
  console.error("THREW:", e.message);
}

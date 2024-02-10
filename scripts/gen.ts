const pkg = "https://unpkg.com/@minecraft/server@1.8.0/index.d.ts";

let text = await fetch(pkg).then((res) => res.text());

text = `// deno-lint-ignore-file no-unused-vars
import { mock } from "./mock.ts"
${
  text
    .replace("from '@minecraft/common'", "from 'npm:@minecraft/common'")
    .replace(/export class.*?\r\n\}/gs, (s) =>
      s
        .replace(/(\w+: [\w.]+\[\]);/gi, "$1 = [];")
        .replace(/(\w+: [\w.]+);/gi, "$1 = mock;")
        .replace(/(\):.*?);/g, "$1 { return mock; }"))
    .replace(/(?<=extends \w+ \{\r\n)(.*);/g, "$1 { super() }")
    .replace(/(constructor.*);/g, "$1 {}")
    .replace(/(export const \w+:.*);/g, "$1 = mock;")
}`;

Deno.writeTextFile("./mod.ts", text);

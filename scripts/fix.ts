const text = await Deno.readTextFile("./mod.ts");

const lines = text.split("\n");

for (const match of text.match(/(?<=class )\w+ extends \w+/g) ?? []) {
  const [current, base] = match.split(" extends ");
  let currentIndex = lines.findIndex((s) => s.includes(`export class ${current}`));
  let baseIndex = lines.findIndex((s) => s.includes(`export class ${base}`));
  if (currentIndex === -1 || baseIndex === -1) {
    console.log(`Missing base class "${base}" for class "${current}"`);
    continue;
  }
  if (currentIndex > baseIndex) {
    continue;
  }
  // Handle JSDoc comments
  for (let i = currentIndex; i > 0; i--) {
    if (lines[i] === "") {
      currentIndex = i;
      break;
    }
  }
  for (let i = baseIndex; i > 0; i--) {
    if (lines[i] === "") {
      baseIndex = i;
      break;
    }
  }
  const baseEndIndex = lines.indexOf("}", baseIndex);
  const declaration = lines.splice(baseIndex, baseEndIndex - baseIndex + 1);
  lines.splice(currentIndex, 0, ...declaration);
}

await Deno.writeTextFile("./mod.ts", lines.join("\n"));

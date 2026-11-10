import {
  readFile as readFileFromDB,
  writeFile as writeFileToDB,
} from "node:fs/promises";

const databasePath = new URL("./db.json", import.meta.url);

async function readFile() {
  const contents = await readFileFromDB(databasePath, "utf8");
  return JSON.parse(contents);
}

async function writeFile(data) {
  await writeFileToDB(databasePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export { readFile, writeFile };
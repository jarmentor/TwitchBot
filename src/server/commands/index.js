import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = {};

fs.readdirSync(__dirname)
  .filter(file => file !== "index.js" && file.endsWith(".js"))
  .forEach(file => {
    import(`./${file}`).then((module) => {
      const commandName = file.replace(".js", "");
      commands[commandName] = module;
    }).catch(console.error);
  });

export default commands;

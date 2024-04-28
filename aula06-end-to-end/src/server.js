import { once } from "node:events";
import { createServer } from "node:http";
import Person from "./person.js";

export const server = createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/persons") {
    res.writeHead(404);
    res.end("Failed to connected");
    return;
  }

  try {
    const data = (await once(req, "data")).toString();
    const result = Person.process(JSON.parse(data));
    res.end(JSON.stringify({ result }));
  } catch (error) {
    if (error.message.includes("required")) {
      res.writeHead(400);
      res.write(JSON.stringify({ validationError: error.message }));
      res.end();
      return;
    }
    res.writeHead(500);
    res.end();
  }
});

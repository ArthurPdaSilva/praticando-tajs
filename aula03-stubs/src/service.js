import crypto from "node:crypto";
import fsSync from "node:fs";
import fs from "node:fs/promises";

export default class Service {
  #filename; //Cria uma variável privada
  constructor({ filename }) {
    this.#filename = filename;
  }

  #hashPassword(password) {
    const hash = crypto.createHash("sha256");
    hash.update(password);
    return hash.digest("hex");
  }

  create({ username, password }) {
    const data = JSON.stringify({
      username,
      password: this.#hashPassword(password),
      createdAt: new Date().toISOString(),
    }).concat("\n");
    // ndjson é um formato de arquivo onde cada linha é um objeto JSON

    return fs.appendFile(this.#filename, data);
  }

  async read() {
    if (fsSync.existsSync(this.#filename)) {
      // Se a linha estiver vazia, o filter irá remover
      const lines = (await fs.readFile(this.#filename, "utf-8"))
        .split("\n")
        .filter((line) => !!line);

      if (!lines.length) return [];
      return lines
        .map((line) => JSON.parse(line))
        .map(({ password, ...rest }) => rest);
    } else {
      throw new Error("Arquivo não encontrado");
    }
  }
}

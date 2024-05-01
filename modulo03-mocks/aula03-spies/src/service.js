import crypto from "node:crypto";
import fs from "node:fs/promises";

export default class Service {
  #filename;
  constructor({ filename }) {
    this.#filename = filename;
  }

  #hashPassword(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
  }

  create({ username, password }) {
    const data = JSON.stringify({
      username,
      password: this.#hashPassword(password),
      createdAt: new Date().toISOString(),
    }).concat("\n");

    return fs.appendFile(this.#filename, data);
  }
  async read() {
    const lines = (await fs.readFile(this.#filename, "utf8"))
      .split("\n")
      .filter((line) => !!line);

    if (!lines.length) return [];

    return lines
      .map((line) => JSON.parse(line))
      .map(({ password, ...rest }) => ({ ...rest }));
  }
}

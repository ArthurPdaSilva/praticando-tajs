import lokijs from "lokijs";
import { randomUUID } from "node:crypto";

export default class Service {
  #heroesTable;

  constructor(dbname) {
    const db = new lokijs(dbname);
    this.#heroesTable = db.addCollection("characters");
  }

  createHero(hero) {
    const items = this.#heroesTable.insert({
      ...hero,
      id: randomUUID(),
    });

    return items;
  }

  listHeroes() {
    return this.#heroesTable.find();
  }
}

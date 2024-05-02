import Service from "./service.js";

async function run(item) {
  const s = new Service("heroes.db");
  const hero = s.createHero(item);
  const heroes = s.listHeroes();
  console.log("createHero", hero);
  console.log("listHeroes", heroes);
}

export { run };

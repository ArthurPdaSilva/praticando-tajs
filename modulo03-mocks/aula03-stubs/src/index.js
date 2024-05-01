import Service from "./service.js";

const data = {
  username: "example",
  password: "example2",
};

const service = new Service({
  filename: "./users.ndjson",
});

await service.create(data);
const users = await service.read();
console.log(users);

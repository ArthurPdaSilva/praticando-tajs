import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { server } from "../src/api.js";

// Defina as tarefas e o requisito no todo antes de começar a codar a implementação
// describe("API Users E2E Suite", () => {
//     it.todo("Should register a new user with young-adult category");
//     it.todo("Should register a new user with adult category");
//     it.todo("Should register a new user with senior category");
//     it.todo("Should throw an error when registering a under-age user");
// });

// Construa os testes sempre deixanco claro a entrada, o processamento e a saida

describe("API Users E2E Suite", () => {
  function waitForServerStatus(server) {
    return new Promise((res, rej) => {
      // Ouviu um, não retorne o outro (once)
      server.once("error", (err) => rej(err));
      server.once("listening", () => res());
    });
  }

  function createUser(data) {
    return fetch(`${_testServerAddress}/users`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async function findUserById(id) {
    const user = await fetch(`${_testServerAddress}/users/${id}`, {
      method: "GET",
    });
    return user.json();
  }

  let _testServer;
  let _testServerAddress;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    _testServer = server.listen();
    await waitForServerStatus(_testServer);

    const serverInfo = _testServer.address();
    _testServerAddress = `http://localhost:${serverInfo.port}`;
  });

  afterAll((done) => {
    server.closeAllConnections(); //Aumentava a velocidade na execução
    _testServer.close(done);
  });

  it("Should register a new user with young-adult category", async () => {
    // Trabalhar com data é interessante usar fake timers, pois o ano que vem o teste pode quebrar
    jest.useFakeTimers({
      now: new Date("2023-11-23T00:00"),
    });
    const expectedCategory = "young-adult";

    const response = await createUser({
      name: "Xuxa da Silva",
      birthDay: "2000-01-01",
    });

    // Escreva um teste que vai falhar, corriga e rode ele novamente
    expect(response.status).toBe(201);
    const result = await response.json();
    expect(result.id).not.toBeUndefined();

    //Comum em E2E batemos em uma segunda rota para checar se deu certo o usuário, pois o create não verifica se os dados do user não está certo
    const user = await findUserById(result.id);
    expect(user.category).toBe(expectedCategory);
  });
  it("Should register a new user with adult category", async () => {
    jest.useFakeTimers({
      now: new Date("2023-11-23T00:00"),
    });
    const expectedCategory = "adult";

    const response = await createUser({
      name: "Xuxa da Silva",
      birthDay: "1985-01-01",
    });

    expect(response.status).toBe(201);
    const result = await response.json();
    expect(result.id).not.toBeUndefined();

    const user = await findUserById(result.id);
    expect(user.category).toBe(expectedCategory);
  });
  it("Should register a new user with senior category", async () => {
    jest.useFakeTimers({
      now: new Date("2023-11-23T00:00"),
    });
    const expectedCategory = "senior";

    const response = await createUser({
      name: "Xuxa da Silva",
      birthDay: "1940-01-01",
    });

    expect(response.status).toBe(201);
    const result = await response.json();
    expect(result.id).not.toBeUndefined();

    const user = await findUserById(result.id);
    expect(user.category).toBe(expectedCategory);
  });
  it("Should throw an error when registering an under-age user", async () => {
    const response = await createUser({
      name: "Xuxa da Silva",
      birthDay: "2020-02-03",
    });

    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result).toEqual({
      message: "User must be 18yo or older",
    });
  });
  it("Should throw an error when registering user and invalid route", async () => {
    const response = await fetch(`${_testServerAddress}/invalid-route`, {
      method: "GET",
    });

    expect(response.status).toBe(500);
  });
});

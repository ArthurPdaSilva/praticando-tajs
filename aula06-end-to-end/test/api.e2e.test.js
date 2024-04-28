import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";

function waitForServerStatus(server) {
  return new Promise((res, rej) => {
    // Ouviu um, não retorne o outro (once)
    server.once("error", (err) => rej(err));
    server.once("listening", () => res());
  });
}

// E2E é do ponto de vista do cliente
describe("E2E Test Suite", () => {
  describe("E2E Tests for Server in a non-test env", () => {
    it("should start server with PORT 4000", async () => {
      const PORT = 4000;
      process.env.NODE_ENV = "production";
      process.env.PORT = PORT;
      jest.spyOn(console, "log");
      //   Impedir o server de subir em test mode
      const { default: server } = await import("../src/index.js");

      //   Passou sem estourar
      await waitForServerStatus(server);

      const serverInfo = server.address();
      expect(serverInfo.port).toBe(4000);
      expect(console.log).toHaveBeenCalledWith(
        `server is running at ${serverInfo.address}:${serverInfo.port}`
      );

      return new Promise((res) => server.close(res));
    });
  });
  // Todo fazer o caminho que vai passar
  describe("E2E Tests for Server", () => {
    let _testServer;
    let _testServerAddress;
    beforeAll(async () => {
      process.env.NODE_ENV = "test";
      //   Impedir o server de subir em test mode
      const { default: server } = await import("../src/index.js");
      _testServer = server.listen();

      //   Passou sem estourar
      await waitForServerStatus(_testServer);

      const serverInfo = _testServer.address();
      //   Se eu não setei numa porta, ele busca uma porta vaga
      _testServerAddress = `http://localhost:${serverInfo.port}`;
    });

    // Depois de tudo fecha tudo
    afterAll((done) => _testServer.close(done));

    // Testes para fazer deixa it.todo
    // it.todo("should return 404 for unsupported routes");
    it("should return 404 for unsupported routes", async () => {
      const res = await fetch(`${_testServerAddress}/unsupported`, {
        method: "POST",
      });

      expect(res.status).toBe(404);
    });
    it("should return 500", async () => {
      const invalidPerson = {
        name: "Fulna Full",
        cpf: "123.123.123-12",
        errorProp: "error",
      };
      const res = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(invalidPerson),
      });

      expect(res.status).toBe(500);
    });
    it("should return 400 and missing field message when name is invalid", async () => {
      const invalidPerson = { cpf: "1231" };

      const res = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(invalidPerson),
      });

      expect(res.status).toBe(400);
      const data = await res.json();

      expect(data.validationError).toEqual("Name is required");
    });
    it("should return 400 and missing field message when CPF is invalid", async () => {
      const invalidPerson = { name: "Fulano Ano" };

      const res = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(invalidPerson),
      });

      expect(res.status).toBe(400);
      const data = await res.json();

      expect(data.validationError).toEqual("CPF is required");
    });
    it("should return 500 when missing field prop last name", async () => {
      const invalidPerson = { name: "Fulano", cpf: "123.123.123-12" };

      const res = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(invalidPerson),
      });

      expect(res.status).toBe(500);
    });
    it("should return 200 when person is saved", async () => {
      jest.spyOn(console, "log");
      const validPerson = { name: "Fulano da Silva", cpf: "123.123.123-12" };

      const res = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(validPerson),
      });

      expect(res.status).toBe(200);
      expect(console.log).toHaveBeenCalledWith("Registrado com sucesso");
    });
  });
});

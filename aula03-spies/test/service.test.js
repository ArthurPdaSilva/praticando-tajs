import { beforeEach, describe, jest } from "@jest/globals";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import Service from "../src/service.js";

describe("Service Test Suite", () => {
  let _service;
  const filename = "testfile.ndjson";
  const MOCKED_HASH_PWD = "hashedpassword";

  describe("#Create - spies", () => {
    beforeEach(() => {
      // Toda vez que eu rodar o test, ele vai reiniciar o estado desses objetos
      jest.spyOn(crypto, crypto.createHash.name).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue(MOCKED_HASH_PWD),
      });

      jest.spyOn(fs, fs.appendFile.name).mockResolvedValue();

      _service = new Service({ filename });
    });
    it("should call appendFile with right params", async () => {
      //Validando parâmetros passados em funções terciarias
      // AAA
      const input = {
        username: "user",
        password: "password",
      };

      const expectedCreatedAt = new Date().toISOString();

      // Arrange
      jest
        .spyOn(Date.prototype, Date.prototype.toISOString.name)
        .mockReturnValue(expectedCreatedAt);

      // Act
      await _service.create(input);
      expect(crypto.createHash).toHaveBeenNthCalledWith(1, "sha256");

      // Garantir que os parâmetros foram chamados com os valores corretos
      const hash = crypto.createHash("sha256");
      expect(hash.update).toHaveBeenCalledWith(input.password);
      expect(hash.digest).toHaveBeenCalledWith("hex");
      const expected = JSON.stringify({
        ...input,
        createdAt: expectedCreatedAt,
        password: MOCKED_HASH_PWD,
      }).concat("\n");

      expect(fs.appendFile).toHaveBeenCalledWith(filename, expected);
    });
  });
});

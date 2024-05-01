import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import Service from "../src/service.js";

describe("Service Test Suite", () => {
  let _service;
  const filename = "./test.ndjson";
  // Antes de qualquer teste, o arquivo será criado
  beforeEach(() => {
    _service = new Service({
      filename,
    });
  });
  describe("#read", () => {
    it("should return an empty array if the file is empty", async () => {
      jest.spyOn(fs, fs.readFile.name).mockResolvedValue("");
      const result = await _service.read();
      expect(result).toStrictEqual([]);
    });
    it("should return users without password if file contains users", async () => {
      // Arrange
      const dbData = [
        {
          username: "user1",
          password: "user1",
          createdAt: new Date().toISOString(),
        },
        {
          username: "user2",
          password: "user2",
          createdAt: new Date().toISOString(),
        },
      ];

      const fileContents = dbData
        .map((data) => JSON.stringify(data))
        .join("\n");

      jest.spyOn(fs, "readFile").mockResolvedValue(fileContents);

      const result = await _service.read();
      const expected = dbData.map(({ password, ...rest }) => rest);
      expect(result).toStrictEqual(expected);
    });
    it("shoude return an empty array if the file is not exists", async () => {
      jest.spyOn(fsSync, "existsSync").mockImplementation(() => {
        throw new Error("Arquivo não encontrado");
      });

      try {
        await _service.read();
        fail("A função deveria lançar uma exceção");
      } catch (error) {
        expect(error.message).toBe("Arquivo não encontrado");
      }
    });
  });
});

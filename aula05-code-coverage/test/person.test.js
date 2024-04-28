import { describe, expect, it } from "@jest/globals";
import { mapPerson } from "../src/person.js";

// Code coverage é perfeito em código legado para saber o que não tá sendo coberto por testes
// Suite de testes end to end com code coverage é a melhor alternativa para iniciar em códigos legados
describe("Person Test Suite", () => {
  it("happy path", () => {
    const personStr = '{"name": "erick","age": 28}';
    const personObj = mapPerson(personStr);

    expect(personObj).toEqual({
      name: "erick",
      age: 28,
      createdAt: expect.any(Date),
    });
  });
  it("bad path", () => {
    const personStr = '{"name"';
    // Validações e manipulações de erro tem que ser implementadas mesmo que o code coverage não aponte isso

    expect(() => mapPerson(personStr)).toThrow();
  });
});

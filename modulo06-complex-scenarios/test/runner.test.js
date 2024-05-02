import { describe, expect, it, jest } from "@jest/globals";
import lokijs from "lokijs";
import { run } from "../src/runner.js";

// Isso é um cenário complexo, pois envolve a criação de um mock para o LokiJS e para o randomUUID já que em tese o service estaria absurdamente acoplado com essas dependências e demais.
// Mock de módulos são necessários para que possamos testar o comportamento de um módulo em específico, sem que ele dependa de outros módulos. Porém, é importante que o mock seja feito de forma correta, para que o teste reflita a realidade e o módulo pode ser atualizado e quebrar o teste.

const ID_UUID = "0";
const metaDataLokiInsert = {
  meta: { revision: 0, created: Date.now(), version: 0 },
  $loki: 1,
};

jest.mock("lokijs");

function configureDbDriverMock(initialData = [{ collection: "", data: [] }]) {
  const spies = {
    db: null,
    addCollection: null,
    insert: null,
    find: null,
  };

  const seedDb = () => {
    const _dbData = {};
    initialData.forEach(({ collection, data }) => {
      _dbData[collection] ??= [];
      data.forEach((item) => _dbData[collection].push(item));
    });

    return _dbData;
  };
  spies.db = lokijs.mockImplementationOnce((dbname) => {
    const _dbData = seedDb();
    const addCollection = (spies.addCollection = jest.fn((collectionName) => {
      const insert = (spies.insert = jest.fn((data) => {
        const item = {
          ...data,
          ...metaDataLokiInsert,
        };

        _dbData[collectionName].push(item);

        return item;
      }));
      const find = (spies.find = jest.fn(() => {
        return _dbData[collectionName];
      }));

      return {
        insert,
        find,
      };
    }));

    return {
      addCollection,
    };
  });

  return spies;
}

jest.mock("node:crypto", () => ({
  randomUUID: jest.fn(() => ID_UUID),
}));

describe("Complex Tests", () => {
  it("should spy DB Driver calls", async () => {
    const collectionName = "characters";
    const dbname = "heroes.db";
    const initialData = [
      {
        id: "1",
        name: "Superman",
        power: "fly",
        age: 30,
        ...metaDataLokiInsert,
      },
    ];

    const seedDb = [
      {
        collection: collectionName,
        data: initialData,
      },
    ];

    const input = {
      name: "Batman",
      power: "rich",
      age: 50,
    };

    jest.spyOn(console, "log").mockImplementation(() => {});
    const spies = configureDbDriverMock(seedDb);
    await run(input);

    const insertResult = {
      ...input,
      id: ID_UUID,
    };

    const expectedResult = {
      ...input,
      ...metaDataLokiInsert,
      id: ID_UUID,
    };

    expect(spies.db).toHaveBeenNthCalledWith(1, dbname);
    expect(spies.addCollection).toHaveBeenNthCalledWith(1, collectionName);
    expect(spies.insert).toHaveBeenNthCalledWith(1, insertResult);
    expect(spies.find).toHaveBeenNthCalledWith(1);

    const logCalls = console.log.mock.calls;
    expect(logCalls[0]).toEqual(["createHero", expectedResult]);

    const expectedCurrentDb = initialData.concat(expectedResult);
    expect(logCalls[1]).toEqual(["listHeroes", expectedCurrentDb]);
  });
});

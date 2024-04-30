import { BeforeStep, Then, When } from "@cucumber/cucumber";
import assert from "node:assert";

let _testServerAddress = "";
// Contexto só desse arquivo
let _context = {};
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

// Recuperar a propriedade do outro arquivo
BeforeStep(function () {
  _testServerAddress = this.testServerAddress;
});

// Tem que seguir a ordem do feature
When(
  "I create a new user with the following details:",
  async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);
    assert.strictEqual(response.status, 201);
    _context.user = await response.json();
    assert.ok(_context.user.id);
  }
);

Then("I request the API with the user's ID", async function () {
  const user = await findUserById(_context.user.id);
  _context.createdUserData = user;
});

Then(
  "I should receive a JSON response with the user's details",
  async function () {
    const expectedKeys = ["name", "birthDay", "id", "category"];
    assert.deepStrictEqual(
      Object.keys(_context.createdUserData).sort(),
      expectedKeys.sort()
    );
  }
);

Then("The user's category should be {string}", async function (category) {
  assert.strictEqual(_context.createdUserData.category, category);
});

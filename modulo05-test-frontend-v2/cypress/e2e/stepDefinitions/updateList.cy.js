// // Regras específicas
import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { registerForm } from "../common/registerForm.cy";

Then(
  "the list of registered images should be updated with the new item",
  function () {
    registerForm.elements.section().find("article").should("have.length", 4);
  }
);

Then("the new item should be stored in the localStorage", function () {
  cy.window().then((win) => {
    const list = win.localStorage.getItem("tdd-ew-db");
    const parsedList = JSON.parse(list);
    expect(parsedList).to.have.length(1);
  });
  //   Outra maneira de checar o localStorage
  //   cy.getLocalStorage("tdd-ew-db").then((list) => {
  //     expect(list).to.have.length(1);
  //   });
});

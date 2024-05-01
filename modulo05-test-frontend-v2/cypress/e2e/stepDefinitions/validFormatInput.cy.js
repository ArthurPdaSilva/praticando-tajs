// // Regras específicas
import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { registerForm } from "../common/registerForm.cy";

Then("I can hit enter to submit the form", () => {
  // Em que ele tiver com foco no momento
  registerForm.elements.imageUrlInput().click();
  cy.focused().should("exist").type("{enter}");
});

Then("The inputs should be cleared", function () {
  registerForm.elements.titleInput().should("have.value", "");
  registerForm.elements.imageUrlInput().should("have.value", "");
});

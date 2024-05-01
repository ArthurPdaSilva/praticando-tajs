// Regras específicas
import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { registerForm } from "../common/registerForm.cy";

Then("I have submitted an image", function () {
  registerForm.typeTitle("Wesley Esfera");
  registerForm.typeUrl(
    "https://images7.memedroid.com/images/UPLOADED328/620763a1b124c.jpeg"
  );
  registerForm.clickSubmit();
  registerForm.elements.section().find("article").should("have.length", 4);
});

When("I refresh the page", function () {
  cy.reload();
});

Then(
  "I should still see the submitted image in the list of registered images",
  function () {
    registerForm.elements.section().find("article").should("have.length", 4);
  }
);

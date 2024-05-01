// // Regras específicas
import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { registerForm } from "./../common/registerForm.cy";

Then("I should see {string} message above the title field", function (text) {
  // Should = assert
  registerForm.elements.titleFeedback().should("contain.text", text);
});

Then("I should see {string} message above the imageUrl field", function (text) {
  registerForm.elements.urlFeedback().should("contain.text", text);
});

Then(
  "I should see an exclamation icon in the title and URL fields",
  function () {
    registerForm.elements
      .titleInput()
      .should("have.attr", "required", "required");
    registerForm.elements
      .imageUrlInput()
      .should("have.attr", "required", "required");
    // Ou
    // registerForm.elements.titleInput().should(([element]) => {
    //   // GetComputedStyles serve para pegar o valor de uma propriedade CSS passando o nome dela
    //   const styles = window.getComputedStyle(element);
    //   const border = styles.getPropertyValue("border-right-color");
    //   expect(border).to.equal("rgb(222, 226, 230)");
    // });
  }
);

// Limpar o storage caso o testIsolation seja false: cy.clearLocalStorage();

class RegisterForm {
  // Deixa como função para ficar reenderizado
  elements = {
    titleInput: () => cy.get("#title"),
    titleFeedback: () => cy.get("#titleFeedback"),
    imageUrlInput: () => cy.get("#imageUrl"),
    urlFeedback: () => cy.get("#urlFeedback"),
    submitBtn: () => cy.get("#btnSubmit"),
    section: () => cy.get("#card-list"),
  };

  typeTitle(text) {
    if (!text) return;
    // Obrigatoriamente ele pede para ter algo na string
    this.elements.titleInput().type(text);
  }

  typeUrl(url) {
    if (!url) return;
    this.elements.imageUrlInput().type(url);
  }

  clickSubmit() {
    this.elements.submitBtn().click();
  }
}

export const registerForm = new RegisterForm();

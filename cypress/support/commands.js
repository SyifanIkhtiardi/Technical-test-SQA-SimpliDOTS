Cypress.Commands.add(("tmdbLogin"), () => {
    cy.visit("https://www.themoviedb.org/login");
    cy.get("#username")
        .type(Cypress.env("username"))
        .should('have.value', Cypress.env("username"));
    cy.get("#password")
    .type(Cypress.env("password"), {log: false})
    .should(el$ => {
        if (el$.val() !== Cypress.env("password")) {
          throw new Error('Different value of typed password')
        }
      });
    cy.get("#login_button").click();
})
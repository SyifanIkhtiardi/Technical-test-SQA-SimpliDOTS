// Login custom commands
Cypress.Commands.add(("tmdbLogin"), (username, password) => {
    cy.visit("https://www.themoviedb.org");
    cy.contains("Login").click();
    cy.get("#username")
        .type(username)
        .should('have.value', username);
    cy.get("#password")
    .type(password, {log: false})
    .should(el$ => {
        if (el$.val() !== password) {
          throw new Error('Different value of typed password')
        }
      });
    cy.get("#login_button").click();
});

// Set cookies commands
Cypress.Commands.add(("setLoginSession"), () => {
  cy.fixture("cookies.json").then((cookies) => {
    cookies.forEach((cookie) => {
      cy.setCookie(cookie.name, cookie.value, {
        path: cookie.path,
        secure: cookie.secure,
        domain: cookie.domain,
        expiry: cookie.expiry,
        sameSite: cookie.sameSite,
        httpOnly: cookie.httpOnly,
      });
    });
  });
});

// Visit movie/tvshow list custom commands
Cypress.Commands.add(("navigateToMovieOrTVList"), (type, category) => {
  cy.get(".dropdown_menu.navigation")
  .contains(`${type}`) // Find the element containing the text "TV Shows"
  .click() // Click on the "TV Shows" element
  .next() // Traverse to the next sibling element, which is the dropdown menu
  .contains(`${category}`) // Find the element containing the text "Popular"
  .click(); // Click on the "Popular" element
});

// Navigate to movies detail custom sommands
Cypress.Commands.add("visitMovieDetail", (movieName) => {
  cy.contains(".card", `${movieName}`).click();
});

// Command to hover over the trigger element
Cypress.Commands.add("hoverOverElement", { prevSubject: "element" }, (subject) => {
  cy.wrap(subject).trigger("mouseover");
});
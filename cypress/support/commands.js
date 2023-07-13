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

// Command to sort movie by release date in descending order
Cypress.Commands.add("sortByReleaseDateDesc", (sortedData) => {
  // Get movie titles and release dates
  cy.get('.card.v4').each(($card) => {
    const title = $card.find('.title h2').text();
    const releaseDate = $card.find('.release_date').text();

    // Add title and release date to the movieData array
    sortedData.push({ title, releaseDate });
  }).then(() => {
    // Sort the movieData array by release date
    sortedData.sort((a, b) => {
      const dateA = new Date(a.releaseDate);
      const dateB = new Date(b.releaseDate);
      return dateB - dateA; // Sort in descending order
    });
  });
});
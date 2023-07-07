describe("Favorite movie on The Movie Database", () => {
  const username = Cypress.env("username");
  const password = Cypress.env("password");
  before(() => {
    // Perform login
    cy.tmdbLogin(username, password)

    // Get cookie
    cy.getCookies().then((cookies) => {
      
    // Save the cookies to be used for future requests
    cy.writeFile("cypress/fixtures/cookies.json", JSON.stringify(cookies));
    });
  });

  context("When marks a movie as favorite", () => {
    beforeEach(() => {
      // Set cookie for each test using custom command
      cy.setLoginSession();
    });

    it("should add a movie to user's favorite movies list", () => {
      cy.visit("https://www.themoviedb.org/u/Gompachiro")
    });
    it("should display movie added in the user's favorite movies section on the profile page", () => {
      cy.visit("https://www.themoviedb.org/u/Gompachiro")
    });
  });
  
})
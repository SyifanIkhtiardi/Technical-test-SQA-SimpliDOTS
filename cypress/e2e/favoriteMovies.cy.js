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
      cy.visit("https://www.themoviedb.org/u/Gompachiro");

      // Navigate to movies list 
      // Input first parameter with Movies
      // Input second parameter with Popular, Now Playing, Top Rated, or Upcoming 
      cy.navigateToMovieOrTVList("Movies", "Popular");
      // Verify url

      cy.url().should("eq", "https://www.themoviedb.org/movie");

      // Visit movie detail page
      cy.visitMovieDetail("Fast X");
      cy.url().should("contain", "fast-x");

      // Marks movie as favorite
      cy.get("#favourite").click();

      cy.get("#favourite > span")
        .should("have.class", "true");
      
    });

    it("should display movie added in the user's favorite movies section on the profile page", () => {
      cy.visit("https://www.themoviedb.org/u/Gompachiro/favorites")

      // Verify movie name existed
      cy.contains("Fast X").should("exist");

      // Verify if card contain image and movie detail
      cy.get(".card")
        .find(".image")
        .should("exist");
      cy.get(".card")
        .find(".details")
        .should("exist");
    });

    it("should be able to remove movie from favorite list", () => {
      cy.visit("https://www.themoviedb.org/u/Gompachiro/favorites");
      cy.contains("Remove").click();
      cy.contains("Fast X")
        .should("not.exist");
    });
  });

})
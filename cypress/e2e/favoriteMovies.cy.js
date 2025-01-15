describe("Favorite movie on The Movie Database", () => {
  // Get username and password from cypress env
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

    // Verify language should in english
    cy.get("header > div.content > div > div.flex > ul > li.translate > div").should("contain", "en")
    
    // Load url fixtures
    cy.fixture("urls").then((urlsFixture) => {
      Cypress.urlsFixture = urlsFixture;
    });

    // Load tv shows name data
    cy.fixture("movieData").then((movieNames) => {
      Cypress.movieNames = movieNames;
    });
  });

  beforeEach(function () {
      // Set cookie for each test using custom command
      cy.setLoginSession();

    });

  context("When marks a movie as favorite", () => {
    it("should sucessfully add a movie to user's favorite movies list", () => {
      cy.visit(Cypress.urlsFixture.baseUrl);

      // Navigate to movies list 
      // Input first parameter with Movies
      // Input second parameter with Popular, Now Playing, Top Rated, or Upcoming 
      cy.navigateToMovieOrTVList("Movies", "Popular");
      // Verify url
      cy.url().should("eq", Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.movie);

      // Visit movie detail page
      cy.visitMovieDetail("Sonic the Hedgehog 3");
      cy.url().should("contain", "sonic-the-hedgehog-3");

      // Marks movie as favorite
      cy.get("#favourite").click();

      cy.get("#favourite > span").should("have.class", "true");
      
    });

    it("should display movie added in the user's favorite movies section on the profile page", () => {
      cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesMovie)

      // Verify movie name existed
      cy.contains("Sonic the Hedgehog 3").should("exist");

      // Verify if movie contain image and movie detail
      cy.get(".card")
        .find(".image")
        .should("exist");
      cy.get(".card")
        .find(".details")
        .should("exist");

      cy.get("[data-media-type='movie']").should("contain", "1")
    });
  });

  context("When user remove a movie from favorite list", () => {
      it("should display correct movie counter", () => {
          cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesMovie);
          cy.contains("Remove").click();

          // Reload the page
          cy.reload();

          cy.wait(1000);
          
          // Verify if display correct counter
          cy.get("[data-media-type='movie']").should("contain", "0")
        });

      it("should be able to remove movie from favorite list", () => {
          cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesMovie);
          cy.contains("Sonic the Hedgehog 3").should("not.exist");
        });
  })

  context("When marks multiple movies as favorite", () => {
    it("should add multiple to user's favorite movies list", () => {
      cy.visit(Cypress.urlsFixture.baseUrl);

      // Navigate to movies list 
      // Input first parameter with Movies
      // Input second parameter with Popular, Now Playing, Top Rated, or Upcoming 
      cy.navigateToMovieOrTVList("Movies", "Popular");

      // Verify url
      cy.url().should("eq", Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.movie);

      Cypress.movieNames.forEach((movie) => {

        // Visit movie detail page
        cy.visitMovieDetail(movie);
       
        // Marks movie as favorite
        cy.get("#favourite").click();

        cy.get("#favourite > span").should("have.class", "true");  
        
        // Back to movie list page
        cy.go(-1);
      });
    });

    it("should be added to the user's favorite movie list", () => {
      cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesMovie);

      // Verify if list have 3 movies in it
      cy.get(".results_page")
        .children()
        .should("have.length", 3);
      
      // Verify if movie name existed in the list
      Cypress.movieNames.forEach((movie) => {
        cy.contains(movie).should("exist");
      });

      // Verify if display correct counter
      cy.get("[data-media-type='movie']").should("contain", "3")
    });

    it("should display movies order by release date in descending order (most recent to oldest", () => {
      cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesMovie + Cypress.urlsFixture.orderByParam + Cypress.urlsFixture.orderTypeParam);

      const movieData = [];
      const sortedMovieData = [];

      // Get title and release date text
      cy.get(".card.v4").each(($card) => {
        const title = $card.find(".title h2").text();
        const releaseDate = $card.find('.release_date').text();

        // Add title and release date to the movieData array
        movieData.push({ title, releaseDate });
      })

      // Sort movie by release date in descending order
      cy.sortByReleaseDateDesc(sortedMovieData);
      
      // Compare movie data and sorted movie data
      expect(movieData).to.deep.equal(sortedMovieData);
    });

    it("should be able remove movies from favorite", () => {
      cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesMovie);
      cy.get(".results_page")
        .find(".remove_list_item")
        .each(($el) => {
          cy.wrap($el).click();
        });

      Cypress.movieNames.forEach((movie) => {
        cy.contains(movie).should("not.exist");
      });
    });
  });
});
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

    // Load url fixtures
    cy.fixture("urls").then((urlsFixture) => {
      Cypress.urlsFixture = urlsFixture;
    });
  });

  beforeEach(() => {
      // Set cookie for each test using custom command
      cy.setLoginSession();

    });

  context("When marks a movie as favorite", () => {
    it("should add a movie to user's favorite movies list", () => {
      cy.visit(Cypress.urlsFixture.baseUrl);

      // Navigate to movies list 
      // Input first parameter with Movies
      // Input second parameter with Popular, Now Playing, Top Rated, or Upcoming 
      cy.navigateToMovieOrTVList("Movies", "Popular");
      // Verify url
      cy.url().should("eq", Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.movie);

      // Visit movie detail page
      cy.visitMovieDetail("Fast X");
      cy.url().should("contain", "fast-x");

      // Marks movie as favorite
      cy.get("#favourite").click();

      cy.get("#favourite > span").should("have.class", "true");
      
    });

    it("should display movie added in the user's favorite movies section on the profile page", () => {
      cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesMovie)

      // Verify movie name existed
      cy.contains("Fast X").should("exist");

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

  context("When user remove a movie from favortie list", () => {
      it("should be able to remove movie from favorite list", () => {
          cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesMovie);
          cy.contains("Remove").click();
          cy.contains("Fast X").should("not.exist");

          cy.get("[data-media-type='movie']").should("contain", "0")
        });
  })

  context("When marks multiple movies as favorite", () => {
    const movies = ["Fast X", "Spider-Man: Across the Spider-Verse", "The Super Mario Bros. Movie"];

    it("should add multiple to user's favorite movies list", () => {
      cy.visit(Cypress.urlsFixture.baseUrl);

      // Navigate to movies list 
      // Input first parameter with Movies
      // Input second parameter with Popular, Now Playing, Top Rated, or Upcoming 
      cy.navigateToMovieOrTVList("Movies", "Popular");

      // Verify url
      cy.url().should("eq", Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.movie);

      movies.forEach((movie) => {

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
      movies.forEach((movie) => {
        cy.contains(movie).should("exist");
      });

      cy.get("[data-media-type='movie']").should("contain", "3")
    });

    it("should display movies order by release date in descending order (most recent to oldest", () => {
      cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesMovie + Cypress.urlsFixture.orderByParam + Cypress.urlsFixture.orderTypeParam);

      // Retrieve list of favorite movie
      cy.get(".results_page").then(($movies) => {
       
        // Extract movie title for comparison
        const movieTitles = $movies.toArray().map((movie) => 
          Cypress.$(movie).find(".title a ").text()
        );

        // Verify if the movies are displayed in expected order
        const orderByReleaseDesc = ["Spider-Man: Across the Spider-VerseFast XThe Super Mario Bros. Movie"];
        expect(movieTitles).to.deep.equal(orderByReleaseDesc);
      });

    })

    it("should be able remove movies from favorite", () => {
      cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesMovie);
      cy.get(".results_page")
        .find(".remove_list_item")
        .each(($el) => {
          cy.wrap($el).click();
        });

      cy.get("[data-media-type='movie']").should("contain", "0")

      movies.forEach((movie) => {
        cy.contains(movie).should("not.exist");
      });
    });
  });
  
});
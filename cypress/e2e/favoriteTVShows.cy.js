describe("Favorite TV shows on The Movie Database", () => {
    // Get username and password from cypress env
    const username = Cypress.env("username");
    const password = Cypress.env("password");
  
    before(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
      // Perform login
      cy.tmdbLogin(username, password)
  
      // Get cookie
      cy.getCookies().then((cookies) => {
        
      // Save the cookies to be used for future requests
      cy.writeFile("cypress/fixtures/cookies.json", JSON.stringify(cookies));
      });
  
      // Verify language should in english
      cy.get("header > div.content > div > div.flex > ul > li.translate > div").should("contain", "en");
      
      // Load url fixtures
      cy.fixture("urls").then((urlsFixture) => {
        Cypress.urlsFixture = urlsFixture;
      });
    });
  
    beforeEach(() => {
        // Set cookie for each test using custom command
        cy.setLoginSession();
  
      });
  
    context("When marks a tv show as favorite", () => {
      it("should add a tv show to user's favorite TV shows list", () => {
        cy.visit(Cypress.urlsFixture.baseUrl);
  
        // Navigate to movies list 
        // Input first parameter with TV Shows
        // Input second parameter with Popular, Airing Today, Top Rated, or On TV 
        cy.navigateToMovieOrTVList("TV Shows", "Top Rated");
        // Verify url
        cy.url().should("eq", Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.tv);
  
        // Visit movie detail page
        cy.visitMovieDetail("One Piece");
        cy.url().should("contain", "37854");
  
        // Marks movie as favorite
        cy.get("#favourite").click();
  
        cy.get("#favourite > span").should("have.class", "true");
        
      });
  
      it("should display TV show added in the user's favorite TV shows section on the profile page", () => {
        cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesTV)
  
        // Verify movie name existed
        cy.contains("One Piece").should("exist");
  
        // Verify if movie contain image and movie detail
        cy.get(".card")
          .find(".image")
          .should("exist");
        cy.get(".card")
          .find(".details")
          .should("exist");
  
        // Verify if display correct counter
        cy.get("[data-media-type='tv']").should("contain", "1")
      });
    });
  
    context("When user remove a TV show from favortie list", () => {
        it("should display correct TV show counter", () => {
            cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesTV);
            cy.contains("Remove").click();
  
            // Verify if display correct counter
            cy.get("[data-media-type='tv']").should("contain", "0")
          });
        it("should be able to remove TV show from favorite list", () => {
            cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesTV);
            cy.contains("One Piece").should("not.exist");
          });
    })
  
    context("When marks multiple TV shows as favorite", () => {
      const tvShows = ["One Piece", "Demon Slayer: Kimetsu no Yaiba", "Fullmetal Alchemist: Brotherhood"];
  
      it("should add multiple to user's favorite movies list", () => {
        cy.visit(Cypress.urlsFixture.baseUrl);
  
        // Navigate to movies list 
        // Input first parameter with Movies
        // Input second parameter with Popular, Now Playing, Top Rated, or Upcoming 
        cy.navigateToMovieOrTVList("TV Shows", "Top Rated");
  
        // Verify url
        cy.url().should("eq", Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.tv);
  
        tvShows.forEach((show) => {
  
          // Visit movie detail page
          cy.visitMovieDetail(show);
         
          // Marks movie as favorite
          cy.get("#favourite").click();
  
          cy.get("#favourite > span").should("have.class", "true");  
          
          // Back to movie list page
          cy.go(-1);
        });
      });
  
      it("should be added to the user's favorite TV show list", () => {
        cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesTV);
  
        // Verify if list have 3 movies in it
        cy.get(".results_page")
          .children()
          .should("have.length", 3);
        
        // Verify if movie name existed in the list
        tvShows.forEach((show) => {
          cy.contains(show).should("exist");
        });
  
        cy.get("[data-media-type='tv']").should("contain", "3")
      });
  
      it("should display TV Shows order by release date in descending order (most recent to oldest", () => {
        cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesTV + Cypress.urlsFixture.orderByParam + Cypress.urlsFixture.orderTypeParam);
  
        // Retrieve list of favorite movie
        cy.get(".results_page").then(($shows) => {
         
          // Extract movie title for comparison
          const showTitles = $shows.toArray().map((show) => 
            Cypress.$(show).find(".title a ").text()
          );
  
          // Verify if the movies are displayed in expected order
          const orderByReleaseDesc = ["Demon Slayer: Kimetsu no YaibaFullmetal Alchemist: BrotherhoodOne Piece"];
          expect(showTitles).to.deep.equal(orderByReleaseDesc);
        });
      })
  
      it("should be able remove TV show from favorite", () => {
        cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesTV);
        cy.get(".results_page")
          .find(".remove_list_item")
          .each(($el) => {
            cy.wrap($el).click();
          });
  
        tvShows.forEach((show) => {
          cy.contains(show).should("not.exist");
        });
      });
    });  
  });
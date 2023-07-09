describe("Import and export favorites movie or TV show csv", () => {
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
  
      // Load url fixtures
      cy.fixture("urls").then((urlsFixture) => {
        Cypress.urlsFixture = urlsFixture;
      });
    });
  
    beforeEach(() => {
        // Set cookie for each test using custom command
        cy.setLoginSession();
  
    });

    context("When importing a favorite movie and tv show list from csv", () => {
        it("should successfully imported the favorite list", () => {
            cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesTV);

            // Select import list from dropdown
            cy.get("div.list_options.glyphicons_v2.more").click()
            .then(() => {
                cy.get(".k-state-border-down").should("be.visible");
                cy.get('div[role="tooltip"]') // Select the dropdown container
                  .should('be.visible') // Verify that the dropdown is visible
                  .contains('Import List') // Find the "Import List" link within the dropdown
                  .click(); // Click on the "Import List" link
            });

            // Verify url
            cy.url().should("eq", Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.importPage);

            // Select which list want to import
            cy.get('span.k-dropdown-wrap').click(); // Select which list want to import
            cy.get('li.k-item').contains('Favorite').click(); // Click on the 'Favorite' option

            // Select file that want to import
            cy.get("input[type=file]").selectFile("cypress/fixtures/myFavoriteList.csv", {
                action: "drag-drop",
                force: true
              }); // Import file 
            
            // Click Import button
            cy.get("input.k-button.k-primary.background_color.border_color.blue").click();

            // Verify if import status success
            cy.contains("We detected a file. We detected a total number of 6 items to import. The import is currently running the background and you will be automatically notified when it is complete.").should("be.exist");
        });

        it("should be added to the user's favorite movie list", () => {
            const movies = ["Fast X", "Spider-Man: Across the Spider-Verse", "The Super Mario Bros. Movie"];

            cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesMovie)

            // Verify if list have 3 movies in it
            cy.get(".results_page")
              .children()
              .should("have.length", 3);
    
            // Verify if movie name existed in the list
            movies.forEach((movie) => {
            cy.contains(movie).should("exist");
            });

        });

        it("should be added to the user's favorite movie list", () => {
            const tvShows = ["Jujutsu Kaisen", "Peaky Blinders", "Lucifer"];

            cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesTV)
           
            // Verify if list have 3 movies in it
            cy.get(".results_page")
              .children()
              .should("have.length", 3);
        
            // Verify if movie name existed in the list
            tvShows.forEach((show) => {
            cy.contains(show).should("exist");
            });
        });
    });

    context("When exporting a favorite movie and tv show list to csv", () => {
        it("should successfully exported the favorite list", () => {
            cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesTV)

            // Select export csv from dropdown
            cy.get("div.list_options.glyphicons_v2.more").click()
            .then(() => {
                cy.get(".k-state-border-down").should("be.visible");
                cy.get("div[role='tooltip']") // Select the dropdown container
                  .should("be.visible") // Verify that the dropdown is visible
                  .get("body > div.k-animation-container > div > div.k-tooltip-content > ul > li:nth-child(2) > a") // Find the "Export CSV" link within the dropdown
                  .click({force: true}); // Click on the "Export CSV" link
            });

            // Verify if export pop up is shown
            cy.get("#export_csv_window").should("be.visible");

            // Click export
            cy.get("input#created_export").click();

            cy.wait(1000);

            // Verify if list successfully exported
            cy.contains("Success").should("be.visible");
        });
    });

    context("Remove favorite list", () => {
        it("Remove favorite movie list", () => {
            cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesMovie);
            cy.get(".results_page")
              .find(".remove_list_item")
              .each(($el) => {
                cy.wrap($el).click();
              });
        });

        it("Remove favorite TV show list", () => {
            cy.visit(Cypress.urlsFixture.baseUrl + Cypress.urlsFixture.favoritesTV);
            cy.get(".results_page")
              .find(".remove_list_item")
              .each(($el) => {
                cy.wrap($el).click();
              });
        });
    })

    
});
```gherkin

Feature: The Movie Database (TMDb) Mark as Favorite 
As a user, i want to be able to mark movies or tv shows as favorite,so that I can save and easily access movies or tv shows that interest me.

	Scenario: User marks a movie as favorite
		Given the user is logged in
		And the user is on the movie detail page
		When the user marks the  movie as favorite
		Then the movie should be added to the user's favorite movie list
		And the movie should be displayed in the user's favorite movies section on the profile page
		
	Scenario: User can mark multiple movies as favorites
		Given the user is logged in
		And the user is on the movies list page
		When the user marks multiple movies as favorites
		Then all the selected movies should be added to the user's favorite movie list
		And all the selected movies should be displayed in the user's favorite movies section on the profile page 

	Scenario: User can mark a TV show as favorite
		Given the user is logged in
		And the user is on the TV show detail page
		When the user mark the TV show as favorite
		Then the TV show should be added to the user's favorite TV show list
		And the TV show should be displayed in the user's favorite TV show section on the profile page

	Scenario: User can mark multiple TV show as favorite
		Given the user is logged in
		And the user is on the TV shows list page
		When the user marks multiple TV shows as favorites
		Then all selected TV shows should be added to the user's favorite TV shows section on the profile page

	Scenario: User can remove a movie from favorite movies
		Given the user is logged in
		And the user has a movie in their favorite movie list
		And the user on the profile page favorite tv show section
		When the user removes the movie from their favorite movies
		Then the movie should be removed from the user's favorite movie list
		And the counter should display correct value after a movie being removed

	Scenario: User can remove a TV show from favorite TV shows
		Given the user is logged in
		And the user has a TV show in their favorite TV show list
		And the user on the profile page favorite TV shows section
		When the user removes the TV show from their favorite TV shows
		Then the TV show should be removed from the user's favorite TV show list
		And the counter should display correct value after a TV show being removed

	Scenario: User can order favorite movies list
		Given the user is logged in
		And the user has multiple movies in their favorite movie list
		And the user is on the profile page favorite movies section
		When the user orders their movies list by a specific criteria
		Then the favorite movies should be displayed in the specified order on the profile page

	Scenario: User can order favorite TV shows list
		Given the user is logged in
		And the user has multiple TV shows in their favorite TV shows list
		And the user is on the profile page facorite TV shows section
		When the user orders their TV shows list by a specific criteria
		Then the favorite TV shows should be displayed in the specified order on the profile page
		 
		 
		
``` 


# ForsecGaming

![alt text](https://github.com/Subasamax/ForsecGaming/blob/f58835b23c700e9b653d0d6d3d2407d72e3f2e95/public/ForsecGamingHeader2.png "LOGO")


## Overview

Forsec Gaming is a game-sharing site like
an arcade site. You can share your game by
uploading the build files to the server and
have it statically served to the users to play!
Users have the option of leaving reviews on
any game uploaded to the website so the
authors can get feedback on their game. 

![alt text](https://github.com/Subasamax/ForsecGaming/blob/f58835b23c700e9b653d0d6d3d2407d72e3f2e95/public/Poster/HomePagePoster.png "Home Page")

Users can see all the games uploaded to the site on the home
page. Each game shows their game photo, title, author username,
and date uploaded. Users can pick and choose what game to play
based on this list. Selecting any game card takes the user to a
separate game page where the description, rating, and reviews
are. As users upload their games, the list gets bigger and takes
up more of the page

![alt text](https://github.com/Subasamax/ForsecGaming/blob/f58835b23c700e9b653d0d6d3d2407d72e3f2e95/public/Poster/GamePagePoster.png "Game Page")


On the game page, users can look at all the details of each game.
Users can read each game's description to get a better idea of
what each game is about. They can also see the rating of the
game which can be an indicator of how well-received the game is.
The review score is calculated based on the average of all ratings
on the game.

![alt text](https://github.com/Subasamax/ForsecGaming/blob/f58835b23c700e9b653d0d6d3d2407d72e3f2e95/public/Poster/ReviewPoster.png "Reviews")

The game page also lets the users leave and see
reviews on the game.

Submitting a review requires the user to be logged in.
The user can select the number of stars for the review,
from 1 to 5, and leave a description of their review that
provides details for why they gave the number of stars
they did.

Each review has the user who submitted the review,
the date the review was submitted, and the amount of
stars they gave the game.

![alt text](https://github.com/Subasamax/ForsecGaming/blob/f58835b23c700e9b653d0d6d3d2407d72e3f2e95/public/Poster/PlayGamePoster.png "Play Game")

Users can play the game through statically
served build files through an Iframe. There is also
the option of turning any game they play into fullscreen mode through the full-screen icon.

![alt text](https://github.com/Subasamax/ForsecGaming/blob/f58835b23c700e9b653d0d6d3d2407d72e3f2e95/public/Poster/PublishGamePoster.png "Game Page")

Users can upload their game through the publish
game page. All it takes is a game name, description,
photo, your build files packaged in a zip file, and
being signed in using your Google account. 


## Languages Used

React - Frontend

Node.js - Backend

Javascript

SQLite3 - Database

CSS

Bootstrap

## Running

**NOTE: To work, you need to have a file called .env in the root folder of the project that has the ClIENT_ID, CLIENT_SECRET, and a STATE. This is for Google Auth purposes. I do not provide this for you.**

To run use `npm install` to install all the packages.
then run `npm run start`

## Notes

Games are not provided and are only for demonstration purposes.



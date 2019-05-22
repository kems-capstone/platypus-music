# PLATYPUS
• A responsive web application allowing users to collaborate on a playlist using: Node.js, React, Redux, React-Redux, Socket.IO, Express, Sequelize, PostgreSQL, Google Cloud, and Semantic-UI.
• Users can create rooms (hosts), or join rooms (guests) where they can interact with the rooms collaborative playlist.
• After hosts name and create the room, the room is assigned a randomly generated secret room key which guests can use to join the room.
• In the room, all users can add song to the playlist using our search form, which will grab Google Cloud API links from our database and queue them on that room’s playlist.  
Only hosts are able to interact with the web player, allowing them to pause and play the playlist, control the volume, and delete queued songs. 
• All users are given the ability to either upvote or downvote a song and see how other guests have voted.  All votes are displayed in real time using Socket.IO.   Users can only vote on a song once.  
• The playlist will automatically re-order placing the song with the highest votes at the top.  The song with the highest votes will always be the next to play.  

# ACCESS: 
Deployed Site: Platypus-music.herokuapp.com

# INSTALLATION:
Clone this project to your local machine
Run 'npm install'
You will need to have Postgres open, create your own database named "platypus", and run 'npm run seed'
Run 'npm run dev-start' and navigate to localhost:8080

# FUTURE GOALS:
Integrating the Spotify API and OAuth so users can search and add music from their Spotify accounts.
Profile pages with the user information and playlist history. 
Recommendations based off past playlist contributions and voting history.
Custom web player with with an updated design and skip functionality.
Silent Mode:  Hosts can create rooms where the music is played through every guest’s phones, allowing all users to listen to the same playlist through their headphones. 
Chat functionality for all users in a room.
Add tests

# BUGS AND ISSUES:
• Sometimes songs will be added and deleted multiple times.
    • This is related to room sockets, and can occur when users interact with multiple rooms in a single session.
    • To solve this we need to implement a function that closes the socket listeners/emitters for a particular user when they leave the room.
 • Need to examine how the GetRoom function works and whether it should be removed in favor of the refresh room function.
    • The GetRoom was replaced in many ways by the RefreshRoom function when we implemented room sockets and persistent voting.
 • On refresh the playlist will change the order and the song playing will change.  Additionally songs with the same amount of votes will shift to alphabetical order by artist.
    •  These are both issues with sockets and how we are retrieving the playlist information in the RefreshRoom function.  This may be best addressed by using a sorting method on the back end or changing how a rooms playlist is stored on the server. 

# TECH USED:

• Javascript
• Node.js
• React
• Redux
• Express
• PostgreSQL
• Socket.io
• Sequlize
• Google Cloud API
• Semantic UI

![Image of myProject](/public/screenShot1.png)
![Image of myProject](/public/screenShot2.png)
![Image of myProject](/public/screenShot3.png)

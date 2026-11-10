Riddle Game - JavaScript Terminal Project
A terminal game that asks the player riddles, measures how long each riddle took, and shows statistics at the end.

This repository is a template. The folders and files are ready, and every file has a comment that describes what should be written in it. Write all the code yourself.

Getting started
Clone this repository.
Run npm install (this installs prompt-sync).
Fill in each file according to the comment inside it.
Run the game with node app.js directly in the terminal (not through a piped command).
Folder structure
riddle-game/
├── app.js
├── package.json
├── riddles/
│   ├── index.js
│   ├── r1.js
│   ├── r2.js
│   ├── r3.js
│   ├── r4.js
│   └── r5.js
└── classes/
    ├── Riddle.js
    └── Player.js
Tasks
Riddle files
Task 1: Create the riddles (riddles/r1.js to riddles/r5.js)

Each file exports a riddle object with id, name, taskDescription and correctAnswer.
Example:
// riddles/r1.js
export default {
  id: 1,
  name: "Easy Math",
  taskDescription: "What is 5 + 3?",
  correctAnswer: "8"
};
Write 5 riddles of your own.
Task 2: Load all riddles at once (riddles/index.js)

Import all five riddles and export them together as one array.
Classes
Task 3: The Riddle class (classes/Riddle.js)

Properties: id, name, taskDescription, correctAnswer.
Method ask(prompt):
Show the riddle.
Ask for user input.
Keep asking until the correct answer is given.
Task 4: The Player class (classes/Player.js)

Properties: name, times[] (array of time durations per riddle).
Methods:
recordTime(start, end)
showStats() - show total and average time.
Game logic (app.js)
Task 5: Set up terminal input

Install prompt-sync (already listed in package.json, so npm install is enough).
Set it up:
import PromptSync from 'prompt-sync';
const prompt = PromptSync();
Task 6: Ask for the player name

Show a welcome message.
Use prompt to ask: "What is your name?"
Create a Player object with the name.
Task 7: Use all the riddles

In app.js, import the array from riddles/index.js.
Task 8: Main game loop

Loop through all riddles:
Record startTime with Date.now().
Create a Riddle object and call ask().
Record endTime.
Save the time using player.recordTime().
Task 9: Show final stats

After all riddles:
Show total time.
Show average time per riddle.
Bonus (optional)
Task 10: Multiple choice riddles

Create a MultipleChoiceRiddle class that inherits from Riddle.
Add a choices[] property.
Show numbered options.
Accept numeric input and compare it to the correct answer.
Create the file classes/MultipleChoiceRiddle.js yourself.
Final deliverables
Project folders and files ready.
5 riddles defined.
Working Riddle and Player classes.
app.js runs the full game.
Terminal input with prompt-sync.
Time tracking for each riddle.
Final stats display.
Optional: multiple choice riddles.
Part 2: Database & New Features
We are improving the Riddle Game: the riddles and the players will be saved in a database, and the game gets a main menu, CRUD options for riddles, a "time to beat" and a leaderboard.

The database is a local server called json-server. It reads one file, db.json, and turns every array in it into an API address. Your code talks to it only with fetch, exactly like any other API (GET, POST, PUT, DELETE).

Getting started (Part 2)
Install json-server (once):
npm install json-server@0.17.4
Add a script to package.json:
"scripts": {
  "server": "json-server --watch db.json --port 3000"
}
Open two terminals:

Terminal 1: npm run server (keep it open, this is the database).
Terminal 2: node app.js (the game).
Check that the server works: open http://localhost:3000/riddles in the browser. You should see your riddles as JSON.

New folder structure
riddle-game/
├── app.js
├── db.json            <- new: the database
├── package.json
├── api/               <- new: all the fetch calls
│   ├── riddlesApi.js
│   └── playersApi.js
└── classes/
    ├── Riddle.js
    └── Player.js
The riddles/ folder is not needed anymore. The riddles now live in db.json.

The API
json-server gives you these addresses automatically:

Method	Address	What it does
GET	/riddles	Get all riddles
GET	/riddles/1	Get the riddle with id 1
POST	/riddles	Add a new riddle (json-server creates the id by itself)
PUT	/riddles/1	Replace the riddle with id 1
DELETE	/riddles/1	Delete the riddle with id 1
GET	/players?name=Yishai	Find players by name (returns an array)
The same addresses exist for /players.

Remember:

fetch returns a Promise. Use async / await (or .then()).
Check res.ok. fetch does not throw an error on 404 or 500.
For POST and PUT send headers: { "Content-Type": "application/json" } and body: JSON.stringify(...).
Use try / catch, so the game shows a clear message if the server is not running.
app.js is an ES module, so you can use await directly at the top level of the file.
Tasks
Task 11: Riddle database (db.json)

Move all your riddles from r1.js ... r5.js into one file, as an array of objects.
Example:
{
  "riddles": [
    {
      "id": 1,
      "name": "Easy Math",
      "taskDescription": "What is 5 + 3?",
      "correctAnswer": "8"
    },
    {
      "id": 2,
      "name": "Riddle of Sound",
      "taskDescription": "I speak without a mouth. What am I?",
      "correctAnswer": "echo"
    }
  ],
  "players": []
}
db.json must be valid JSON (double quotes, no comma after the last item).
Delete the riddles/ folder and load the riddles from the server instead.
Task 12: Riddles API (api/riddlesApi.js)

Write and export an async function for every action:
getAllRiddles()
createRiddle(riddle)
updateRiddle(id, riddle)
deleteRiddle(id)
Each function uses fetch with the right method and returns the data from the server.
Task 13: Main menu (app.js)

Show a menu and keep showing it until the player chooses to exit:
What do you want to do?
1. Play the game
2. Create a new riddle
3. Read all riddles
4. Update an existing riddle
5. Delete a riddle
6. View leaderboard
0. Exit
Task 14: Riddle CRUD options

Option	Description
Create	Ask for name, description and answer, and add the new riddle to the DB
Read	Show all riddles in the DB
Update	Ask for an ID and change the details of that riddle
Delete	Ask for an ID and remove that riddle
Example - creating a new riddle:
Enter riddle name: Hard Math
Enter description: What is 12 x 12?
Enter correct answer: 144
Riddle saved!
Task 15: Player database (db.json + api/playersApi.js)

The players array in db.json keeps every player and their best time (in seconds):
"players": [
  { "id": 1, "name": "Yishai", "lowestTime": 72 },
  { "id": 2, "name": "Sarah", "lowestTime": 65 }
]
In api/playersApi.js write and export:
findPlayerByName(name) - returns the player, or undefined if there is no such player
createPlayer(name) - adds a new player with lowestTime: null
updatePlayer(player) - saves the player's new lowestTime
getAllPlayers()
Task 16: Show "Time to Beat"

When a player starts a game:
Check if they already exist in the players DB.
If they do and they have a time, show:
Hi Yishai! Your previous lowest time was 72 seconds.
If not, add them to the DB with no lowestTime yet (null).
Task 17: Update player time

After finishing the game:
If the player has no recorded time, save their time.
If their current time is lower than their saved lowestTime, update it.
Example:
Great job, Yishai!
Your time: 68 seconds
New record! Time updated.
Task 18: Leaderboard (menu option 6)

Load all players from the DB.
Skip players who never finished a game (lowestTime is null).
Sort by lowestTime ascending (fastest first).
Show the results:
🏆 Leaderboard:
1. Sarah - 65 seconds
2. Yishai - 68 seconds
Part 2 deliverables
All riddles in one database file (db.json), served by json-server.
All database actions done with fetch from the api/ folder.
A main menu with CRUD options for riddles.
A player database.
"Time to beat" shown before playing.
The player's best time updated after playing.
A leaderboard sorted by best time.
Part 3: Server Refactor with Express
Until now json-server was the database server. In Part 3 you write your own server with Express and stop using json-server.

The game in the terminal becomes the client: it shows the menu, asks the player for input, and sends HTTP requests with fetch, exactly like in Part 2. The server gets the requests, reads and writes the database file, and sends back JSON.

The database stays the same db.json from Part 2, with the riddles and players arrays. Only the server that reads it changes.

Client (app.js)  --fetch-->  Express server (server.js)  -->  routes (riddles.js / players.js)  -->  read / write db.json
       ^                                                                                                    |
       +----------------------------------------- JSON response -----------------------------------------+
Getting started (Part 3)
Stop json-server (Ctrl + C in its terminal) and remove it:
npm uninstall json-server
Install Express:
npm install express
Change the scripts in package.json:
"scripts": {
  "server": "node server/server.js",
  "start": "node client/app.js"
}
Open two terminals, like in Part 2:

Terminal 1: npm run server (keep it open, this is your server).
Terminal 2: npm start (the game).
Check that the server works: open http://localhost:3000/api/riddles in the browser. You should see your riddles as JSON.

New folder structure
Move the files into two folders, client and server. The folder structure is optional, but the tasks below use it.

riddle-game/
├── package.json
├── client/
│   ├── app.js              <- the terminal menu, sends HTTP requests
│   ├── api/
│   │   ├── riddlesApi.js
│   │   └── playersApi.js
│   └── classes/
│       ├── Riddle.js
│       └── Player.js
└── server/
    ├── server.js           <- the Express server
    ├── routes/
    │   ├── riddles.js
    │   └── players.js
    └── db/
        ├── db.json         <- moved here from Part 2 (riddles + players)
        └── dbHelpers.js    <- readDb() and writeDb()
Move app.js, api/ and classes/ together into client/, so the imports inside them keep working.

The server API
Your server must answer these requests. All addresses start with /api.

Method	Endpoint	Description
GET	/api/riddles	Get all riddles
GET	/api/riddles/:id	Get one riddle by ID (404 if it does not exist)
POST	/api/riddles	Add a new riddle (the server creates the id)
PUT	/api/riddles/:id	Update a riddle by ID (404 if it does not exist)
DELETE	/api/riddles/:id	Delete a riddle by ID (404 if it does not exist)
GET	/api/players	Get all players
GET	/api/players?name=Yishai	Find players by name (returns an array)
POST	/api/players	Add a new player (lowestTime: null)
PUT	/api/players/:id	Update the player's best time
These are the same requests json-server answered in Part 2, with /api at the start. That is why the client almost does not change.

Tasks
Server side
Task 19: Create the Express app (server/server.js)

Create the app with express().
Add app.use(express.json()), so the server can read the JSON body of POST and PUT requests.
Connect the routers: /api/riddles to routes/riddles.js and /api/players to routes/players.js.
Listen on port 3000 and print Server is running on http://localhost:3000.
Task 20: Read and write the database (server/db/dbHelpers.js)

Write and export two async functions with fs.promises (import fs from 'fs/promises'):
readDb() - reads db.json and returns the object (JSON.parse).
writeDb(db) - saves the object back to db.json (JSON.stringify(db, null, 2)).
The routes always read the whole file, change the right array (db.riddles or db.players), and write the whole file back.
Task 21: Riddles routes (server/routes/riddles.js)

Create a router with express.Router() and export it.
Add a route for every riddles row in the table above.
req.params.id is a string, so convert it with Number() before you compare it to id.
POST: the new id is the biggest id in the array + 1. Answer with status 201 and the new riddle.
PUT and DELETE: if there is no riddle with this id, answer with status 404 and { "error": "Riddle not found" }.
Task 22: Players routes (server/routes/players.js)

Create a router with express.Router() and export it.
GET /: if there is a name in the query (req.query.name), return only the players with that name. Otherwise return all players.
POST /: add { id, name, lowestTime: null }, answer with status 201 and the new player.
PUT /:id: save the player's new lowestTime, or answer 404 if the player does not exist.
Client side
Task 23: Connect the client to your server (client/api/riddlesApi.js, client/api/playersApi.js)

Change the addresses:
http://localhost:3000/riddles → http://localhost:3000/api/riddles
http://localhost:3000/players → http://localhost:3000/api/players
The rest of the client stays the same: the menu, the game, and the fetch calls with res.ok checks.
Check every menu option again: play, create, read, update, delete, and the leaderboard.
Bonus (optional)
Task 24: Validation on the server

POST and PUT /api/riddles: if name, taskDescription or correctAnswer is missing, answer with status 400 and { "error": "..." }, and do not save.
POST /api/players: if name is missing, answer with status 400.
Part 3 deliverables
json-server is removed, and an Express server runs with npm run server.
client/ and server/ folders.
All the routes in the table above, reading and writing db.json with fs.promises.
404 answers for an ID that does not exist.
The client works exactly like in Part 2, only through your own server.

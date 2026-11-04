import PromptSync from "prompt-sync";
import Player from "./classes/Player.js";
import MultipleChoiceRiddle from "./classes/MultipleChoiceRiddle.js";
import {
  getAllRiddles,
  createRiddle,
  updateRiddle,
  deleteRiddle,
} from "./api/riddlesApi.js";
import {
  findPlayerByName,
  createPlayer,
  updatePlayer,
  getAllPlayers,
} from "./api/playersApi.js";


const prompt = PromptSync();


function showMenu() {
  console.log(`
What do you want to do?
1. Play the game
2. Create a new riddle
3. Read all riddles
4. Update an existing riddle
5. Delete a riddle
6. View leaderboard
0. Exit`);
}


async function updatePlayerTime(player, newTime) {
  console.log(`Great job, ${player.name}!`);
  console.log(`Your time: ${newTime} seconds`);


  if (player.lowestTime === null || newTime < player.lowestTime) {
    player.lowestTime = newTime;
    await updatePlayer(player);
    console.log("New record! Time updated.");
  }
}


async function playGame() {
  const name = prompt("What is your name? ");


  let dbPlayer = await findPlayerByName(name);
  if (!dbPlayer) {
    dbPlayer = await createPlayer(name);
    console.log(`Hi ${name}, welcome to the game!`);
  } else if (dbPlayer.lowestTime != null) {
    console.log(
      `Hi ${name}! Your previous lowest time was ${dbPlayer.lowestTime} seconds.`
    );
  }


  const arrRiddle = await getAllRiddles();


  const validLevels = ["easy", "medium", "hard"];
  let level = prompt("Choose difficulty: easy / medium / hard: ");
  while (!validLevels.includes(level)) {
    console.log("Invalid level, try again.");
    level = prompt("Choose difficulty: easy / medium / hard: ");
  }


  const filteredRiddles = arrRiddle.filter((r) => r.difficulty === level);
  console.log(`You chose ${level}`);
  console.log(`Number of riddles: ${filteredRiddles.length}`);
  if (filteredRiddles.length === 0) {
    console.log("No riddles for this level.");
    return;
  }
  filteredRiddles.sort(() => Math.random() - 0.5);


  const PENALTY_SECONDS = 5;
  let totalSeconds = 0;


  for (const r of filteredRiddles) {
    const startTime = Date.now();
    const riddle = new MultipleChoiceRiddle(
      r.id,
      r.name,
      r.taskDescription,
      r.correctAnswer,
      r.choices,
      r.hint,
    );
    const hintPenaltySeconds = riddle.ask(prompt);
    const end = Date.now();
    const secondsTaken = (end - startTime) / 1000;
    let penaltySeconds = hintPenaltySeconds;
    if (secondsTaken > r.timeLimit) {
      console.log(`Too slow! ${PENALTY_SECONDS} seconds penalty applied.`);
      penaltySeconds += PENALTY_SECONDS;
    } else {
      console.log(`You did it in ${secondsTaken}s`);
    }
    totalSeconds += secondsTaken + penaltySeconds;
  }


  await updatePlayerTime(dbPlayer, Math.round(totalSeconds));
}


async function createNewRiddle() {
  const name = prompt("Enter riddle name: ");
  const taskDescription = prompt("Enter description: ");
  const correctAnswer = prompt("Enter correct answer: ");
  await createRiddle({ name, taskDescription, correctAnswer });
  console.log("Riddle added!");
}


async function readAllRiddles() {
  const riddles = await getAllRiddles();
  for (const r of riddles) {
    console.log(`${r.id}. ${r.name} - ${r.taskDescription}`);
  }
}


async function updateExistingRiddle() {
  const id = prompt("Riddle id to update: ");
  const name = prompt("New name: ");
  const taskDescription = prompt("New description: ");
  const correctAnswer = prompt("New answer: ");
  await updateRiddle(id, { id: Number(id), name, taskDescription, correctAnswer });
  console.log("Riddle updated!");
}


async function deleteExistingRiddle() {
  const id = prompt("Riddle id to delete: ");
  await deleteRiddle(id);
  console.log("Riddle deleted!");
}


async function viewLeaderboard() {
  const players = await getAllPlayers();
  const finished = players.filter((p) => p.lowestTime !== null);
  finished.sort((a, b) => a.lowestTime - b.lowestTime);


  console.log("🏆Leaderboard:");
  finished.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} - ${p.lowestTime} seconds`);
  });
}


let running = true;
while (running) {
  showMenu();
  const choice = prompt("Enter number: ");
  switch (choice) {
    case "1": await playGame(); break;
    case "2": await createNewRiddle(); break;
    case "3": await readAllRiddles(); break;
    case "4": await updateExistingRiddle(); break;
    case "5": await deleteExistingRiddle(); break;
    case "6": await viewLeaderboard(); break;
    case "0": running = false; console.log("Bye!"); break;
  }
}
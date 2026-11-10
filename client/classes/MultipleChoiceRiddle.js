import Riddle from "./Riddle.js";
  const HINT_PENALTY_SECONDS = 10;

export default class MultipleChoiceRiddle extends Riddle {
  constructor(id, name, taskDescription, correctAnswer, choices, hint) {
    super(id, name, taskDescription, correctAnswer, hint);
    this.choices = choices;
  }

  ask(prompt) {
    console.log(`${this.name}: ${this.taskDescription} `);
    this.choices.forEach((c, i) => console.log(`${i + 1}. ${c}`));
    let penaltySeconds = 0;
    let hintUsed = false;
    let answer = prompt("your answer (or type 'hint'):");
    while (answer !== this.correctAnswer) {
      if (answer === "hint") {
        if (!this.hint) {
          console.log("No hint available for this riddle.");
        } else if (hintUsed) {
          console.log(`Hint: ${this.hint}`);
        } else {
          console.log(`Hint: ${this.hint} (+10 seconds penalty)`);
          penaltySeconds += HINT_PENALTY_SECONDS;
          hintUsed = true;
        }
      } else {
        console.log("Wrong, try again.");
      }
      answer = prompt("Your answer (number or 'hint'): ");
    }

    console.log("Correct!");
    console.log("--------------------------");
    return penaltySeconds;
  }
}

// The Riddle class. Export it as the default export.
//
// Properties (received in the constructor):
// - id
// - name
// - taskDescription
// - correctAnswer
//
// Method:
// - ask(prompt)
//   - show the riddle (name and taskDescription) to the player
//   - ask the player for an answer using the `prompt` function that is passed in
//   - keep asking until the answer is correct
export default class Riddle {
  constructor(id, name, taskDescription, correctAnswer, hint) {
    this.id = id;
    this.name = name;
    this.taskDescription = taskDescription;
    this.correctAnswer = correctAnswer;
    this.hint = hint;
  }
  ask(prompt) {
    console.log(`${this.name}: ${this.taskDescription} `);
    let hintask = false;
    let answer = prompt("your answer (or type 'hint'):");
    while (answer !== this.correctAnswer) {
      if (answer === "hint") {
        if (!this.hint) {
          console.log("No hint available for this riddle.");
        } else if (hintask) {
          console.log(`Hint: ${this.hint}`);
        } else {
          console.log(`Hint: ${this.hint} (+10 seconds penalty)`);
          penaltySeconds += 10;
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

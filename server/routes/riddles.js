import { Router } from "express";
import { readFile, writeFile } from "../db/dbHelpers.js";

const router = Router();

function getRiddleValidationError(data) {
  const {
    name,
    taskDescription,
    correctAnswer,
    choices,
    difficulty,
    timeLimit,
    hint,
  } = data ?? {};
  const answerIndex = Number(correctAnswer);
  const hasCorrectAnswer =
    (typeof correctAnswer === "string" && correctAnswer.trim() !== "") ||
    typeof correctAnswer === "number";

  if (typeof name !== "string" || !name.trim()) {
    return "Name is required.";
  }
  if (typeof taskDescription !== "string" || !taskDescription.trim()) {
    return "Task description is required.";
  }
  if (!Array.isArray(choices) || choices.length < 2) {
    return "Enter at least two comma-separated choices.";
  }
  if (!choices.every((choice) => typeof choice === "string" && choice.trim())) {
    return "Choices cannot be empty.";
  }
  if (
    !hasCorrectAnswer ||
    !Number.isInteger(answerIndex) ||
    answerIndex < 1 ||
    answerIndex > choices.length
  ) {
    return `Correct answer must be a choice number from 1 to ${choices.length}.`;
  }
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return "Difficulty must be easy, medium, or hard (lowercase).";
  }
  if (!Number.isInteger(timeLimit) || timeLimit <= 0) {
    return "Time limit must be a positive whole number of seconds.";
  }
  if (hint !== undefined && typeof hint !== "string") {
    return "Hint must be text.";
  }
  return null;
}

function formatRiddle(data, id) {
  return {
    id,
    name: data.name.trim(),
    taskDescription: data.taskDescription.trim(),
    correctAnswer: String(Number(data.correctAnswer)),
    choices: data.choices.map((choice) => choice.trim()),
    difficulty: data.difficulty,
    timeLimit: data.timeLimit,
    ...(data.hint?.trim() ? { hint: data.hint.trim() } : {}),
  };
}

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

router.get("/", async (req, res) => {
  try {
    const db = await readFile();
    res.json(db.riddles);
  } catch (error) {
    console.error("Could not read riddles:", error);
    res.status(500).json({ error: "Could not load riddles" });
  }
});

router.get("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Riddle id must be a positive integer" });
  }

  try {
    const db = await readFile();
    const riddle = db.riddles.find((item) => item.id === id);
    if (!riddle) {
      return res.status(404).json({ error: "Riddle not found" });
    }
    res.json(riddle);
  } catch (error) {
    console.error("Could not read riddle:", error);
    res.status(500).json({ error: "Could not load riddle" });
  }
});

router.post("/", async (req, res) => {
  const validationError = getRiddleValidationError(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const db = await readFile();
    const id = db.riddles.reduce(
      (maxId, riddle) => Math.max(maxId, riddle.id),
      0
    ) + 1;
    const riddle = formatRiddle(req.body, id);
    db.riddles.push(riddle);
    await writeFile(db);
    res.status(201).json(riddle);
  } catch (error) {
    console.error("Could not create riddle:", error);
    res.status(500).json({ error: "Could not create riddle" });
  }
});

router.put("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Riddle id must be a positive integer" });
  }

  try {
    const db = await readFile();
    const index = db.riddles.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Riddle not found" });
    }
    const validationError = getRiddleValidationError(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const updatedRiddle = formatRiddle(req.body, id);
    db.riddles[index] = updatedRiddle;
    await writeFile(db);
    res.json(updatedRiddle);
  } catch (error) {
    console.error("Could not update riddle:", error);
    res.status(500).json({ error: "Could not update riddle" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Riddle id must be a positive integer" });
  }

  try {
    const db = await readFile();
    const index = db.riddles.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Riddle not found" });
    }

    const [deletedRiddle] = db.riddles.splice(index, 1);
    await writeFile(db);
    res.json(deletedRiddle);
  } catch (error) {
    console.error("Could not delete riddle:", error);
    res.status(500).json({ error: "Could not delete riddle" });
  }
});

export default router;

import { Router } from "express";
import { readFile, writeFile } from "../db/dbHelpers.js";

const router = Router();

function isValidRiddle(data) {
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

  return (
    typeof name === "string" && Boolean(name.trim()) &&
    typeof taskDescription === "string" && Boolean(taskDescription.trim()) &&
    Array.isArray(choices) && choices.length >= 2 &&
    choices.every((choice) => typeof choice === "string" && Boolean(choice.trim())) &&
    hasCorrectAnswer &&
    Number.isInteger(answerIndex) && answerIndex >= 1 && answerIndex <= choices.length &&
    ["easy", "medium", "hard"].includes(difficulty) &&
    Number.isInteger(timeLimit) && timeLimit > 0 &&
    (hint === undefined || typeof hint === "string")
  );
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
  if (!isValidRiddle(req.body)) {
    return res.status(400).json({ error: "Invalid riddle data" });
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
    if (!isValidRiddle(req.body)) {
      return res.status(400).json({ error: "Invalid riddle data" });
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

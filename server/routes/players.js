import express from "express";
import { readFile, writeFile } from "../db/dbHelpers.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = await readFile();
    const { name } = req.query;
    const players = name
      ? db.players.filter((player) => player.name === name)
      : db.players;
    res.json(players);
  } catch (error) {
    console.error("Could not read players:", error);
    res.status(500).json({ error: "Could not load players" });
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body ?? {};
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Player name is required" });
  }

  try {
    const db = await readFile();
    const id = db.players.reduce(
      (maxId, player) => Math.max(maxId, player.id),
      0
    ) + 1;
    const player = { id, name: name.trim(), lowestTime: null };
    db.players.push(player);
    await writeFile(db);
    res.status(201).json(player);
  } catch (error) {
    console.error("Could not create player:", error);
    res.status(500).json({ error: "Could not create player" });
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Player id must be a positive integer" });
  }

  const { lowestTime } = req.body ?? {};
  if (
    lowestTime !== null &&
    (typeof lowestTime !== "number" || !Number.isFinite(lowestTime) || lowestTime < 0)
  ) {
    return res.status(400).json({ error: "lowestTime must be a non-negative number or null" });
  }

  try {
    const db = await readFile();
    const player = db.players.find((item) => item.id === id);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    player.lowestTime = lowestTime;
    await writeFile(db);
    res.json(player);
  } catch (error) {
    console.error("Could not update player:", error);
    res.status(500).json({ error: "Could not update player" });
  }
});

export default router ;
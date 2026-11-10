import express from "express";
import riddlesRouter from "./routes/riddles.js";
import playersRouter from "./routes/players.js";

const app = express();

app.use(express.json());
app.use("/api/riddles", riddlesRouter);
app.use("/api/players", playersRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
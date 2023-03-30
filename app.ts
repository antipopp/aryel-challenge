import express from "express";
import mongoose from "mongoose";
import path from "path";
import { MemoryGameResult } from "./db/schema";

const app = express();

mongoose.connect(
  "mongodb+srv://root:root@challenge.hrafmpb.mongodb.net/?retryWrites=true&w=majority"
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/save", async (req, res) => {
  try {
    const { nickname, time } = req.body;
    const existing = await MemoryGameResult.findOne({ nickname });
    if (existing && existing.time < time) {
      res.status(200).send("Click quicker next time! Your score is not good enough to be saved.");
      return;
    } else if (existing) {
      await existing.deleteOne();
    }

    const memoryGameResult = new MemoryGameResult({ nickname, time });
    await memoryGameResult.save();
    res.status(201).send(memoryGameResult);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to get the full ranking
app.get("/leaderboard", async (req, res) => {
  try {
    const perPage = 10; // number of results per page
    const page = parseInt(req.query.page as string) || 1; // page number (starts from 1)
    const limit = perPage;
    const offset = (page - 1) * limit;

    const results = await MemoryGameResult.find()
      .sort({ time: 1, createdAt: 1 })
      .skip(offset)
      .limit(limit);

    const count = await MemoryGameResult.countDocuments();
    const totalPages = Math.ceil(count / perPage);

    res.render("leaderboard", {
      results,
      currentPage: page,
      totalPages,
      offset,
      limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to get the ranking of a player and surrounding players
app.get("/search/:nickname", async (req, res) => {
  try {
    const nickname = req.params.nickname;
    const perPage = 7;
    const player = await MemoryGameResult.findOne({ nickname }).exec();
    if (!player) {
      return res.status(404).send("Player not found");
    }
    const playerRank = await MemoryGameResult.countDocuments({ time: { $lt: player.time } }) + 1;
    const startRank = Math.max(1, playerRank - 3);
    const endRank = startRank + perPage - 1;
    const leaderboard = await MemoryGameResult.find()
      .sort({ time: 1, createdAt: 1 })
      .skip(startRank - 1)
      .limit(perPage);
    res.render("player", {
      player,
      playerRank,
      leaderboard,
      startRank,
      endRank,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

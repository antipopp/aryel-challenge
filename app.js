"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const schema_1 = require("./db/schema");
const app = (0, express_1.default)();
mongoose_1.default.connect("mongodb+srv://root:root@challenge.hrafmpb.mongodb.net/?retryWrites=true&w=majority");
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected to MongoDB");
});
app.set("view engine", "ejs");
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public", "index.html"));
});
app.post("/api/save", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nickname, time } = req.body;
        const existing = yield schema_1.MemoryGameResult.findOne({ nickname });
        if (existing && existing.time < time) {
            res.status(200).send("Click quicker next time! Your score is not good enough to be saved.");
            return;
        }
        else if (existing) {
            yield existing.deleteOne();
        }
        const memoryGameResult = new schema_1.MemoryGameResult({ nickname, time });
        yield memoryGameResult.save();
        res.status(201).send(memoryGameResult);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));
// Route to get the full ranking
app.get("/leaderboard", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const perPage = 10; // number of results per page
        const page = parseInt(req.query.page) || 1; // page number (starts from 1)
        const limit = perPage;
        const offset = (page - 1) * limit;
        const results = yield schema_1.MemoryGameResult.find()
            .sort({ time: 1, createdAt: 1 })
            .skip(offset)
            .limit(limit);
        const count = yield schema_1.MemoryGameResult.countDocuments();
        const totalPages = Math.ceil(count / perPage);
        res.render("leaderboard", {
            results,
            currentPage: page,
            totalPages,
            offset,
            limit,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));
// Route to get the ranking of a player and surrounding players
app.get("/search/:nickname", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nickname = req.params.nickname;
        const perPage = 7;
        const player = yield schema_1.MemoryGameResult.findOne({ nickname }).exec();
        if (!player) {
            return res.status(404).send("Player not found");
        }
        const playerRank = (yield schema_1.MemoryGameResult.countDocuments({ time: { $lt: player.time } })) + 1;
        const startRank = Math.max(1, playerRank - 3);
        const endRank = startRank + perPage - 1;
        const leaderboard = yield schema_1.MemoryGameResult.find()
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
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

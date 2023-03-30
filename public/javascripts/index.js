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
const input = document.getElementById("nickname");
const startBtn = document.getElementById("start-btn");
const endBtn = document.getElementById("end-btn");
const timer = document.getElementById("timer");
if (!startBtn)
    throw new Error("Start button not found");
if (!endBtn)
    throw new Error("End button not found");
if (!timer)
    throw new Error("Timer not found");
if (!input)
    throw new Error("Input not found");
const gameState = {
    nickname: "",
    time: 0.0,
};
const startGame = () => {
    gameState.nickname = input.value;
    if (gameState.nickname === "") {
        showError("Nickname cannot be empty");
        return;
    }
    gameState.time = 0.0;
    timer.innerText = "0.0";
    startBtn.disabled = true;
    endBtn.disabled = false;
    input.disabled = true;
    const interval = setInterval(() => {
        if (gameState.time >= 30) {
            clearInterval(interval);
            endBtn.disabled = true;
            startBtn.disabled = false;
            input.disabled = false;
            saveScore();
            return;
        }
        gameState.time += 0.1;
        timer.innerText = gameState.time.toFixed(2).toString();
    }, 100);
    endBtn.addEventListener("click", () => {
        clearInterval(interval);
        endBtn.disabled = true;
        startBtn.disabled = false;
        input.disabled = false;
        saveScore();
    });
};
const saveScore = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("/api/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(gameState),
    });
    if (response.status === 201) {
        showSuccess("Score saved successfully");
        reset();
    }
    else {
        showError(yield response.text());
        reset();
    }
});
const reset = () => {
    gameState.nickname = "";
    gameState.time = 0.0;
    timer.innerText = "0.0";
    startBtn.disabled = false;
    endBtn.disabled = true;
    input.disabled = false;
};
const showError = (message) => {
    const errorBox = document.getElementById("error-box");
    if (errorBox) {
        errorBox.innerText = message;
        errorBox.style.display = "block";
        setInterval(() => {
            errorBox.innerText = "";
            errorBox.style.display = "none";
        }, 3000);
    }
};
const showSuccess = (message) => {
    const successBox = document.getElementById("success-box");
    if (successBox) {
        successBox.innerText = message;
        successBox.style.display = "block";
        setInterval(() => {
            successBox.innerText = "";
            successBox.style.display = "none";
        }, 3000);
    }
};
startBtn.addEventListener("click", startGame);

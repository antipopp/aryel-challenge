const input = document.getElementById("nickname") as HTMLInputElement | null;
const startBtn = document.getElementById(
  "start-btn"
) as HTMLButtonElement | null;
const endBtn = document.getElementById("end-btn") as HTMLButtonElement | null;
const timer = document.getElementById("timer") as HTMLSpanElement | null;

if (!startBtn) throw new Error("Start button not found");
if (!endBtn) throw new Error("End button not found");
if (!timer) throw new Error("Timer not found");
if (!input) throw new Error("Input not found");

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

const saveScore = async () => {
  const response = await fetch("/api/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gameState),
  });
  if (response.status === 201) {
    showSuccess("Score saved successfully");
    reset();
  } else {
    showError(await response.text());
    reset();
  }
};

const reset = () => {
  gameState.nickname = "";
  gameState.time = 0.0;
  timer.innerText = "0.0";
  startBtn.disabled = false;
  endBtn.disabled = true;
  input.disabled = false;
};

const showError = (message: string) => {
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

const showSuccess = (message: string) => {
    const successBox = document.getElementById("success-box");
    if (successBox) {
        successBox.innerText = message;
        successBox.style.display = "block";
        
        setInterval(() => {
            successBox.innerText = "";
            successBox.style.display = "none";
        }, 3000);
    }
}

startBtn.addEventListener("click", startGame);

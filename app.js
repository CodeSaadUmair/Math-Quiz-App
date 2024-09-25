const questionElement = document.querySelector(".question");

const formElement = document.getElementById("questionForm");

const scoreElement = document.querySelector(".score");

const highScoreElement = document.getElementById("highScore");

const timerElement = document.getElementById("time");

const difficultyElement = document.getElementById("difficulty");

const cardElement = document.querySelector(".card");

let finalAnswer;

let score = 0;

let highScore = localStorage.getItem("highScore") || 0;

let timerInterval;

highScoreElement.innerText = highScore;

function minMax(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateQuestion() {
  const difficulty = difficultyElement.value;
  let number1, number2;

  switch (difficulty) {
    case "easy":
      number1 = minMax(1, 20);
      number2 = minMax(1, 20);
      break;
    case "medium":
      number1 = minMax(20, 100);
      number2 = minMax(20, 100);
      break;
    case "hard":
      number1 = minMax(100, 500);
      number2 = minMax(100, 500);
      break;
  }

  const type = ["+", "-", "*", "/"];
  const randomType = type[minMax(0, type.length - 1)];
  let question;
  let answer;

  switch (randomType) {
    case "+":
      question = `Q. What Is ${number1} + ${number2} ?`;
      answer = number1 + number2;
      break;

    case "-":
      question = `Q. What Is ${number1} - ${number2} ?`;
      answer = number1 - number2;
      break;

    case "*":
      question = `Q. What Is ${number1} * ${number2} ?`;
      answer = number1 * number2;
      break;

    case "/":
      const dividend = number1 * number2;
      question = `Q. What is ${dividend} / ${number2}?`;
      answer = dividend / number2;
      break;
  }

  return { question, answer };
}

function showQuestion() {
  const { question, answer } = generateQuestion();
  questionElement.innerHTML = question;
  finalAnswer = answer;
}
showQuestion();

function startTimer(duration) {
  let timer = duration;
  timerInterval = setInterval(() => {
    timerElement.textContent = timer;
    if (--timer < 0) {
      clearInterval(timerInterval);
      disableForm();
    }
  }, 1000);
}

function disableForm() {
  document.getElementById("ans").disabled = true;
  document.getElementById("sub-btn").disabled = true;
  questionElement.innerHTML = `<span style="color:red; font-weight: bold;">Time's up! Try again?</span>`;
  const restartButton = document.createElement("button");
  restartButton.innerText = "Restart";
  restartButton.className = "restart-btn";
  restartButton.onclick = restartGame;
  formElement.appendChild(restartButton);
}

function restartGame() {
  document.getElementById("ans").disabled = false;
  document.getElementById("sub-btn").disabled = false;
  formElement.removeChild(document.querySelector(".restart-btn"));
  score = 0;
  scoreElement.innerText = score;
  showQuestion();
  resetTimer();
}

function resetTimer() {
  clearInterval(timerInterval);
  startTimer(30);
}

function checkAnswer(event) {
  event.preventDefault();

  const formData = new FormData(formElement);
  const userAnswer = Number(formData.get("ans"));

  if (finalAnswer == userAnswer) {
    score += 1;
    cardElement.style.boxShadow = "0 0 15px 4px rgba(0, 255, 0, 0.6)";
    document.getElementById("ans").classList.remove("input-error");
  } else {
    score -= 1;
    cardElement.style.boxShadow = "0 0 15px 4px rgba(255, 0, 0, 0.6)";
    document.getElementById("ans").classList.add("input-error");
  }

  event.target.reset();
  scoreElement.innerText = score;

  if (score > highScore) {
    highScore = score;
    highScoreElement.innerText = highScore;
    localStorage.setItem("highScore", highScore);
  }

  setTimeout(() => {
    cardElement.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.1)";
  }, 1500);

  showQuestion();
  resetTimer();
}

startTimer(30);

const quiz = [
  {
    question: "Question 1",
    options: ["X", "Y", "Z"],
    answer: "Z",
    penaltyTime: 10,
  },
  {
    question: "Question 2",
    options: ["A", "B", "C"],
    answer: "C",
    penaltyTime: 10,
  },
  {
    question: "Question 3",
    options: ["D", "E", "F"],
    answer: "F",
    penaltyTime: 10,
  },
  {
    question: "Question 4",
    options: ["G", "H", "I"],
    answer: "I",
    penaltyTime: 10,
  },
  {
    question: "Question 5",
    options: ["J", "K", "L"],
    answer: "L",
    penaltyTime: 10,
  },
];

let players = [];

let currentTime;
let clock;

function createTimerClock(duration) {
  let seconds;
  let time = duration;
  const display = document.getElementById("time");

  return setInterval(() => {
    seconds = parseInt(time % 60, 10);
    if (seconds > 0) {
      currentTime = seconds < 10 ? `0${seconds}` : seconds;
      seconds = `Time: ${currentTime} Seconds`;
    } else {
      currentTime = 0;
      seconds = 0;
    }

    display.textContent = seconds;

    if (--time < 0) {
      removeTimerClock(clock);
      addQuizResults();
    }
  }, 1000);
}

function removeTimerClock(timer) {
  clearInterval(timer);
}

function removeButtonOptions() {
  const buttonOptions = document.querySelectorAll(".btn-options");
  buttonOptions.forEach((button) => button.remove());
}

function createTable(players) {
  const table = document.createElement("table");
  table.classList.add("table-results");
  const tr = document.createElement("tr");
  const thPlayerName = document.createElement("th");
  const thPlayerScore = document.createElement("th");
  thPlayerName.innerHTML = "Players Name";
  thPlayerScore.innerHTML = "Score";
  tr.appendChild(thPlayerName);
  tr.appendChild(thPlayerScore);
  table.appendChild(tr);

  players.map((player) => {
    const tr = document.createElement("tr");
    const tdPlayerName = document.createElement("td");
    const tdPlayerScore = document.createElement("td");
    tdPlayerName.innerHTML = player.playersName;
    tdPlayerScore.innerHTML = player.score;
    tr.appendChild(tdPlayerName);
    tr.appendChild(tdPlayerScore);
    table.appendChild(tr);
  });
  document.getElementById("players").appendChild(table);
}

function seeHistory() {
  document.getElementById("addQuizResults").hidden = true;
  document.getElementById("playersResults").hidden = false;
  createTable(JSON.parse(localStorage.getItem("players")));
  document.getElementById("clearHistorial").addEventListener("click", () => {
    players = [];
    localStorage.setItem("players", JSON.stringify(players));
    createTable(JSON.parse(localStorage.getItem("players")));
  });
  document.getElementById("back").addEventListener("click", () => {
    main();
  });
}
function addQuizResults() {
  document.getElementById("quiz").hidden = true;
  document.getElementById("addQuizResults").hidden = false;
  document.getElementById(
    "result"
  ).textContent = `Your final score is: ${currentTime}`;
  document.getElementById("time").textContent = `Time: ${currentTime} Seconds`;
  document.getElementById("submitResult").addEventListener("click", () => {
    players.push({
      playersName: document.getElementById("player").value,
      score: currentTime,
    });
    localStorage.setItem("players", JSON.stringify(players));
    seeHistory();
  });
}

function iterateOverQuiz(quiz, quizQuestion, quizIndex, lastQuizIndex) {
  // check if end of quiz
  if (quizIndex === lastQuizIndex || !quizQuestion) {
    removeTimerClock(clock);
    addQuizResults();
    return;
  }

  const optionsContainer = document.getElementById("options");
  document.getElementById("titleQuestion").textContent = `Question ${
    quizIndex + 1
  }`;
  questions.innerHTML = quizQuestion.question;

  // create button and store them into an array
  const options = quizQuestion.options.map((option, _) => {
    const buttonOptions = document.createElement("button");
    buttonOptions.classList.add("btn-options");

    buttonOptions.innerHTML = option;

    buttonOptions.addEventListener("click", (evt) => {
      if (quizQuestion.answer === evt.target.innerHTML) {
        message.innerHTML = "Correct!";
      } else {
        message.innerHTML = "Incorrect answer!";
        currentTime -= quizQuestion.penaltyTime;
        removeTimerClock(clock);

        clock = createTimerClock(currentTime);
      }

      removeButtonOptions();
      iterateOverQuiz(quiz, quiz[++quizIndex], quizIndex, lastQuizIndex);
    });

    return buttonOptions;
  });

  // append options created
  options.forEach((option) => optionsContainer.appendChild(option));
}

function main() {
  const startQuiz = document.getElementById("startQuiz");
  const homeDiv = document.getElementById("home");
  homeDiv.hidden = false;
  document.getElementById("addQuizResults").hidden = true;
  document.getElementById("playersResults").hidden = true;

  startQuiz.addEventListener("click", () => {
    document.getElementById("quiz").hidden = false;
    removeButtonOptions();
    const quizTime = 15;
    const initialIndex = 0;
    const lastIndex = quiz.length;

    homeDiv.hidden = true;

    clock = createTimerClock(quizTime);

    const [firstQuestion] = quiz;

    iterateOverQuiz(quiz, firstQuestion, initialIndex, lastIndex);
  });
}

main();
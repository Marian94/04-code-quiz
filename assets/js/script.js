const quiz = [
  {
    question: "Inside which HTML element do we put the JavaScript?",
    options: ["<javascript>", "<script>", "<js>"],
    answer: "<script>",
    penaltyTime: 5,
  },
  {
    question:
      "What is the correct syntax for referring to an external script called 'xxx.js'?",
    options: [
      "<script href='xxx.js'>",
      "<script name='xxx.js'>",
      "<script src='xxx.js'>",
    ],
    answer: "<script src='xxx.js'>",
    penaltyTime: 5,
  },
  {
    question: "How do you create a function in JavaScript?",
    options: [
      "function myFunction()",
      "function:myFunction()",
      "function = myFunction()",
    ],
    answer: "function myFunction()",
    penaltyTime: 5,
  },
  {
    question: "How do you call a function named 'myFunction'?",
    options: [
      "call myFunction()",
      "myFunction()",
      "call function myFunction()",
    ],
    answer: "myFunction()",
    penaltyTime: 5,
  },
  {
    question: "How to write an IF statement in JavaScript?",
    options: ["if i = 5", "if(i ==5)", "if i == 5 then"],
    answer: "if(i ==5)",
    penaltyTime: 5,
  },
];
let players = [];
let quizTime = 70;
let score = 0;
let timeOut;
let timerStart = false;

const homeView = document.getElementById("home");
const quizView = document.getElementById("quiz");
const addQuizResultsView = document.getElementById("addQuizResults");
const playersResultsView = document.getElementById("playersResults");

function createTable(players) {
  const table = document.getElementById("table-results");
  console.log("players", players);
  if (!table) {
    const table = document.createElement("table");
    table.setAttribute("id", "table-results");
    const tr = document.createElement("tr");
    const thPlayerName = document.createElement("th");
    const thPlayerScore = document.createElement("th");
    thPlayerName.innerText = "Players Name";
    thPlayerScore.innerText = "Score";
    tr.appendChild(thPlayerName);
    tr.appendChild(thPlayerScore);
    table.appendChild(tr);
    players.map((player) => {
      const tr = document.createElement("tr");
      tr.setAttribute("class", "tr-element");
      const tdPlayerName = document.createElement("td");
      const tdPlayerScore = document.createElement("td");
      tdPlayerName.innerText = player.playersName;
      tdPlayerScore.innerText = player.score;
      tr.appendChild(tdPlayerName);
      tr.appendChild(tdPlayerScore);
      table.appendChild(tr);
    });

    document.getElementById("players").appendChild(table);
  } else {
    if (players.length) {
      players.map((player) => {
        const tr = document.createElement("tr");
        tr.setAttribute("class", "tr-element");
        const tdPlayerName = document.createElement("td");
        const tdPlayerScore = document.createElement("td");
        tdPlayerName.innerText = player.playersName;
        tdPlayerScore.innerText = player.score;
        tr.appendChild(tdPlayerName);
        tr.appendChild(tdPlayerScore);
        table.appendChild(tr);
      });
    }
  }
}

function seeHistory() {
  const localStoragePlayers = JSON.parse(localStorage.getItem("players"));

  addQuizResultsView.hidden = true;
  playersResultsView.hidden = false;
  console.log("localStorage", localStoragePlayers);
  createTable(localStoragePlayers);

  document.getElementById("clearHistorial").addEventListener("click", () => {
    const elements = document.getElementsByClassName("tr-element");
    players = [];
    localStorage.setItem("players", []);
    while (elements.length) {
      elements[0].remove();
    }
  });

  document.getElementById("back").addEventListener("click", () => {
    main();
  });
}

function addQuizResults() {
  const playersName = document.getElementById("player");
  const result = document.getElementById("result");
  const time = document.getElementById("time");

  quizView.hidden = true;
  addQuizResultsView.hidden = false;
  result.textContent = `Your final score is: ${score}`;
  time.textContent = `Time: ${score} Seconds`;

  document.getElementById("submitResult").addEventListener("click", () => {
    if (playersName.value === "") {
      alert("Please add a valid name!!");
    } else {
      players.push({
        playersName: playersName.value,
        score: score,
      });
      localStorage.setItem("players", JSON.stringify(players));
      seeHistory();
    }
  });
}

function removeButtonOptions() {
  const buttonOptions = document.querySelectorAll(".btn-options");
  buttonOptions.forEach((button) => {
    button.remove();
  });
}

function iterateOverQuiz(quizQuestion, quizIndex, lastQuizIndex) {
  const titleQuestion = document.getElementById("titleQuestion");
  const questions = document.getElementById("questions");
  const optionsContainer = document.getElementById("options");
  homeView.hidden = true;
  quizView.hidden = false;

  // check if end of quiz
  if (!quizQuestion) {
    stopTimer();
    return;
  }
  removeButtonOptions();

  titleQuestion.innerText = `Question ${quizIndex + 1}`;
  questions.innerText = quizQuestion.question;

  // create button and store them into an array
  const options = quizQuestion.options.map((option) => {
    const buttonOptions = document.createElement("button");
    buttonOptions.classList.add("btn-options");
    buttonOptions.innerText = option;
    // append options created
    optionsContainer.appendChild(buttonOptions);

    buttonOptions.addEventListener("click", (evt) => {
      if (quizQuestion.answer === evt.target.innerText) {
        message.innerText = "Correct!";
      } else {
        message.innerText = "Incorrect answer!";
        quizTime -= quizQuestion.penaltyTime;
      }

      iterateOverQuiz(quiz[++quizIndex], quizIndex);
    });

    return buttonOptions;
  });
}

function stopTimer() {
  score = quizTime;
  quizTime = 70;
  clearTimeout(timeOut);
  timerStart = false;
  addQuizResults();
}

function createTimerClock() {
  const display = document.getElementById("time");

  display.innerText = `Time: ${quizTime} Seconds`;

  quizTime--;
  timeOut = setTimeout(createTimerClock, 1000);

  if (quizTime <= 0) stopTimer();
}

function clearWindows() {
  homeView.hidden = false;
  quizView.hidden = true;
  playersResultsView.hidden = true;
  addQuizResultsView.hidden = true;
  document.getElementById("player").value = "";
  document.getElementById("message").innerText = "";
}

function main() {
  const startQuiz = document.getElementById("startQuiz");
  const display = document.getElementById("time");
  const [firstQuestion] = quiz;
  clearWindows();
  display.innerText = `Time: ${quizTime} Seconds`;
  startQuiz.addEventListener("click", () => {
    if (!timerStart) {
      timerStart = true;
      createTimerClock();
      iterateOverQuiz(firstQuestion, 0);
    }
  });
}

main();

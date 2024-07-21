const API_URL = "https://jsonplaceholder.typicode.com/posts";
const totalQuestions = 10;
let questions = [];
let currentQuestionIndex = 0;
let timeLeft = 30;
let timerInterval;
let answers = [];

async function fetchQuestions() {
  const response = await fetch(API_URL);
  const data = await response.json();
  //   console.log("Question data: ", data);
  questions = data.slice(0, totalQuestions);
  //   console.log("Questions: ", questions);
}

function startQuiz() {
  document.getElementById("start-button-container").style.display = "none";
  document.getElementById("timer").style.display = "block";
  showQuestion();
  timerInterval = setInterval(updateTimer, 1000);
}

function generateOptionsFromText(text) {
  const words = text.split(" ");
  const options = [];

  for (let i = 0; i < 4; i++) {
    const start = Math.floor(Math.random() * (words.length - 4));
    console.log("Start: ", start);
    options.push(words.slice(start, start + 4).join(" "));
  }

  console.log("Options: ", options);

  return options;
}

function showQuestion() {
  if (currentQuestionIndex >= totalQuestions) {
    clearInterval(timerInterval);
    showAnswers();
    return;
  }

  const question = questions[currentQuestionIndex];
  const progressElement = document.getElementById("progress");
  progressElement.textContent = `Question ${
    currentQuestionIndex + 1
  } of ${totalQuestions}`;

  const options = generateOptionsFromText(question.body);

  const quizContainer = document.getElementById("quiz");
  quizContainer.innerHTML = `
        <form id="questionForm">
            <fieldset class="uk-fieldset">
                <legend class="uk-legend">${
                  question.title.charAt(0).toUpperCase() +
                  question.title.slice(1)
                }?</legend>
                <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                    <ul class="uk-list">
                        <li>
                            <label class="uk-radio-label"><input class="uk-radio" type="radio" name="radio${currentQuestionIndex}" value="A" disabled> A) ${
    options[0]
  }</label>
                        </li>
                        <li>
                            <label class="uk-radio-label"><input class="uk-radio" type="radio" name="radio${currentQuestionIndex}" value="B" disabled> B) ${
    options[1]
  }</label>
                        </li>
                        <li>
                            <label class="uk-radio-label"><input class="uk-radio" type="radio" name="radio${currentQuestionIndex}" value="C" disabled> C) ${
    options[2]
  }</label>
                        </li>
                        <li>
                            <label class="uk-radio-label"><input class="uk-radio" type="radio" name="radio${currentQuestionIndex}" value="D" disabled> D) ${
    options[3]
  }</label>
                        </li>
                    </ul>                            
                </div>
            </fieldset>
        </form>
    `;
}

function updateTimer() {
  const timerElement = document.getElementById("timer");
  timerElement.textContent = timeLeft;

  if (timeLeft === 20) {
    const radioLabels = document.querySelectorAll(".uk-radio-label");
    radioLabels.forEach((label) => {
      label.classList.add("editable");
      label.querySelector("input").disabled = false;
    });
  }
  if (timeLeft <= 0) {
    saveAnswer();
    currentQuestionIndex++;
    timeLeft = 30;
    showQuestion();
  }
  timeLeft--;
}

function saveAnswer() {
  const form = document.getElementById("questionForm");
  const selectedOption = form.querySelector("input[type=radio]:checked");
  answers.push({
    question: questions[currentQuestionIndex].title,
    answer: selectedOption ? selectedOption.value : "No Answer",
  });
}

function showAnswers() {
  const quizContainer = document.getElementById("quiz");
  let answerTable = `<table class="answer-table"><tr><th>Question</th><th>Answer</th></tr>`;
  answers.forEach((answer) => {
    answerTable += `<tr><td>${answer.question}</td><td>${answer.answer}</td></tr>`;
  });
  answerTable += `</table>`;
  quizContainer.innerHTML = answerTable;
}

fetchQuestions();

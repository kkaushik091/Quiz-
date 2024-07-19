const time = document.getElementById("timer");
const start = document.getElementById("startButton");
const submit = document.getElementById("submitButton");
const questionDisplay = document.getElementById("questions");
const next = document.getElementById("nextButton");
const previous = document.getElementById("previousButton");

// display questions
let questions = [];
let currentQuestionIndex = 0;

// store selected answers
let selectedAnswers = {};

function fetchQuestions() {
  //fetch data from JSON file
  fetch("question.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      questions = data;
      displayQuestions();
    })
    .catch(function (error) {
      console.error("error loading questions:", error);
    });
}

function displayQuestions() {
  const quizContainer = questionDisplay;

  // clear existing contetnt
  quizContainer.innerHTML = "";

  // get current questions
  const question = questions[currentQuestionIndex];

  // Create a new div element for the question
  const questionElement = document.createElement("div");
  questionElement.innerText = question.question;
  quizContainer.appendChild(questionElement);

  // Create and append options
  question.options.forEach(function (option, index) {
    // Create a new div element for each option
    const optionElement = document.createElement("div");

    // Create a new input element of type radio

    const inputElement = document.createElement("input");
    inputElement.type = "radio";
    inputElement.name = "option";
    inputElement.value = index;

    // if the option was previously selected 
    if(selectedAnswers[currentQuestionIndex]===index){
        inputElement.checked = true;
    }

    // Append input and text to the option div
    optionElement.appendChild(inputElement);
    optionElement.append(option);
    quizContainer.appendChild(optionElement);
  });

  // update button visibility
  updateButtonVisibility();
}

// Timer

let timer;
let timeleft = 50;

function startTimer() {
  timer = setInterval(function () {
    timeleft--;

    // calculate minutes and seconds
    const minutes = Math.floor(timeleft / 60);
    const seconds = timeleft % 60;

    //display time in MM:SS format
    time.innerText = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

    // if time runs out
    if (timeleft <= 0) {
      clearInterval(timer);
      submitQuiz;
    }
  }, 1000); // update every second
}

// submit the quiz
let score = 0;

function submitQuiz() {
  // clearing the timer
  clearInterval(timer);

  // get the selected answer
  const selectedOption = document.querySelector(`input[name="option"]:checked`);

  // if an option was selected
  if (selectedOption) {
    const answer = parseInt(selectedOption.value);
    const correctAnswer = questions[currentQuestionIndex].options.indexOf(
      questions[currentQuestionIndex].correct
    );

    //if the option is correct
    if (answer === correctAnswer) {
      score += questions[currentQuestionIndex].score;
    }
  }

  // hide navigation buttons and show the result
  next.style.display = "none";
  previous.style.display = "none";
  submit.style.display = "none";
  displayResult();
}

function displayResult() {
  const quizContainer = document.getElementById("questions");
  quizContainer.innerHTML =
    "Your score is " +
    score +
    ". You " +
    (score > 25 ? "passed" : "failed") +
    " the quiz.";
  submit.style.display = "none";
}

// update button visibility
function updateButtonVisibility() {
  previous.style.display = currentQuestionIndex > 0 ? "block" : "none";
  next.style.display =
    currentQuestionIndex < questions.length - 1 ? "block" : "none";
  submit.style.display =
    currentQuestionIndex === questions.length - 1 ? "block" : "none";
}

// event listeners

start.addEventListener("click", function () {
  fetchQuestions();
  startTimer();
  start.style.display = "none";
  next.style.display = "block";
  previous.style.display = "none";
  submit.style.display = "block";
});

// next button
next.addEventListener("click", function () {
  //check if option is selected
  const selectedOption = document.querySelector(`input[name="option"]:checked`);

  if (selectedOption) {
    // save the selected option
    selectedAnswers[currentQuestionIndex] = parseInt(selectedOption.value);
    currentQuestionIndex++;

    // check if there are no more questions
    if (currentQuestionIndex < questions.length) {
      displayQuestions();
    } else {
      submitQuiz(); // if last question
    }
  } else {
    alert("Please select an option before moving to the next question");
  }
});

previous.addEventListener("click", function () {
  const selectedOption = document.querySelector(`input[name="option"]:checked`);

  if (selectedOption) {
    selectedAnswers[currentQuestionIndex] = parseInt(selectedOption.value);
  }

  // move to previous question
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestions();
  }
});

submit.addEventListener("click", submitQuiz);

// hiding all buttons at the start

window.onload = () => {
  next.style.display = "none";
  previous.style.display = "none";
  submit.style.display = "none";
};

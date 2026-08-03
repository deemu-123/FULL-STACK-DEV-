const quiz = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: "Paris"
    },
    {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Jupiter", "Mars", "Saturn"],
        answer: "Jupiter"
    },
    {
        question: "What is the chemical symbol for water?",
        options: ["H2O", "O2", "CO2", "NaCl"],
        answer: "H2O"
    }
];

let index = 0;
let score = 0;
let timer = 30;

const question = document.getElementById("question");
const options = document.getElementById("options");
const result = document.getElementById("result");
const timerDisplay = document.getElementById("timer");

function LoadQuestion() {
    question.innerHTML = quiz[index].question;
    options.innerHTML = "";

    quiz[index].options.forEach((option) => {
        options.innerHTML += `
            <label>
                <input type="radio" name="option" value="${option}">
                ${option}
            </label><br>
        `;
    });
}


function NextQuestion() {
    const selected = document.querySelector('input[name="option"]:checked');

    if (selected && selected.value === quiz[index].answer) {
        score++;
    }

    index++;

    if (index < quiz.length) {
        LoadQuestion();
    } else {
        clearInterval(interval);
        question.innerHTML = "";
        options.innerHTML = "";
        result.innerHTML = `Quiz Completed!<br>Your Score: ${score}/${quiz.length}`;
    }
}


LoadQuestion();


const interval = setInterval(() => {
    timer--;
    timerDisplay.innerHTML = "Time Left: " + timer + " seconds";

    if (timer <= 0) {
        clearInterval(interval);
        question.innerHTML = "";
        options.innerHTML = "";
        result.innerHTML = `Time's Up!<br>Your Score: ${score}/${quiz.length}`;
    }
}, 1000);

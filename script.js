/* ========================================
   QUIZLAB - WEB DEVELOPMENT QUIZ
   ======================================== */


/* ---------- QUIZ DATA ---------- */

const quizData = [
    {
        question: "Apa kepanjangan dari HTML?",
        options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlink Text Mode Language"
        ],
        correct: 0
    },

    {
        question: "Apa fungsi utama CSS pada sebuah halaman web?",
        options: [
            "Mengatur struktur database",
            "Mengatur tampilan dan gaya halaman web",
            "Menjalankan server web",
            "Menyimpan data pengguna"
        ],
        correct: 1
    },

    {
        question: "Bahasa pemrograman yang digunakan untuk membuat halaman web menjadi interaktif adalah...",
        options: [
            "HTML",
            "CSS",
            "JavaScript",
            "SQL"
        ],
        correct: 2
    },

    {
        question: "Method DOM yang digunakan untuk memilih elemen pertama yang sesuai dengan CSS selector adalah...",
        options: [
            "querySelector()",
            "queryAll()",
            "getSelector()",
            "selectElement()"
        ],
        correct: 0
    },

    {
        question: "Method JavaScript yang digunakan untuk membuat elemen HTML baru adalah...",
        options: [
            "createElement()",
            "newElement()",
            "makeElement()",
            "createHTML()"
        ],
        correct: 0
    },

    {
        question: "Properti yang digunakan untuk mengubah isi teks sebuah elemen DOM adalah...",
        options: [
            "innerStyle",
            "textContent",
            "changeText",
            "textValue"
        ],
        correct: 1
    },

    {
        question: "Teknik menangani event pada beberapa elemen melalui satu parent element disebut...",
        options: [
            "Event Loop",
            "Event Binding",
            "Event Delegation",
            "Event Mapping"
        ],
        correct: 2
    },

    {
        question: "Web Storage yang dapat menyimpan data sehingga tetap tersedia setelah browser ditutup adalah...",
        options: [
            "SessionStorage",
            "LocalStorage",
            "TemporaryStorage",
            "BrowserCache"
        ],
        correct: 1
    }
];


/* ---------- STATE ---------- */

let currentQuestion = 0;
let score = 0;
let answered = false;

let timerInterval;
let timeLeft = 15;


/* ---------- DOM ELEMENTS ---------- */

const questionEl = document.querySelector("#question");
const optionsEl = document.querySelector("#options");

const nextBtn = document.querySelector("#nextBtn");

const progressEl = document.querySelector("#progress");
const scoreDisplayEl = document.querySelector("#score-display");
const progressFillEl = document.querySelector("#progress-fill");

const timerEl = document.querySelector("#timer");

const quizContentEl = document.querySelector(".quiz-content");
const resultEl = document.querySelector("#result");

const scoreEl = document.querySelector("#score");
const highScoreEl = document.querySelector("#highScore");

const restartBtn = document.querySelector("#restartBtn");
const themeBtn = document.querySelector("#themeBtn");


/* ========================================
   UPDATE NEXT BUTTON
   ======================================== */

function updateNextButton(text) {

    nextBtn.replaceChildren();


    const textSpan = document.createElement("span");
    textSpan.textContent = text;


    const arrow = document.createElement("strong");
    arrow.textContent = "→";


    nextBtn.append(textSpan, arrow);
}


/* ========================================
   RENDER QUESTION
   ======================================== */

function renderQuestion() {

    const currentQuiz = quizData[currentQuestion];

    answered = false;


    /* ---------- QUESTION NUMBER ---------- */

    progressEl.textContent =
        `${String(currentQuestion + 1).padStart(2, "0")} / ${String(quizData.length).padStart(2, "0")}`;


    /* ---------- SCORE ---------- */

    scoreDisplayEl.textContent = score;


    /* ---------- QUESTION TEXT ---------- */

    questionEl.textContent = currentQuiz.question;


    /* ---------- CLEAR OPTIONS ---------- */

    optionsEl.replaceChildren();


    /* ---------- CREATE OPTIONS ---------- */

    currentQuiz.options.forEach((option, index) => {

        const optionButton =
            document.createElement("button");


        optionButton.type = "button";

        optionButton.classList.add("option-btn");

        optionButton.dataset.index = index;


        /* A, B, C, D */

        const letters = ["A", "B", "C", "D"];

        optionButton.dataset.letter =
            letters[index];


        /* Answer text */

        optionButton.textContent = option;


        optionsEl.append(optionButton);

    });


    /* ---------- RESET NEXT BUTTON ---------- */

    nextBtn.hidden = true;

    updateNextButton("Next Question");


    /* ---------- UPDATE PROGRESS ---------- */

    updateProgress();


    /* ---------- START TIMER ---------- */

    startTimer();


    /* ---------- QUESTION ANIMATION ---------- */

    questionEl.parentElement.classList.remove(
        "question-transition"
    );

    void questionEl.parentElement.offsetWidth;

    questionEl.parentElement.classList.add(
        "question-transition"
    );
}


/* ========================================
   EVENT DELEGATION
   ======================================== */

optionsEl.addEventListener("click", (event) => {

    const selectedButton =
        event.target.closest(".option-btn");


    /* Ignore clicks outside answer buttons */

    if (!selectedButton || answered) {
        return;
    }


    answered = true;


    const selectedIndex =
        Number(selectedButton.dataset.index);


    const correctIndex =
        quizData[currentQuestion].correct;


    const optionButtons =
        optionsEl.querySelectorAll(".option-btn");


    /* ---------- DISABLE ALL OPTIONS ---------- */

    optionButtons.forEach((button) => {
        button.disabled = true;
    });


    /* ---------- CHECK ANSWER ---------- */

    if (selectedIndex === correctIndex) {

        selectedButton.classList.add("correct");

        score++;

        scoreDisplayEl.textContent = score;

    } else {

        selectedButton.classList.add("wrong");

        optionButtons[correctIndex].classList.add(
            "correct"
        );
    }


    /* ---------- STOP TIMER ---------- */

    clearInterval(timerInterval);


    /* ---------- SHOW NEXT BUTTON ---------- */

    nextBtn.hidden = false;


    if (currentQuestion === quizData.length - 1) {

        updateNextButton("See Result");

    } else {

        updateNextButton("Next Question");
    }

});


/* ========================================
   NEXT QUESTION
   ======================================== */

nextBtn.addEventListener("click", () => {

    currentQuestion++;


    if (currentQuestion < quizData.length) {

        renderQuestion();

    } else {

        showResult();
    }

});


/* ========================================
   TIMER
   ======================================== */

function startTimer() {

    clearInterval(timerInterval);


    timeLeft = 15;

    timerEl.textContent = timeLeft;


    timerInterval = setInterval(() => {

        timeLeft--;

        timerEl.textContent = timeLeft;


        if (timeLeft <= 0) {

            clearInterval(timerInterval);


            if (!answered) {
                handleTimeOut();
            }

        }

    }, 1000);

}


/* ========================================
   TIME OUT
   ======================================== */

function handleTimeOut() {

    answered = true;


    const correctIndex =
        quizData[currentQuestion].correct;


    const optionButtons =
        optionsEl.querySelectorAll(".option-btn");


    /* Disable all options */

    optionButtons.forEach((button) => {
        button.disabled = true;
    });


    /* Show correct answer */

    optionButtons[correctIndex].classList.add(
        "correct"
    );


    /* Show next button */

    nextBtn.hidden = false;


    if (currentQuestion === quizData.length - 1) {

        updateNextButton("See Result");

    } else {

        updateNextButton("Next Question");
    }

}


/* ========================================
   PROGRESS BAR
   ======================================== */

function updateProgress() {

    const progress =
        ((currentQuestion + 1) / quizData.length) * 100;


    progressFillEl.style.width =
        `${progress}%`;
}


/* ========================================
   SHOW RESULT
   ======================================== */

function showResult() {

    clearInterval(timerInterval);


    const total = quizData.length;


    const percentage =
        Math.round((score / total) * 100);


    /* ---------- SCORE ---------- */

    scoreEl.textContent =
        `${score}/${total} (${percentage}%)`;


    /* ---------- LOCAL STORAGE ---------- */

    const savedHighScore =
        Number(
            localStorage.getItem("quizHighScore")
        ) || 0;


    if (percentage > savedHighScore) {

        localStorage.setItem(
            "quizHighScore",
            percentage
        );


        highScoreEl.textContent =
            `${percentage}% 🎉`;

    } else {

        highScoreEl.textContent =
            `${savedHighScore}%`;
    }


    /* ---------- SHOW RESULT ---------- */

    quizContentEl.classList.add("hidden");

    resultEl.classList.remove("hidden");

}


/* ========================================
   RESTART QUIZ
   ======================================== */

restartBtn.addEventListener("click", () => {

    currentQuestion = 0;

    score = 0;

    answered = false;


    resultEl.classList.add("hidden");

    quizContentEl.classList.remove("hidden");


    renderQuestion();

});


/* ========================================
   DARK MODE
   ======================================== */

function applyTheme() {

    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );


    themeBtn.textContent =
        isDark ? "☀" : "☾";


    localStorage.setItem(
        "quizDarkMode",
        isDark
    );
}


themeBtn.addEventListener("click", () => {

    document.body.classList.toggle(
        "dark-mode"
    );

    applyTheme();

});


/* ========================================
   LOAD SAVED THEME
   ======================================== */

function loadTheme() {

    const savedTheme =
        localStorage.getItem("quizDarkMode");


    if (savedTheme === "true") {

        document.body.classList.add(
            "dark-mode"
        );
    }


    applyTheme();
}


/* ========================================
   START APPLICATION
   ======================================== */

loadTheme();

renderQuestion();
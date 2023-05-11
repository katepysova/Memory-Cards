import { checkTextarea } from "./form-validation.js";

const cardsContainer = document.querySelector(".cards");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const currentText = document.querySelector(".current-card");
const open = document.querySelector(".open");
const close = document.querySelector(".close");
const modal = document.querySelector(".modal");
const form = document.querySelector(".form");

const question = document.querySelector("#question");
const answer = document.querySelector("#answer");

let currentActiveCard = 0;
let cards = [];

const cardsData = [
  {
    question: "Q1",
    answer: "A1",
  },
  {
    question: "2",
    answer: "A21",
  },
];

const updateCurrentText = () => {
  currentText.innerText = `${currentActiveCard + 1}/${cards.length}`;
};

const createCard = (data, index) => {
  const card = document.createElement("div");
  card.classList.add("card");
  if (index === 0) {
    card.classList.add("active");
  }
  card.innerHTML = `
        <div class="card__content">
            <div class="card__front">
                <p>${data.question}</p>
             </div>
            <div class="card__back">
                <p>${data.answer}</p>
            </div>
         </div>
        `;

  card.addEventListener("click", function () {
    this.classList.toggle("show-answer");
  });

  return card;
};

const createCards = () => {
  cards = [];
  cardsContainer.innerHTML = "";
  cardsData.forEach((data, index) => {
    const card = createCard(data, index);
    cards.push(card);
    cardsContainer.appendChild(card);
    updateCurrentText();
  });
  prevBtn.setAttribute("disabled", true);
  if (cardsData.length === 1) {
    nextBtn.setAttribute("disabled", true);
  } else {
    nextBtn.removeAttribute("disabled", true);
  }
};

nextBtn.addEventListener("click", () => {
  prevBtn.removeAttribute("disabled");
  cards[currentActiveCard].className = "card left";
  currentActiveCard += 1;

  if (currentActiveCard > cards.length - 1) {
    currentActiveCard = cards.length - 1;
  }

  if (currentActiveCard === cards.length - 1) {
    nextBtn.setAttribute("disabled", true);
  }

  cards[currentActiveCard].className = "card active";
  updateCurrentText();
});

prevBtn.addEventListener("click", () => {
  nextBtn.removeAttribute("disabled");
  cards[currentActiveCard].className = "card right";
  currentActiveCard -= 1;

  if (currentActiveCard < 0) {
    currentActiveCard = 0;
  }

  if (currentActiveCard === 0) {
    prevBtn.setAttribute("disabled", true);
  }

  cards[currentActiveCard].className = "card active";
  updateCurrentText();
});

open.addEventListener("click", () => {
  modal.classList.add("show");
});

close.addEventListener("click", () => {
  modal.classList.remove("show");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const isQuestionValid = checkTextarea(question);
  const isAnswerValid = checkTextarea(answer);

  if (isQuestionValid && isAnswerValid) {
    const cardData = {
      question: question.value,
      answer: answer.value,
    };
    cardsData.push(cardData);
    createCards();
    close.click();
  }
});

window.addEventListener("resize", () => {
  close.click();
});

createCards();

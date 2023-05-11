import { checkTextarea } from "./form-validation.js";
import LocalStorage from "./local-storage.js";

const cardsContainer = document.querySelector(".cards");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const currentText = document.querySelector(".current-card");
const openBtn = document.querySelector(".open");
const clearBtn = document.querySelector(".clear");
const closeBtn = document.querySelector(".close");
const modal = document.querySelector(".modal");
const form = document.querySelector(".form");

const question = document.querySelector("#question");
const answer = document.querySelector("#answer");

const LS_MEMORY_CARDS_KEY = "memory_cards";

let currentActiveCard = 0;
let cards = [];
let cardsData = LocalStorage.getItem(LS_MEMORY_CARDS_KEY) || [];

const updateCurrentText = () => {
  if (cards.length > 0) {
    currentText.innerText = `${currentActiveCard + 1}/${cards.length}`;
  } else {
    currentText.innerText = "";
  }
};

const emptyState = (message = "No items found") => {
  return `
    <div class="empty-state">
      <p class="empty-state__message">${message}<p>
    </div>
  `;
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
  });
  updateCurrentText();
  prevBtn.setAttribute("disabled", true);
  if (cards.length === 0) {
    clearBtn.setAttribute("disabled", true);
    nextBtn.setAttribute("disabled", true);
    nextBtn.setAttribute("disabled", true);
    cardsContainer.innerHTML = emptyState();
  } else if (cardsData.length === 1) {
    clearBtn.removeAttribute("disabled");
    nextBtn.setAttribute("disabled", true);
  } else {
    nextBtn.removeAttribute("disabled");
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

openBtn.addEventListener("click", () => {
  modal.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});

clearBtn.addEventListener("click", () => {
  cardsData = [];
  LocalStorage.removeItem(LS_MEMORY_CARDS_KEY);
  updateCurrentText();
  createCards();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const isQuestionValid = checkTextarea(question);
  const isAnswerValid = checkTextarea(answer);

  if (isQuestionValid && isAnswerValid) {
    const newCardData = {
      question: question.value,
      answer: answer.value,
    };
    cardsData.push(newCardData);
    const lsCards = LocalStorage.getItem(LS_MEMORY_CARDS_KEY) || [];
    LocalStorage.setItem(LS_MEMORY_CARDS_KEY, [...lsCards, newCardData]);
    createCards();
    closeBtn.click();
  }
});

window.addEventListener("resize", () => {
  closeBtn.click();
});

createCards();

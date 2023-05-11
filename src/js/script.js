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
                <button class="card__delete-btn btn-small">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g stroke-width="0"></g>
                    <g stroke-linecap="round" stroke-linejoin="round"></g>
                    <g>
                      <path d="M20 8.70007H4C3.90151 8.70007 3.80398 8.68067 3.71299 8.64298C3.62199 8.60529 3.53931 8.55005 3.46967 8.4804C3.40003 8.41076 3.34478 8.32808 3.30709 8.23709C3.2694 8.14609 3.25 8.04856 3.25 7.95007C3.25 7.85158 3.2694 7.75405 3.30709 7.66306C3.34478 7.57207 3.40003 7.48939 3.46967 7.41974C3.53931 7.3501 3.62199 7.29486 3.71299 7.25716C3.80398 7.21947 3.90151 7.20007 4 7.20007H20C20.1989 7.20007 20.3897 7.27909 20.5303 7.41974C20.671 7.5604 20.75 7.75116 20.75 7.95007C20.75 8.14899 20.671 8.33975 20.5303 8.4804C20.3897 8.62106 20.1989 8.70007 20 8.70007Z" fill="currentColor"></path>
                      <path d="M16.44 20.75H7.56C7.24309 20.7717 6.92503 20.7303 6.62427 20.6281C6.3235 20.5259 6.04601 20.3651 5.80788 20.1548C5.56975 19.9446 5.37572 19.6892 5.23704 19.4034C5.09836 19.1177 5.01779 18.8072 5 18.49V8.00005C5 7.80113 5.07902 7.61037 5.21967 7.46972C5.36032 7.32906 5.55109 7.25005 5.75 7.25005C5.94891 7.25005 6.13968 7.32906 6.28033 7.46972C6.42098 7.61037 6.5 7.80113 6.5 8.00005V18.49C6.5 18.9 6.97 19.25 7.5 19.25H16.38C16.94 19.25 17.38 18.9 17.38 18.49V8.00005C17.38 7.78522 17.4653 7.57919 17.6172 7.42729C17.7691 7.27538 17.9752 7.19005 18.19 7.19005C18.4048 7.19005 18.6109 7.27538 18.7628 7.42729C18.9147 7.57919 19 7.78522 19 8.00005V18.49C18.9822 18.8072 18.9016 19.1177 18.763 19.4034C18.6243 19.6892 18.4303 19.9446 18.1921 20.1548C17.954 20.3651 17.6765 20.5259 17.3757 20.6281C17.075 20.7303 16.7569 20.7717 16.44 20.75ZM16.56 7.75005C16.4611 7.75139 16.363 7.73291 16.2714 7.6957C16.1798 7.65848 16.0966 7.60329 16.0267 7.53337C15.9568 7.46346 15.9016 7.38024 15.8644 7.28864C15.8271 7.19704 15.8087 7.09891 15.81 7.00005V5.51005C15.81 5.10005 15.33 4.75005 14.81 4.75005H9.22C8.67 4.75005 8.22 5.10005 8.22 5.51005V7.00005C8.22 7.19896 8.14098 7.38972 8.00033 7.53038C7.85968 7.67103 7.66891 7.75005 7.47 7.75005C7.27109 7.75005 7.08032 7.67103 6.93967 7.53038C6.79902 7.38972 6.72 7.19896 6.72 7.00005V5.51005C6.75872 4.88136 7.04203 4.29281 7.50929 3.87041C7.97655 3.44801 8.5906 3.22533 9.22 3.25005H14.78C15.4145 3.21723 16.0362 3.43627 16.51 3.8595C16.9838 4.28273 17.2713 4.87592 17.31 5.51005V7.00005C17.3113 7.09938 17.2929 7.19798 17.2558 7.29013C17.2187 7.38228 17.1637 7.46615 17.0939 7.53685C17.0241 7.60756 16.941 7.6637 16.8493 7.70201C16.7577 7.74033 16.6593 7.76006 16.56 7.76005V7.75005Z" fill="currentColor"></path>
                      <path d="M10.22 17.0001C10.0219 16.9975 9.83263 16.9177 9.69253 16.7776C9.55244 16.6375 9.47259 16.4482 9.47 16.2501V11.7201C9.47 11.5212 9.54902 11.3304 9.68967 11.1898C9.83032 11.0491 10.0211 10.9701 10.22 10.9701C10.4189 10.9701 10.6097 11.0491 10.7503 11.1898C10.891 11.3304 10.97 11.5212 10.97 11.7201V16.2401C10.9713 16.3394 10.9529 16.438 10.9158 16.5302C10.8787 16.6223 10.8237 16.7062 10.7539 16.7769C10.6841 16.8476 10.601 16.9037 10.5093 16.9421C10.4177 16.9804 10.3193 17.0001 10.22 17.0001Z" fill="currentColor"></path>
                      <path d="M13.78 17.0001C13.5811 17.0001 13.3903 16.9211 13.2497 16.7804C13.109 16.6398 13.03 16.449 13.03 16.2501V11.7201C13.03 11.5212 13.109 11.3304 13.2497 11.1898C13.3903 11.0491 13.5811 10.9701 13.78 10.9701C13.9789 10.9701 14.1697 11.0491 14.3103 11.1898C14.451 11.3304 14.53 11.5212 14.53 11.7201V16.2401C14.53 16.4399 14.4513 16.6317 14.3109 16.774C14.1706 16.9162 13.9798 16.9975 13.78 17.0001Z" fill="currentColor"></path>
                    </g>
                  </svg>
                </button>
             </div>
            <div class="card__back">
                <p>${data.answer}</p>
            </div>
         </div>
        `;

  const onDeleteBtnClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const lsCards = LocalStorage.getItem(LS_MEMORY_CARDS_KEY) || [];
    lsCards.splice(index, 1);
    LocalStorage.setItem(LS_MEMORY_CARDS_KEY, lsCards);
    // eslint-disable-next-line no-use-before-define
    createCards();
  };

  card
    .querySelector(".card__delete-btn")
    .addEventListener("click", onDeleteBtnClick);

  card.addEventListener("click", function () {
    this.classList.toggle("show-answer");
  });

  return card;
};

function createCards() {
  const cardsData = LocalStorage.getItem(LS_MEMORY_CARDS_KEY) || [];
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
}

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
    const lsCards = LocalStorage.getItem(LS_MEMORY_CARDS_KEY) || [];
    LocalStorage.setItem(LS_MEMORY_CARDS_KEY, [...lsCards, newCardData]);
    createCards();
    closeBtn.click();
    question.value = "";
    answer.value = "";
  }
});

window.addEventListener("resize", () => {
  closeBtn.click();
});

createCards();

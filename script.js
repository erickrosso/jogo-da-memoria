const front = "cardFront";
const back = "cardBack";

let techs = [
  "bootstrap",
  "css",
  "electron",
  "firebase",
  "html",
  "javascript",
  "jquery",
  "mongo",
  "node",
  "react",
];

let cards = null;
let lockMode = false;
let firstCard = null;
let secondCard = null;

startGame();

function startGame() {
  cards = createCardsFromTechs(techs);
  shuffleCards(cards);

  initializeCards(cards);
}

function initializeCards(cards) {
  let gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";
  cards.forEach((card) => {
    let cardElement = document.createElement("div");
    cardElement.id = card.id;
    cardElement.classList.add("card");
    cardElement.dataset.icon = card.icon;

    createCardContent(card, cardElement);

    cardElement.addEventListener("click", flipCard);
    gameBoard.appendChild(cardElement);
  });
}

function createCardContent(card, cardElement) {
  createCardFace(front, card, cardElement);
  createCardFace(back, card, cardElement);
}

function createCardFace(face, card, element) {
  let cardElementFace = document.createElement("div");
  cardElementFace.classList.add(face);
  if (face === front) {
    cardElementFace.innerHTML = card.icon;
  } else {
    cardElementFace.innerHTML = "&lt/&gt";
  }
  element.appendChild(cardElementFace);
}

function shuffleCards(cards) {
  let currentIndex = cards.length;
  let randomIndex = 0;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [cards[currentIndex], cards[randomIndex]] = [
      cards[randomIndex],
      cards[currentIndex],
    ];
  }
}

function createCardsFromTechs(techs) {
  let cards = [];

  for (let tech of techs) {
    cards.push(createPairFromTeach(tech));
  }
  return cards.flatMap((pair) => pair);
}

function createPairFromTeach(tech) {
  return [
    {
      id: createIdWithTech(tech),
      icon: tech,
      flipped: false,
    },
    {
      id: createIdWithTech(tech),
      icon: tech,
      flipped: false,
    },
  ];
}

function createIdWithTech(tech) {
  return tech + parseInt(Math.random() * 1000);
}

function flipCard() {
  if (setCard(this.id)) {
    this.classList.add("flip");
    if (secondCard) {
      if (checkMatch()) {
        clearCards();
        if (checkGameOver()) {
          let gameOverLayer = document.getElementById("gameOver");
          gameOverLayer.style.display = "flex";
        }
      } else {
        setTimeout(() => {
          let firstCardView = document.getElementById(firstCard.id);
          let secondCardView = document.getElementById(secondCard.id);
          console.log(firstCard, secondCard);
          firstCardView.classList.remove("flip");
          secondCardView.classList.remove("flip");
          unflipCards();
        }, 1000);
      }
    }
  }
}

function checkMatch() {
  if (this.firstCard || this.secondCard) {
    return false;
  }
  return firstCard.icon === secondCard.icon;
}

function clearCards() {
  firstCard = null;
  secondCard = null;
  lockMode = false;
}

function setCard(id) {
  let card = cards.filter((card) => card.id === id)[0];
  if (card.flipped || lockMode) {
    return false;
  }
  if (!firstCard) {
    firstCard = card;
    firstCard.flipped = true;
    return true;
  } else {
    secondCard = card;
    secondCard.flipped = true;
    lockMode = true;
    return true;
  }
}

function unflipCards() {
  firstCard.flipped = false;
  secondCard.flipped = false;
  clearCards();
}

function checkGameOver() {
  return cards.filter((card) => !card.flipped).length == 0;
}

function restart() {
  clearCards();
  startGame();
  let gameOverLayer = document.getElementById("gameOver");
  gameOverLayer.style.display = "none";
}

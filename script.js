const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const answerArea = document.getElementById("answerArea");
const showAnswerBtn = document.getElementById("showAnswerBtn");
const counterEl = document.getElementById("counter");
const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const cardList = document.getElementById("cardList");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [
  {
    question: "What is HTML?",
    answer: "HTML stands for HyperText Markup Language and is used to structure web pages."
  },
  {
    question: "What is CSS?",
    answer: "CSS stands for Cascading Style Sheets and is used to style web pages."
  },
  {
    question: "What is JavaScript?",
    answer: "JavaScript is a programming language used to make web pages interactive."
  }
];

let currentIndex = 0;
let editingIndex = -1;

function saveToStorage() {
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

function displayCard() {
  if (flashcards.length === 0) {
    questionEl.textContent = "No flashcards yet";
    answerEl.textContent = "";
    answerArea.classList.add("hidden");
    counterEl.textContent = "0 / 0";
    showAnswerBtn.disabled = true;
    return;
  }

  showAnswerBtn.disabled = false;

  const card = flashcards[currentIndex];
  questionEl.textContent = card.question;
  answerEl.textContent = card.answer;
  answerArea.classList.add("hidden");
  showAnswerBtn.textContent = "Show Answer";
  counterEl.textContent = `${currentIndex + 1} / ${flashcards.length}`;
}

function displayList() {
  cardList.innerHTML = "";

  if (flashcards.length === 0) {
    cardList.innerHTML = '<p class="empty">No flashcards added.</p>';
    return;
  }

  flashcards.forEach((card, index) => {
    const item = document.createElement("div");
    item.className = "card-item";

    item.innerHTML = `
      <h3>${index + 1}. ${escapeHTML(card.question)}</h3>
      <p>${escapeHTML(card.answer)}</p>
      <button class="edit-btn" onclick="editCard(${index})">Edit</button>
      <button class="delete-btn" onclick="deleteCard(${index})">Delete</button>
    `;

    cardList.appendChild(item);
  });
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

showAnswerBtn.addEventListener("click", () => {
  if (flashcards.length === 0) return;

  answerArea.classList.toggle("hidden");

  if (answerArea.classList.contains("hidden")) {
    showAnswerBtn.textContent = "Show Answer";
  } else {
    showAnswerBtn.textContent = "Hide Answer";
  }
});

prevBtn.addEventListener("click", () => {
  if (flashcards.length === 0) return;

  currentIndex =
    (currentIndex - 1 + flashcards.length) % flashcards.length;

  displayCard();
});

nextBtn.addEventListener("click", () => {
  if (flashcards.length === 0) return;

  currentIndex = (currentIndex + 1) % flashcards.length;
  displayCard();
});

saveBtn.addEventListener("click", () => {
  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();

  if (!question || !answer) {
    alert("Please enter both question and answer.");
    return;
  }

  if (editingIndex === -1) {
    flashcards.push({ question, answer });
    currentIndex = flashcards.length - 1;
  } else {
    flashcards[editingIndex] = { question, answer };
    currentIndex = editingIndex;
    editingIndex = -1;
    saveBtn.textContent = "Add Flashcard";
    cancelBtn.classList.add("hidden");
  }

  saveToStorage();
  questionInput.value = "";
  answerInput.value = "";

  displayCard();
  displayList();
});

window.editCard = function(index) {
  const card = flashcards[index];

  questionInput.value = card.question;
  answerInput.value = card.answer;

  editingIndex = index;
  saveBtn.textContent = "Update Flashcard";
  cancelBtn.classList.remove("hidden");

  questionInput.focus();
};

window.deleteCard = function(index) {
  const confirmed = confirm("Are you sure you want to delete this flashcard?");

  if (!confirmed) return;

  flashcards.splice(index, 1);

  if (currentIndex >= flashcards.length) {
    currentIndex = Math.max(0, flashcards.length - 1);
  }

  saveToStorage();
  displayCard();
  displayList();
};

cancelBtn.addEventListener("click", () => {
  editingIndex = -1;
  questionInput.value = "";
  answerInput.value = "";
  saveBtn.textContent = "Add Flashcard";
  cancelBtn.classList.add("hidden");
});

displayCard();
displayList();

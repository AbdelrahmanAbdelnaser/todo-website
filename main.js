// adding notes and display them

let addBtn = document.querySelector("#add-notes");
let noteTitle = document.querySelector("#title");
let noteDescription = document.querySelector("#description");
const slidesContainer = document.querySelector(".slides");

const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let currentIndex = 0;

const getNotes = () => JSON.parse(localStorage.getItem("notes")) || [];

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addNote(noteTitle.value, noteDescription.value);
  noteTitle.value = "";
  noteDescription.value = "";
  display();
  displayOnCard();
});

function addNote(title, description) {
  if (!title || !description) return;
  const notes = getNotes();

  const note = {
    id: Date.now(),
    title,
    description,
  };

  notes.push(note);
  saveNotes(notes);
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function display() {
  createNotes("slides", "slide");

  const slides = document.querySelectorAll(".slide");

  if (currentIndex >= slides.length) {
    currentIndex = slides.length - 1;
  }

  if (currentIndex < 0) {
    currentIndex = 0;
  }

  updateSlide();
}

// carsuol

function updateSlide() {
  const slides = document.querySelectorAll(".slide");
  const total = slides.length;

  if (total === 0) return;

  if (currentIndex >= total) currentIndex = 0;
  if (currentIndex < 0) currentIndex = total - 1;

  slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  updateSlide();
});

prevBtn.addEventListener("click", () => {
  currentIndex--;
  updateSlide();
});

function displayOnCard() {
  createNotes("notes", "card");
  editing();
}

display();
displayOnCard();

function createNotes(itemSelect, itemClass) {
  let container = document.querySelector(`.${itemSelect}`);
  container.innerHTML = "";

  const notes = getNotes();

  notes.forEach((note) => {
    const slide = document.createElement("div");
    slide.classList.add(itemClass);
    slide.dataset.id = note.id;
    slide.innerHTML = `
    <div>
        <h3>${note.title}</h3>
        <p>${note.description}</p>
        </div>`;
    container.appendChild(slide);
  });
}

function editing() {
  let cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    let div = document.createElement("div");
    div.classList.add("icons");
    let done = document.createElement("i");
    done.classList.add("fa-regular", "fa-square-check");
    done.style.color = "#009688";

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-regular", "fa-trash-can");
    deleteIcon.style.color = "#009688";

    div.appendChild(deleteIcon);
    div.appendChild(done);
    card.appendChild(div);
  });

  let deleteIcons = document.querySelectorAll(".fa-trash-can");
  deleteIcons.forEach((deleteIcon) => {
    deleteIcon.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      const id = Number(card.dataset.id);
      let notes = getNotes();
      notes = notes.filter((note) => note.id !== id);
      saveNotes(notes);
      display();
      displayOnCard();
    });
  });

  let checkNote = document.querySelectorAll(".fa-square-check");
  checkNote.forEach((check) => {
    check.addEventListener("click", (e) => {
      let note = e.target.parentNode.parentNode.children[0];
      if (check.classList.contains("fa-regular")) {
        check.classList.replace("fa-regular", "fa-solid");
        note.style.textDecoration = "line-through";
      } else {
        check.classList.replace("fa-solid", "fa-regular");
        note.style.textDecoration = "none";
      }
    });
  });
}

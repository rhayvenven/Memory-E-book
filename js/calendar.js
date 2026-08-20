console.log("calendar.js is running!");
const grid = document.getElementById("calendarGrid");
const monthLabel = document.getElementById("monthLabel");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");
const dayMemoriesContainer = document.getElementById("dayMemories");

let allMemories = [];
let memoriesByDate = {};
let currentDate = new Date();

// Turns a Date object into a plain "YYYY-MM-DD" string using LOCAL time,
// so it matches the day the user actually saw when they saved the memory
// (rather than shifting to a different day due to UTC/timezone math).
function dateKey(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Groups every memory's index by the day it was saved, so the calendar
// can quickly look up "what memories happened on this date?"
function buildMemoriesByDate() {
  memoriesByDate = {};
  allMemories.forEach(function (memory, index) {
    if (!memory.date) {
      return;
    }
    const key = dateKey(new Date(memory.date));
    if (!memoriesByDate[key]) {
      memoriesByDate[key] = [];
    }
    memoriesByDate[key].push(index);
  });
}

function renderCalendar() {
  grid.innerHTML = "";
  dayMemoriesContainer.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthLabel.textContent = currentDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  // Day of the week (0-6) that the 1st of this month falls on, used to
  // figure out how many blank filler cells to show before day 1.
  const startWeekday = new Date(year, month, 1).getDay();

  // A neat trick: "day 0 of next month" is always the last day of THIS
  // month, so this gives us how many days this month actually has.
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < startWeekday; i++) {
    const filler = document.createElement("div");
    filler.classList.add("calendar-day", "empty");
    grid.appendChild(filler);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const key = dateKey(new Date(year, month, day));
    const cell = document.createElement("div");
    cell.classList.add("calendar-day");
    cell.textContent = day;

    if (memoriesByDate[key]) {
      cell.classList.add("has-memory");
      cell.addEventListener("click", function () {
        showDayMemories(key);
      });
    }

    grid.appendChild(cell);
  }
}

function showDayMemories(key) {
  dayMemoriesContainer.innerHTML = "";
  const indices = memoriesByDate[key] || [];

  for (const memoryIndex of indices) {
    const memory = allMemories[memoryIndex];
    const card = document.createElement("div");
    card.classList.add("memory-card");

    const thumbnail =
      memory.images &&
      memory.images.length > 0 &&
      typeof memory.images[0] === "string"
        ? `<img class="card-thumbnail" src="${window.memoryAPI.toFileUrl(memory.images[0])}" alt="">`
        : "";

    card.innerHTML = `
    <h2>${memory.title}</h2>
    ${thumbnail}
    `;

    card.addEventListener("click", function () {
      localStorage.setItem("selectedMemory", memoryIndex);
      window.location.href = "view-memory.html";
    });

    dayMemoriesContainer.appendChild(card);
  }
}

prevBtn.addEventListener("click", function () {
  currentDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1,
  );
  renderCalendar();
});

nextBtn.addEventListener("click", function () {
  currentDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1,
  );
  renderCalendar();
});

async function init() {
  allMemories = await window.memoryAPI.loadMemories();
  console.log(allMemories);
  buildMemoriesByDate();
  renderCalendar();
}

init();

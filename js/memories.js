console.log("memories.js is running!");
const container = document.getElementById("memoriesContainer");
const searchInput = document.querySelector(".main-search");
const moodFiltersContainer = document.getElementById("moodFilters");
const tagFiltersContainer = document.getElementById("tagFilters");

let allMemories = [];
let activeMoodFilter = null;
let activeTagFilter = null;

function buildFilterChips() {
  // Collect every distinct mood and tag that actually appears across
  // all saved memories, so the filter buttons only show options that
  // are actually usable.
  const moods = new Set();
  const tags = new Set();
  for (const memory of allMemories) {
    if (memory.mood) {
      moods.add(memory.mood);
    }
    for (const tag of memory.tags || []) {
      tags.add(tag);
    }
  }

  moodFiltersContainer.innerHTML = "";
  moods.forEach(function (mood) {
    const chip = document.createElement("button");
    chip.classList.add("filter-chip");
    chip.textContent = mood;
    chip.addEventListener("click", function () {
      activeMoodFilter = activeMoodFilter === mood ? null : mood;
      buildFilterChips();
      applyFilters();
    });
    if (activeMoodFilter === mood) {
      chip.classList.add("active");
    }
    moodFiltersContainer.appendChild(chip);
  });

  tagFiltersContainer.innerHTML = "";
  tags.forEach(function (tag) {
    const chip = document.createElement("button");
    chip.classList.add("filter-chip");
    chip.textContent = tag;
    chip.addEventListener("click", function () {
      activeTagFilter = activeTagFilter === tag ? null : tag;
      buildFilterChips();
      applyFilters();
    });
    if (activeTagFilter === tag) {
      chip.classList.add("active");
    }
    tagFiltersContainer.appendChild(chip);
  });
}

function renderMemories(memoriesToRender) {
  container.innerHTML = "";

  if (memoriesToRender.length === 0) {
    container.innerHTML = `<p class="no-results">No memories match your filters.</p>`;
    return;
  }

  for (const memory of memoriesToRender) {
    const originalIndex = allMemories.indexOf(memory);
    const card = document.createElement("div");
    card.classList.add("memory-card");

    const formattedDate = memory.date
      ? new Date(memory.date).toLocaleDateString()
      : "";

    const thumbnail =
      memory.images &&
      memory.images.length > 0 &&
      typeof memory.images[0] === "string"
        ? `<img class="card-thumbnail" src="${window.memoryAPI.toFileUrl(memory.images[0])}" alt="">`
        : "";

    card.innerHTML = `
    <h2>${memory.title}</h2>
    ${thumbnail}
    <p class="card-date">${formattedDate}</p>
    `;

    card.addEventListener("click", function () {
      localStorage.setItem("selectedMemory", originalIndex);
      window.location.href = "view-memory.html";
    });
    container.appendChild(card);
  }
}

function applyFilters() {
  const query = searchInput.value.toLowerCase().trim();

  const filtered = allMemories.filter(function (memory) {
    const matchesSearch =
      !query || (memory.title && memory.title.toLowerCase().includes(query));
    const matchesMood = !activeMoodFilter || memory.mood === activeMoodFilter;
    const matchesTag =
      !activeTagFilter ||
      (memory.tags && memory.tags.includes(activeTagFilter));
    return matchesSearch && matchesMood && matchesTag;
  });

  renderMemories(filtered);
}

async function loadMemories() {
  allMemories = await window.memoryAPI.loadMemories();
  console.log(allMemories);
  buildFilterChips();
  renderMemories(allMemories);
}

searchInput.addEventListener("input", applyFilters);

loadMemories();

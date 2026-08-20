const title = document.getElementById("memoryTitle");
const story = document.getElementById("memoryStory");
const moodEl = document.getElementById("memoryMood");
const dateEl = document.getElementById("memoryDate");
const tagsContainer = document.getElementById("memoryTags");
const memoryImages = document.getElementById("memoryImages");

const index = localStorage.getItem("selectedMemory");

async function loadMemory() {
  const memories = await window.memoryAPI.loadMemories();
  const memory = memories[index];
  console.log("Memory:", memory);

  title.textContent = memory.title;
  story.textContent = memory.story;
  moodEl.textContent = memory.mood || "";
  dateEl.textContent = memory.date
    ? new Date(memory.date).toLocaleDateString()
    : "";

  tagsContainer.innerHTML = "";
  const tags = memory.tags || [];
  for (const tag of tags) {
    const span = document.createElement("span");
    span.classList.add("tag");
    span.textContent = tag;
    tagsContainer.appendChild(span);
  }

  memoryImages.innerHTML = "";
  const images = memory.images || [];
  images.forEach(function (imagePath, i) {
    if (typeof imagePath !== "string") {
      return;
    }
    const wrapper = document.createElement("div");
    wrapper.classList.add("polaroid");
    wrapper.classList.add(i % 2 === 0 ? "rotate-left" : "rotate-right");

    const img = document.createElement("img");
    img.src = window.memoryAPI.toFileUrl(imagePath);
    wrapper.appendChild(img);

    memoryImages.appendChild(wrapper);
  });
}

loadMemory();

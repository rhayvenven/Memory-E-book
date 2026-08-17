const title = document.getElementById("memoryTitle");
const story = document.getElementById("memoryStory");

console.log(title);
console.log(story);

const index = localStorage.getItem("selectedMemory");
console.log(index);

async function loadMemory() {
  const memories = await window.memoryAPI.loadMemories();
  console.log(memories);

  const memory = memories[index];
  console.log("Images:", memory.images);

  title.textContent = memory.title;
  story.textContent = memory.story;
  const memoryImages = document.getElementById("memoryImages");
  console.log("Memory:", memory);
  console.log("Images:", memory.images);

  for (const imagePath of memory.images) {
    const img = document.createElement("img");
    img.src = window.memoryAPI.toFileUrl(imagePath);
    img.classList.add("preview-image");
    memoryImages.appendChild(img);
  }
}

loadMemory();

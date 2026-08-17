console.log("memories.js is running!");
const container = document.getElementById("memoriesContainer");

async function loadMemories() {
  const memories = await window.memoryAPI.loadMemories();
  console.log(memories);
  for (const [index, memory] of memories.entries()) {
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
    ${thumbnail}
    <h2>${memory.title}</h2>
    <p>${memory.story}</p>
    `;

    card.addEventListener("click", function () {
      localStorage.setItem("selectedMemory", index);
      window.location.href = "view-memory.html";
    });
    container.appendChild(card);
  }
}

loadMemories();

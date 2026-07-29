console.log("memories.js is running!");
const container = document.getElementById("memoriesContainer");

async function loadMemories() {
  const memories = await window.memoryAPI.loadMemories();
  console.log(memories);
  for (const memory of memories) {
    console.log(memory.title);
  }
}

loadMemories();

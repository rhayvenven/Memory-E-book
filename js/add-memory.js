const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");

imageInput.addEventListener("change", function () {
  const file = imageInput.files[0];
  if (file) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.classList.add("preview-image");
    gallery.appendChild(img);
  }
});

const saveButton = document.querySelector(".save-btn");
saveButton.addEventListener("click", function () {
  console.log("Save button clicked!");
  const title = titleInput.value;
  const story = storyInput.value;
  console.log(title);
  console.log(story);
  const memory = {
    title: title,
    story: story,
  };
  window.memoryAPI.saveMemory(memory);
});

const titleInput = document.getElementById("memoryTitle");
const storyInput = document.getElementById("story");

async function testLoad() {
  const memories = await window.memoryAPI.loadMemories();
  console.log(memories);
}

testLoad();

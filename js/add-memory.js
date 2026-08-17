const imageInput = document.getElementById("imageInput");
const gallery = document.getElementById("gallery");
const selectedImages = [];
const saveImagePaths = [];
let selectedMood = null;
const selectedTags = [];
console.log(selectedImages);
imageInput.addEventListener("change", async function () {
  const files = imageInput.files;
  for (const file of files) {
    selectedImages.push(file);

    const previewUrl = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.src = previewUrl;
    img.classList.add("preview-image");
    gallery.appendChild(img);

    const buffer = await file.arrayBuffer();

    const imagePath = await window.memoryAPI.saveImage({
      name: file.name,
      file: file.type,
      data: buffer,
    });
    console.log("Save image path:", imagePath);
    saveImagePaths.push(imagePath);
  }
  console.log(selectedImages);
});
function selectEmoji(emoji, button) {
  selectedMood = emoji;
  document.querySelectorAll(".emoji-button").forEach(function (btn) {
    btn.classList.remove("selected");
  });
  button.classList.add("selected");
}
function selectTag(tag, button) {
  const tagIndex = selectedTags.indexOf(tag);
  if (tagIndex === -1) {
    selectedTags.push(tag);
    button.classList.add("selected");
  } else {
    selectedTags.splice(tagIndex, 1);
    button.classList.remove("selected");
  }
}
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
    images: saveImagePaths,
    mood: selectedMood,
    tags: selectedTags,
    date: new Date().toISOString(),
  };
  console.log(memory);
  window.memoryAPI.saveMemory(memory);
  window.location.href = "memories.html";
});

const titleInput = document.getElementById("memoryTitle");
const storyInput = document.getElementById("story");

async function testLoad() {
  const memories = await window.memoryAPI.loadMemories();
  console.log(memories);
}

testLoad();

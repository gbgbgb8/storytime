const md = new markdownit();

function setRandomSplashImage() {
  const randomNumber = Math.floor(Math.random() * 4) + 1;
  document.getElementById('splash-image').src = `splash${randomNumber}.jpg`;
}

async function isPlaceholderStory(folder) {
  try {
    const response = await fetch(`stories/morestories/${folder}/story.json`);
    if (!response.ok) return true;
    const storyData = await response.json();
    return storyData.placeholder === true;
  } catch (e) {
    console.error(`Error in isPlaceholderStory for folder ${folder}:`, e);
    return true;
  }
}

async function discoverStories() {
  const storyFolders = Array.from({length: 99}, (_, i) => String(i + 1).padStart(2, '0'));
  const storyList = [];
  for (const folder of storyFolders) {
    const isPlaceholder = await isPlaceholderStory(folder);
    if (!isPlaceholder) storyList.push(folder);
  }
  return storyList;
}

async function populateStories() {
  loadStory("01");
  document.getElementById('spinner').classList.remove('d-none');
  const stories = await discoverStories();
  const selectElement = document.getElementById("story-select");
  stories.forEach(story => {
    const option = document.createElement('option');
    option.text = story;
    option.value = story;
    selectElement.appendChild(option);
  });
  if (stories.length > 0 && !stories.includes("01")) {
    loadStory(stories[Math.floor(Math.random() * stories.length)]);
  }
  document.getElementById('spinner').classList.add('d-none');
}

async function loadImageExists(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

async function loadStory(storyName) {
  const response = await fetch(`stories/morestories/${storyName}/story.json`);
  const gameData = await response.json();

  async function updatePage(pageNumber) {
    const pageData = gameData.pages[pageNumber];
    const randomImageSuffix = String.fromCharCode(97 + Math.floor(Math.random() * 3));
    const imagePath = `stories/morestories/${storyName}/page${pageNumber}-${randomImageSuffix}.jpg`;
    const placeholderPath = `stories/morestories/00/placeholder-${randomImageSuffix}.jpg`;
    
    const imageExists = await loadImageExists(imagePath);
    document.getElementById('game-image').src = imageExists ? imagePath : placeholderPath;
    
    document.getElementById('narrative-text').innerHTML = md.render(pageData.text);
    document.getElementById('optionA').innerText = pageData.options[0].text;
    document.getElementById('optionB').innerText = pageData.options[1].text;
    document.getElementById('optionA').onclick = () => updatePage(pageData.options[0].nextPage);
    document.getElementById('optionB').onclick = () => updatePage(pageData.options[1].nextPage);
  }

  document.getElementById('splash-image').classList.add('d-none');
  document.getElementById('game-image').classList.remove('d-none');
  updatePage("1");
}

document.getElementById('mode-toggle').addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
  document.getElementById('fab-controls').classList.add('d-none');
});

document.getElementById('story-select').addEventListener('change', function() {
  loadStory(this.value);
  document.getElementById('fab-controls').classList.add('d-none');
});

setRandomSplashImage();
populateStories();

document.getElementById('fab-button').addEventListener('click', function() {
  const controls = document.getElementById('fab-controls');
  controls.classList.toggle('d-none');
});

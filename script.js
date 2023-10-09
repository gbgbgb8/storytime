async function isPlaceholderStory(folder) {
    const response = await fetch(`stories/morestories/${folder}/story.json`);
    if (!response.ok) return true;
    const storyData = await response.json();
    return storyData.placeholder === true;
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
    document.getElementById('spinner').classList.remove('d-none');
    const stories = await discoverStories();
    const selectElement = document.getElementById("story-select");
    stories.forEach(story => {
        const option = document.createElement('option');
        option.text = story;
        option.value = story;
        selectElement.appendChild(option);
    });
    if (stories.length > 0) loadStory(stories[Math.floor(Math.random() * stories.length)]);
    document.getElementById('spinner').classList.add('d-none');
}

async function loadStory(storyName) {
    const response = await fetch(`stories/morestories/${storyName}/story.json`);
    const gameData = await response.json();

    document.getElementById('splash-image').classList.add('d-none');
    document.getElementById('game-image').classList.remove('d-none');

    function getRandomImage(pageNumber) {
        const images = [
            `stories/morestories/${storyName}/page${pageNumber}-a.jpg`,
            `stories/morestories/${storyName}/page${pageNumber}-b.jpg`,
            `stories/morestories/${storyName}/page${pageNumber}-c.jpg`
        ];
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    }

    function updatePage(pageNumber) {
        const pageData = gameData.pages[pageNumber];
        document.getElementById('game-image').src = getRandomImage(pageNumber);
        document.getElementById('narrative-text').innerHTML = pageData.text;
        document.getElementById('optionA').innerText = pageData.options[0].text;
        document.getElementById('optionB').innerText = pageData.options[1].text;
        document.getElementById('optionA').onclick = () => updatePage(pageData.options[0].nextPage);
        document.getElementById('optionB').onclick = () => updatePage(pageData.options[1].nextPage);
    }

    updatePage("1");
}

document.getElementById('mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    document.getElementById('fab-controls').classList.add('d-none');
});

if (!document.body.classList.contains('dark-mode')) {
    document.body.classList.add('dark-mode');
}

document.getElementById('story-select').addEventListener('change', function() {
    loadStory(this.value);
    document.getElementById('fab-controls').classList.add('d-none');
});

populateStories();

document.getElementById('fab-button').addEventListener('click', function() {
    const controls = document.getElementById('fab-controls');
    controls.classList.toggle('d-none');
});

document.querySelectorAll('.fab-controls button, .fab-controls select').forEach(el => {
    el.addEventListener('click', function() {
        document.getElementById('fab-controls').classList.add('d-none');
    });
});

const splashImages = ['splash1.jpg', 'splash2.jpg', 'splash3.jpg', 'splash4.jpg'];
const randomSplashIndex = Math.floor(Math.random() * splashImages.length);
document.getElementById('splash-image').src = splashImages[randomSplashIndex];

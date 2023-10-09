const md = new markdownit();

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

    function updatePage(pageNumber) {
        const pageData = gameData.pages[pageNumber];
        document.getElementById('game-image').src = `stories/morestories/${storyName}/page${pageNumber}.jpg`;
        document.getElementById('narrative-text').innerHTML = md.render(pageData.text);
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

document.getElementById('story-select').addEventListener('change', function() {
    loadStory(this.value);
    document.getElementById('fab-controls').classList.add('d-none');
});

populateStories();

document.getElementById('fab-button').addEventListener('click', function() {
    const controls = document.getElementById('fab-controls');
    controls.classList.toggle('d-none');
});

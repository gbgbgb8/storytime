async function populateStories() {
    try {
        const stories = ['default', 'catonabeach', 'example1'];
        const selectElement = document.getElementById('story-select');
        stories.forEach(story => {
            addStoryOption(selectElement, story);
        });
        loadStory(stories[0]);
    } catch (error) {
        displayError(error);
    }
}

function addStoryOption(selectElement, story) {
    const option = document.createElement('option');
    option.text = story;
    option.value = story;
    selectElement.appendChild(option);
}

async function loadStory(storyName) {
    try {
        const response = await fetch(`stories/${storyName}/story.json`);
        if (!response.ok) {
            throw new Error('Failed to load story.');
        }
        const gameData = await response.json();
        updatePage("1", gameData);
    } catch (error) {
        displayError(error);
    }
}

function updatePage(pageNumber, gameData) {
    const pageData = gameData.pages[pageNumber];
    document.getElementById('game-image').src = getRandomImage(pageNumber, gameData);
    document.getElementById('narrative-text').innerHTML = pageData.text;
    const optionA = pageData.options[0];
    const optionB = pageData.options[1];
    setOptionButton('optionA', optionA, gameData);
    setOptionButton('optionB', optionB, gameData);
}

function setOptionButton(buttonId, option, gameData) {
    const button = document.getElementById(buttonId);
    button.innerText = option.text;
    button.onclick = () => updatePage(option.nextPage, gameData);
}

function getRandomImage(pageNumber, gameData) {
    const images = [
        `stories/${gameData.name}/page${pageNumber}-a.jpg`,
        `stories/${gameData.name}/page${pageNumber}-b.jpg`,
        `stories/${gameData.name}/page${pageNumber}-c.jpg`
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}

function displayError(error) {
    // Implement Bootstrap alert for displaying error
}

document.getElementById('mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

document.getElementById('story-select').addEventListener('change', function() {
    loadStory(this.value);
});

document.getElementById('fab-button').addEventListener('click', function() {
    toggleFabControls();
});

document.querySelectorAll('.fab-controls button, .fab-controls select').forEach(el => {
    el.addEventListener('click', function() {
        toggleFabControls(true);
    });
});

function toggleFabControls(hide = false) {
    const controls = document.getElementById('fab-controls');
    if (hide) {
        controls.classList.add('hidden');
    } else {
        controls.classList.toggle('hidden');
    }
}

populateStories();

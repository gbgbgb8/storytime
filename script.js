async function populateStories() {
    const stories = ['default', 'catonabeach', 'example1'];
    const selectElement = document.getElementById('story-select');
    stories.forEach(story => {
        const option = document.createElement('option');
        option.text = story;
        option.value = story;
        selectElement.appendChild(option);
    });
    loadStory(stories[0]);
}

async function loadStory(storyName) {
    const response = await fetch(`stories/${storyName}/story.json`);
    const gameData = await response.json();

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

document.getElementById('fab-button').addEventListener('click', function() {
    const controls = document.getElementById('fab-controls');
    controls.classList.toggle('hidden');
});

populateStories();

// Populate story dropdown dynamically
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
  
  // Load a selected story
  async function loadStory(storyName) {
    const response = await fetch(`stories/${storyName}/story.json`);
    const gameData = await response.json();
  
    function getRandomImage(pageNumber) {
      const images = [
        `stories/${storyName}/page${pageNumber}-a.jpg`,
        `stories/${storyName}/page${pageNumber}-b.jpg`,
        `stories/${storyName}/page${pageNumber}-c.jpg`
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
  
  // Toggle dark mode
  document.getElementById('mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('bg-dark');
  });
  
  // Initialize dark mode if not set
  if (!document.body.classList.contains('bg-dark')) {
    document.body.classList.add('bg-dark');
  }
  
  // Listen for story selection change
  document.getElementById('story-select').addEventListener('change', function() {
    loadStory(this.value);
  });
  
  // Populate stories and initialize
  populateStories();
  
// Load JSON Data from a local file
fetch('story.json')
  .then(response => response.json())
  .then(data => {
    const gameData = data;

    function getRandomImage(pageNumber) {
      const images = [
        `page${pageNumber}-a.jpg`,
        `page${pageNumber}-b.jpg`,
        `page${pageNumber}-c.jpg`
      ];
      const randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex];
    }

    function updatePage(pageNumber) {
      const pageData = gameData.pages[pageNumber];
      document.getElementById('game-image').src = getRandomImage(pageNumber);
      document.getElementById('narrative-text').querySelector('.card-body').innerHTML = pageData.text;
      document.getElementById('optionA').innerText = pageData.options[0].text;
      document.getElementById('optionB').innerText = pageData.options[1].text;
      document.getElementById('optionA').onclick = () => updatePage(pageData.options[0].nextPage);
      document.getElementById('optionB').onclick = () => updatePage(pageData.options[1].nextPage);
    }

    updatePage("1");
  });

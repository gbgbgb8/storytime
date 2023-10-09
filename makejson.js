function addPage(i, data = {}) {
    const newPage = document.createElement('div');
    newPage.className = 'page card';
    newPage.id = `page-${i}`;
    newPage.innerHTML = `
      <div class="card-header">
        <h2>Page ${i}</h2>
      </div>
      <div class="card-body">
        <label>Narrative Text: <textarea name="text-${i}" class="expandable">${data.text || ''}</textarea></label><br>
        <label>Setting: <input type="text" name="setting-${i}" value="${data.metadata?.Setting || ''}"></label><br>
        <label>Time: <input type="text" name="time-${i}" value="${data.metadata?.Time || ''}"></label><br>
        <label>Option A Text: <textarea name="optionA-${i}" class="expandable">${data.options?.[0]?.text || ''}</textarea></label><br>
        <label>Option A Next Page: <input type="text" name="optionA-next-${i}" value="${data.options?.[0]?.nextPage || ''}"></label><br>
        <label>Option B Text: <textarea name="optionB-${i}" class="expandable">${data.options?.[1]?.text || ''}</textarea></label><br>
        <label>Option B Next Page: <input type="text" name="optionB-next-${i}" value="${data.options?.[1]?.nextPage || ''}"></label><br>
      </div>
    `;
    document.getElementById('pages').appendChild(newPage);
    autoGenerateJSON();
  }
  
  function autoGenerateJSON() {
    const jsonData = { pages: {} };
    for (const pageDiv of document.querySelectorAll('.page')) {
      const i = pageDiv.id.split('-')[1];
      const form = document.forms['json-form'];
      jsonData.pages[i] = {
        text: form[`text-${i}`].value,
        metadata: {
          Setting: form[`setting-${i}`].value,
          Time: form[`time-${i}`].value
        },
        options: [
          {
            text: form[`optionA-${i}`].value,
            nextPage: form[`optionA-next-${i}`].value
          },
          {
            text: form[`optionB-${i}`].value,
            nextPage: form[`optionB-next-${i}`].value
          }
        ]
      };
    }
    document.getElementById('json-output').textContent = JSON.stringify(jsonData, null, 2);
  }
  
  addPage(1);
  
  document.getElementById('add-page').addEventListener('click', function() {
    const nextPage = document.querySelectorAll('.page').length + 1;
    addPage(nextPage);
  });
  
  document.getElementById('json-form').addEventListener('input', autoGenerateJSON);
  
  document.getElementById('import-json').addEventListener('change', function() {
    const fileInput = document.getElementById('import-json');
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const jsonData = JSON.parse(e.target.result);
        document.getElementById('pages').innerHTML = '';
        for (const [i, data] of Object.entries(jsonData.pages)) {
          addPage(i, data);
        }
      };
      reader.readAsText(file);
    }
  });
  
  document.getElementById('import-button').addEventListener('click', function() {
    document.getElementById('import-json').click();
  });
  
  document.getElementById('copy-json').addEventListener('click', function() {
    const jsonText = document.getElementById('json-output').textContent;
    navigator.clipboard.writeText(jsonText).then(function() {
      alert('JSON copied to clipboard');
    }).catch(function(err) {
      alert('Could not copy JSON: ', err);
    });
  });
  
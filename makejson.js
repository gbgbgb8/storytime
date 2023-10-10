function addPage(i, data = {}) {
    const newPage = document.createElement('div');
    newPage.className = 'page card bg-dark text-light mb-3';
    newPage.id = `page-${i}`;
    newPage.innerHTML = `
      <div class="card-header">
        <h5 class="card-title">Page ${i}</h5>
      </div>
      <div class="card-body">
        <label for="text-${i}" class="form-label">Narrative Text:</label>
        <textarea id="text-${i}" name="text-${i}" class="form-control bg-secondary text-light" rows="5">${data.text || ''}</textarea>
        <label for="setting-${i}" class="form-label mt-2">Setting:</label>
        <input type="text" id="setting-${i}" name="setting-${i}" class="form-control bg-secondary text-light" value="${data.metadata?.Setting || ''}">
        <label for="time-${i}" class="form-label mt-2">Time:</label>
        <input type="text" id="time-${i}" name="time-${i}" class="form-control bg-secondary text-light" value="${data.metadata?.Time || ''}">
        <label for="optionA-${i}" class="form-label mt-2">Option A Text:</label>
        <textarea id="optionA-${i}" name="optionA-${i}" class="form-control bg-secondary text-light" rows="3">${data.options?.[0]?.text || ''}</textarea>
        <label for="optionA-next-${i}" class="form-label mt-2">Option A Next Page:</label>
        <input type="text" id="optionA-next-${i}" name="optionA-next-${i}" class="form-control bg-secondary text-light" value="${data.options?.[0]?.nextPage || ''}">
        <label for="optionB-${i}" class="form-label mt-2">Option B Text:</label>
        <textarea id="optionB-${i}" name="optionB-${i}" class="form-control bg-secondary text-light" rows="3">${data.options?.[1]?.text || ''}</textarea>
        <label for="optionB-next-${i}" class="form-label mt-2">Option B Next Page:</label>
        <input type="text" id="optionB-next-${i}" name="optionB-next-${i}" class="form-control bg-secondary text-light" value="${data.options?.[1]?.nextPage || ''}">
      </div>
    `;
    document.getElementById('pages').appendChild(newPage);
}

document.addEventListener('DOMContentLoaded', function () {
  addPage(1);

  document.getElementById('add-page').addEventListener('click', function () {
    const nextPage = document.querySelectorAll('.page').length + 1;
    addPage(nextPage);
  });

  document.getElementById('generate-json').addEventListener('click', function () {
    const jsonData = {
      pages: {}
    };

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
  });

  document.getElementById('download-json').addEventListener('click', function () {
    const jsonText = document.getElementById('json-output').textContent;
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'story.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  });

  document.getElementById('import-button').addEventListener('click', function () {
    document.getElementById('import-json').click();
  });

  document.getElementById('import-json').addEventListener('change', function () {
    const fileInput = document.getElementById('import-json');
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const jsonData = JSON.parse(e.target.result);
        document.getElementById('pages').innerHTML = '';
        for (const [i, data] of Object.entries(jsonData.pages)) {
          addPage(i, data);
        }
      };
      reader.readAsText(file);
    }
  });

  document.getElementById('copy-json').addEventListener('click', function () {
    const jsonText = document.getElementById('json-output').textContent;
    navigator.clipboard.writeText(jsonText).then(function () {
      alert('JSON copied to clipboard');
    }).catch(function (err) {
      alert('Could not copy JSON: ', err);
    });
  });

  document.getElementById('info-button').addEventListener('click', function () {
    var myModal = new bootstrap.Modal(document.getElementById('info-modal'));
    myModal.show();
  });

  document.getElementById('flowchart-button').addEventListener('click', function () {
    const flowchartDiv = document.getElementById('flowchart');
    flowchartDiv.innerHTML = '';
    const form = document.forms['json-form'];
    const connections = [];
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNamespace, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    flowchartDiv.appendChild(svg);

    for (const pageDiv of document.querySelectorAll('.page')) {
      const i = pageDiv.id.split('-')[1];
      const optionA = form[`optionA-next-${i}`].value;
      const optionB = form[`optionB-next-${i}`].value;
      if (optionA) connections.push({ from: i, to: optionA });
      if (optionB) connections.push({ from: i, to: optionB });
      const flowchartElement = document.createElement('div');
      flowchartElement.className = 'flowchart-element';
      flowchartElement.id = `flowchart-element-${i}`;
      flowchartElement.innerHTML = `
        <p class="btn btn-primary">${i}</p>
      `;
      flowchartDiv.appendChild(flowchartElement);
    }

    for (const connection of connections) {
      const fromElement = document.getElementById(`flowchart-element-${connection.from}`);
      const toElement = document.getElementById(`flowchart-element-${connection.to}`);
      if (fromElement && toElement) {
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        const line = document.createElementNS(svgNamespace, 'line');
        line.setAttribute('x1', fromRect.right);
        line.setAttribute('y1', fromRect.top + fromRect.height
        / 2);
        line.setAttribute('x2', toRect.left);
        line.setAttribute('y2', toRect.top + toRect.height / 2);
        line.setAttribute('stroke', 'black');
        svg.appendChild(line);
      }
    }
  });
});

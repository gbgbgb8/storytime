document.addEventListener('DOMContentLoaded', function () {
    addPage(1);

    document.getElementById('add-page').addEventListener('click', function () {
        const nextPage = document.querySelectorAll('.page').length + 1;
        addPage(nextPage);
    });

    document.getElementById('generate-json').addEventListener('click', function () {
        const jsonData = generateJsonData();
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
                document.getElementById('story-title').value = jsonData.title;
                document.getElementById('story-author').value = jsonData.author;
                document.getElementById('story-comments').value = jsonData.comments;
                document.getElementById('pages').innerHTML = '';
                Object.entries(jsonData.pages).forEach(([i, data]) => {
                    addPage(i, data);
                });
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

    document.getElementById('flowchart-button').addEventListener('click', function () {
        const jsonData = generateJsonData();
        const { nodes, edges } = createFlowchartData(jsonData);
        displayFlowchart(nodes, edges);
    });
});

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

function generateJsonData() {
    const jsonData = {
        title: document.getElementById('story-title').value,
        author: document.getElementById('story-author').value,
        comments: document.getElementById('story-comments').value,
        pages: {}
    };
    document.querySelectorAll('.page').forEach(pageDiv => {
        const i = pageDiv.id.split('-')[1];
        jsonData.pages[i] = {
            text: document.forms['json-form'][`text-${i}`].value,
            metadata: {
                Setting: document.forms['json-form'][`setting-${i}`].value,
                Time: document.forms['json-form'][`time-${i}`].value
            },
            options: [
                {
                    text: document.forms['json-form'][`optionA-${i}`].value,
                    nextPage: document.forms['json-form'][`optionA-next-${i}`].value
                },
                {
                    text: document.forms['json-form'][`optionB-${i}`].value,
                    nextPage: document.forms['json-form'][`optionB-next-${i}`].value
                }
            ]
        };
    });
    return jsonData;
}

function createFlowchartData(jsonData) {
    const nodes = [];
    const edges = [];

    Object.entries(jsonData.pages).forEach(([pageId, pageData]) => {
        nodes.push({ id: pageId, label: `Page ${pageId}` });
        pageData.options.forEach((option, index) => {
            if (option.nextPage) {
                edges.push({ from: pageId, to: option.nextPage, label: `Option ${index + 1}: ${option.text}` });
            }
        });
    });

    return { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
}

function displayFlowchart(nodes, edges) {
    const container = document.getElementById('flowchart');
    const data = { nodes, edges };
    const options = {}; // Define your vis.js options here
    new vis.Network(container, data, options);
    $('#flowchart-modal').modal('show');
}

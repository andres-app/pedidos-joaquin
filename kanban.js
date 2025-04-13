document.addEventListener('DOMContentLoaded', (event) => {
    loadProjects();
});

let currentProject = '';

function loadProjects() {
    fetch('projects.json')
    .then(response => response.json())
    .then(projects => {
        const projectList = document.getElementById('project-list');
        projects.forEach(project => {
            let projectItem = document.createElement('a');
            projectItem.className = 'list-group-item list-group-item-action';
            projectItem.innerText = project.name;
            projectItem.id = project.id;
            projectItem.onclick = () => {
                loadKanbanBoard(project.id);
            };
            projectList.appendChild(projectItem);
        });

        if (projects.length > 0) {
            loadKanbanBoard(projects[0].id); // Load the first project by default
        }
    });
}

function loadKanbanBoard(projectId) {
    currentProject = projectId;
    fetch(`data-${projectId}.json`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('todo').innerHTML = '';
        document.getElementById('inprogress').innerHTML = '';
        document.getElementById('done').innerHTML = '';
        for (let columnId in data) {
            let column = document.getElementById(columnId);
            for (let cardData of data[columnId]) {
                let cardElement = createCardElement(cardData);
                column.appendChild(cardElement);
            }
        }        
        updateActiveProject(projectId);
    });
}

function updateActiveProject(projectId) {
    const projectListItems = document.querySelectorAll('#project-list .list-group-item');
    projectListItems.forEach(item => {
        item.classList.remove('active');
    });
    document.getElementById(projectId).classList.add('active');
}

let targetColumn = 'todo'; // por defecto

function addCard(columnId) {
    targetColumn = columnId;
    $('#modalNuevaTarea').modal('show');
}


document.getElementById('formNuevaTarea').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    const cliente = formData.get('cliente');
    const celular = formData.get('celular');
    const entrega = formData.get('entrega');
    const fecha_pago = formData.get('fecha_pago');
    const precio = formData.get('precio');
    const adelanto = formData.get('adelanto');
    const medio_pago = formData.get('medio_pago');

    const newCardData = {
        cliente,
        celular,
        entrega,
        fecha_pago,
        precio,
        adelanto,
        medio_pago
    };

    const card = createCardElement(newCardData);
    document.getElementById(targetColumn).prepend(card);

    saveCards();
    $('#modalNuevaTarea').modal('hide');
    this.reset();
});




function createCardElement(data) {
    const {
        cliente = '',
        celular = '',
        entrega = '',
        fecha_pago = '',
        precio = '',
        adelanto = '',
        medio_pago = ''
    } = data;

    const card = document.createElement('div');
    card.className = 'kanban-card p-2 mb-2 bg-light border rounded';
    card.draggable = true;
    card.id = generateId();
    card.ondragstart = drag;

    card.innerHTML = `
        <div><strong>${cliente}</strong></div>
        <div class="text-muted mb-2">${celular}</div>
        <div><strong>Entrega:</strong> ${entrega}</div>
        <div><strong>Pago:</strong> ${fecha_pago}</div>
        <div><strong>Precio:</strong> S/.${precio} | <strong>Adelanto:</strong> S/.${adelanto}</div>
        <div><strong>Medio:</strong> ${medio_pago}</div>
    `;

    return card;
}



function assignTask(button) {
    let assignee = prompt("Ingrese el nombre de la persona asignada:");
    if (assignee) {
        let card = button.parentElement;
        let assigneeDiv = card.querySelector('.assignee');
        assigneeDiv.innerHTML = '<span class="badge bg-warning text-white">Asignado a: ' + assignee + '</span>';
        saveCards();
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var card = document.getElementById(data);
    
    if (ev.target.className.includes('kanban-cards')) {
        ev.target.appendChild(card);
        saveCards();
    } else if (ev.target.parentElement.className.includes('kanban-cards')) {
        ev.target.parentElement.appendChild(card);
        saveCards();
    }
}

function saveCards() {
    let columns = document.getElementsByClassName('kanban-cards');
    let data = {
        todo: [],
        inprogress: [],
        done: []
    };

    for (let column of columns) {
        let columnId = column.id;
        for (let card of column.children) {
            let cliente = card.querySelector('div:nth-child(1)')?.innerText?.split('\n')[0] || '';
            let celular = card.querySelector('div:nth-child(1) small')?.innerText || '';
            let entrega = card.querySelector('div:nth-child(2)')?.innerText?.replace('Entrega: ', '') || '';
            let fecha_pago = card.querySelector('div:nth-child(3)')?.innerText?.replace('Pago: ', '') || '';
            let precios = card.querySelector('div:nth-child(4)')?.innerText?.match(/([\d.,]+)/g) || [];
            let medio_pago = card.querySelector('div:nth-child(5)')?.innerText?.replace('Medio: ', '') || '';
            let precio = precios[0] || '';
            let adelanto = precios[1] || '';

            data[columnId].push({
                cliente,
                celular,
                entrega,
                fecha_pago,
                precio,
                adelanto,
                medio_pago
            });
        }
    }

    fetch(`save.php?project=${currentProject}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}


function generateId() {
    return 'card-' + Math.random().toString(36).substr(2, 9);
}

document.addEventListener('dragover', allowDrop);
document.addEventListener('drop', drop);

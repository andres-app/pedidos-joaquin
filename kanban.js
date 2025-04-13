let modoEdicion = false;
let tarjetaEnEdicion = null;


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
    modoEdicion = false;
    tarjetaEnEdicion = null;

    // Ajustes visuales del modal para CREAR
    document.querySelector('#modalNuevaTarea .modal-title').innerText = 'Crear nuevo pedido';
    const submitBtn = document.querySelector('#modalNuevaTarea button[type="submit"]');
    submitBtn.innerText = 'Crear Pedido';
    submitBtn.classList.remove('btn-warning');
    submitBtn.classList.add('btn-success');

    $('#modalNuevaTarea').modal('show');
}




const formNuevaTarea = document.getElementById('formNuevaTarea');

const defaultSubmitHandler = function (e) {
    e.preventDefault();

    const formData = new FormData(formNuevaTarea);

    const cliente = formData.get('cliente');
    const mensaje = formData.get('mensaje');
    const celular = formData.get('celular');
    const entrega = formatFechaHora(formData.get('entrega'));
    const fecha_pago = formatFechaSimple(formData.get('fecha_pago'));    
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
        medio_pago,
        mensaje
    };

    const card = createCardElement(newCardData);
    document.getElementById(targetColumn).prepend(card);

    saveCards();
    $('#modalNuevaTarea').modal('hide');
    formNuevaTarea.reset();
};

formNuevaTarea.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(formNuevaTarea);

    const cliente = formData.get('cliente');
    const celular = formData.get('celular');
    const entrega = formatFechaHora(formData.get('entrega'));
    const fecha_pago = formatFechaSimple(formData.get('fecha_pago'));
    const precio = formData.get('precio');
    const adelanto = formData.get('adelanto');
    const medio_pago = formData.get('medio_pago');
    const mensaje = formData.get('mensaje');

    const nuevaData = {
        cliente,
        celular,
        entrega,
        fecha_pago,
        precio,
        adelanto,
        medio_pago,
        mensaje
    };

    if (modoEdicion && tarjetaEnEdicion) {
        // Editar tarjeta existente
        const card = tarjetaEnEdicion.card;
        const data = tarjetaEnEdicion.data;

        // Actualizar los datos
        Object.assign(data, nuevaData);

        const updatedCard = createCardElement(data, card.id);
        card.replaceWith(updatedCard);
    } else {
        // Crear nueva tarjeta
        const card = createCardElement(nuevaData);
        document.getElementById(targetColumn).prepend(card);
    }

    saveCards();
    $('#modalNuevaTarea').modal('hide');
    formNuevaTarea.reset();
    modoEdicion = false;
    tarjetaEnEdicion = null;
});






function createCardElement(data, customId = null) {
    const {
        cliente = '',
        celular = '',
        entrega = '',
        fecha_pago = '',
        precio = '',
        adelanto = '',
        medio_pago = '',
        mensaje = ''
    } = data;

    const card = document.createElement('div');
    card.className = 'kanban-card p-3 mb-3 rounded shadow-sm text-center';
    card.draggable = true;
    card.id = customId || generateId();
    card.ondragstart = drag;

    card.innerHTML = `
        <div class="text-muted">${celular}</div>
        <h5 class="font-weight-bold mb-2">${cliente}</h5>
        <div class="text-left">
            <p><strong>Entregar el:</strong> ${entrega}</p>
            <p><strong>Mensaje:</strong> ${mensaje || '-'}</p>
            <p><strong>Precio:</strong> S/.${precio} <br><strong>Adelanto:</strong> S/.${adelanto}</p>
            <p><strong>Medio de pago:</strong> ${medio_pago}</p>
            <p><strong>Fecha de pago:</strong> ${fecha_pago}</p>
        </div>
        <div class="d-flex justify-content-around mt-2">
            <button class="btn btn-sm btn-warning">Editar</button>
            <button class="btn btn-sm btn-danger">Eliminar</button>
        </div>
    `;

    // Botón Eliminar
    card.querySelector('.btn-danger').addEventListener('click', () => {
        if (confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
            card.remove();
            saveCards();
        }
    });

    // Botón Editar
    card.querySelector('.btn-warning').addEventListener('click', () => {
        editarTarea(card, data);
    });

    return card;
}


function toDatetimeLocal(str) {
    const [date, timeWithAmPm] = str.split(' ');
    if (!date || !timeWithAmPm) return '';
    const [day, month, year] = date.split('/');
    let [time, ampm] = timeWithAmPm.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return `${year}-${month}-${day}T${hours.toString().padStart(2, '0')}:${minutes}`;
}

function toDateISO(str) {
    const [day, month, year] = str.split('/');
    return `${year}-${month}-${day}`;
}


function editarTarea(card, data) {
    const form = document.getElementById('formNuevaTarea');

    // Activamos modo edición
    modoEdicion = true;
    tarjetaEnEdicion = { card, data };

    form.cliente.value = data.cliente;
    form.celular.value = data.celular;
    form.entrega.value = toDatetimeLocal(data.entrega);
    form.fecha_pago.value = toDateISO(data.fecha_pago);
    form.precio.value = data.precio;
    form.adelanto.value = data.adelanto;
    form.medio_pago.value = data.medio_pago;
    form.mensaje.value = data.mensaje;

    // Ajustes visuales del modal para EDITAR
    document.querySelector('#modalNuevaTarea .modal-title').innerText = 'Editar pedido';
    const submitBtn = document.querySelector('#modalNuevaTarea button[type="submit"]');
    submitBtn.innerText = 'Guardar cambios';
    submitBtn.classList.remove('btn-success');
    submitBtn.classList.add('btn-warning');

    $('#modalNuevaTarea').modal('show');
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

function formatFechaHora(fechaISO) {
    if (!fechaISO) return '';
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const ampm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12 || 12;
    return `${dia}/${mes}/${anio} ${horas}:${minutos} ${ampm}`;
}

function formatFechaSimple(fechaISO) {
    if (!fechaISO) return '';
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
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
            const campos = card.querySelectorAll('div');

            const celular = campos[0]?.innerText.trim();
            const cliente = card.querySelector('h5')?.innerText.trim();

            // Extraemos los campos del bloque de información
            const info = card.querySelectorAll('.text-left p');
            const entrega = info[0]?.innerText.replace('Entregar el:', '').trim();
            const mensaje = info[1]?.innerText.replace('Mensaje:', '').trim();
            const precio = info[2]?.innerText.match(/S\/\.(\d+\.?\d*)/)?.[1] || '';
            const adelanto = info[2]?.innerText.match(/Adelanto: S\/\.(\d+\.?\d*)/)?.[1] || '';
            const medio_pago = info[3]?.innerText.replace('Medio de pago:', '').trim();
            const fecha_pago = info[4]?.innerText.replace('Fecha de pago:', '').trim();

            data[columnId].push({
                cliente,
                celular,
                entrega,
                mensaje,
                precio,
                adelanto,
                medio_pago,
                fecha_pago
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

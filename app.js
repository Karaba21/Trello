document.addEventListener('DOMContentLoaded', function () {
    const addTaskBtn = document.getElementById('add-task-btn');
    const saveTaskBtn = document.getElementById('save-task-btn');
    const modal = document.getElementById('taskModal');
    const closeModalButtons = document.querySelectorAll('.delete, .cancelModal');

    // Mostrar el modal cuando se hace clic en "Add Task"
    addTaskBtn.addEventListener('click', function () {
        modal.classList.add('is-active');
    });

    // Cerrar el modal
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function () {
            modal.classList.remove('is-active');
        });
    });

    // Guardar la tarea y agregarla al box de "To Do"
    saveTaskBtn.addEventListener('click', function () {
        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-description').value.trim();
        const assigned = document.getElementById('task-assigned').value;
        const priority = document.getElementById('task-priority').value;
        const deadline = document.getElementById('task-deadline').value;

        // Verificar que los campos no estén vacíos
        if (!title || !description || !assigned || !priority || !deadline) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        // Crear la nueva tarea como un elemento HTML
        const taskHTML = `
            <div class="box task">
                <h3 class="title is-6">${title}</h3>
                <p>${description}</p>
                <p><strong>Asignado:</strong> ${assigned}</p>
                <p><strong>Prioridad:</strong> ${priority}</p>
                <p><strong>Fecha límite:</strong> ${deadline}</p>
            </div>
        `;

        // Agregar la nueva tarea en la columna "To Do"
        const toDoTasksContainer = document.getElementById('to-do-tasks');
        toDoTasksContainer.insertAdjacentHTML('beforeend', taskHTML);

        // Cerrar el modal y limpiar los campos
        modal.classList.remove('is-active');
        document.getElementById('task-title').value = '';
        document.getElementById('task-description').value = '';
        document.getElementById('task-assigned').value = '';
        document.getElementById('task-priority').value = '';
        document.getElementById('task-deadline').value = '';
    });
});

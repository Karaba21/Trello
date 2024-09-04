document.addEventListener('DOMContentLoaded', function () {
    const addTaskBtn = document.getElementById('add-task-btn');
    const saveTaskBtn = document.getElementById('save-task-btn');
    const modal = document.getElementById('taskModal');
    const closeModalButtons = document.querySelectorAll('.delete, .cancelModal');
    let draggedTask = null;

    // Mostrar el modal cuando se hace clic en "Add Task"
    addTaskBtn.addEventListener('click', function () {
        modal.classList.add('is-active');
    });

    let tasksArray = [];

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
        const dueDate = document.getElementById('task-deadline').value;

        // Verificar que los campos no estén vacíos
        if (!title || !description || !assigned || !priority || !dueDate) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        // Crear un objeto de tarea
        const task = {
            title: title,
            description: description,
            assigned: assigned,
            priority: priority,
            dueDate: dueDate,
            status: 'To Do'
        };

        // Agregar la tarea al array de tareas
        tasksArray.push(task);
        console.log("Tareas guardadas:", tasksArray);

        // Crear la nueva tarea como un elemento HTML
        function createTaskHTML(task) {
            return `
                <div class="box task" draggable="true">
                    <h3 class="title is-6">${task.title}</h3>
                    <div class="task-field">
                        <h3>Descripción:</h3>
                        <p>${task.description}</p>
                    </div>
                    <div class="task-field">
                        <h3>Asignado a:</h3>
                        <p>${task.assigned}</p>
                    </div>
                    <div class="task-field">
                        <h3>Prioridad:</h3>
                        <p>${task.priority}</p>
                    </div>
                    <div class="task-field">
                        <h3>Fecha límite:</h3>
                        <p>${task.dueDate}</p>
                    </div>
                </div>
            `;
        }

        // Agregar la nueva tarea en la columna "To Do"
        const toDoTasksContainer = document.getElementById('to-do-tasks');
        toDoTasksContainer.insertAdjacentHTML('beforeend', taskHTML);

        // Habilitar drag y drop en la nueva tarea
        const newTask = toDoTasksContainer.lastElementChild;
        addDragAndDropEvents(newTask);

        // Cerrar el modal y limpiar los campos
        modal.classList.remove('is-active');
        document.getElementById('task-title').value = '';
        document.getElementById('task-description').value = '';
        document.getElementById('task-assigned').value = '';
        document.getElementById('task-priority').value = '';
        document.getElementById('task-deadline').value = '';
    });

    // Función para habilitar drag and drop en las tareas
    function addDragAndDropEvents(task) {
        task.addEventListener('dragstart', function (e) {
            draggedTask = e.target;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', e.target.innerHTML);
            setTimeout(() => {
                e.target.classList.add('is-hidden'); // Ocultar el task mientras es arrastrado
            }, 0);
        });

        task.addEventListener('dragend', function (e) {
            e.target.classList.remove('is-hidden'); // Mostrar el task después de soltarlo
            draggedTask = null;
        });
    }

    // Habilitar drag and drop para las tareas existentes en "To Do"
    document.querySelectorAll('.box.task').forEach(task => {
        addDragAndDropEvents(task);
    });

    // Habilitar drag and drop para las columnas
    const columns = document.querySelectorAll('.column');

    columns.forEach(column => {
        column.addEventListener('dragover', function (e) {
            e.preventDefault();
        });

        column.addEventListener('drop', function (e) {
            e.preventDefault();
            if (draggedTask) {
                const taskContainer = column.querySelector('.box.styled-boxes + div');
                taskContainer.appendChild(draggedTask);
            }
        });
    });

    
    
});

const url = "http://localhost:3000/tasks";

    async function fetchData() {
        try {
          const response = await fetch(url, { method: "GET" });
          const data = await response.json(); // extract JSON from response
          console.log(data);
          return data
        } catch (error) {
          console.log("Error fetching data: ", error);
        }
      }
      
fetchData();

fetchData().then((tasks) => {
    console.log("Tareas recibidas: ", tasks);
    tasks.forEach(task => {
      console.log("Tarea: ", task);
    });
  }).catch((error) => {
    console.log("Error al procesar las tareas: ", error);
  });
  fetchData().then((tasks) => {
    tasks.forEach(task => {
        const taskHTML = createTaskHTML(task);

        // Colocar la tarea en la columna correcta basada en su estado
        switch (task.status) {
            case 'To Do':
                document.getElementById('to-do-tasks').insertAdjacentHTML('beforeend', taskHTML);
                break;
            case 'In Progress':
                document.getElementById('in-progress-tasks').insertAdjacentHTML('beforeend', taskHTML);
                break;
            case 'Review':
                document.getElementById('review-tasks').insertAdjacentHTML('beforeend', taskHTML);
                break;
            case 'Blocked':
                document.getElementById('blocked-tasks').insertAdjacentHTML('beforeend', taskHTML);
                break;
            case 'Done':
                document.getElementById('done-tasks').insertAdjacentHTML('beforeend', taskHTML);
                break;
        }

        // Habilitar drag and drop en las tareas añadidas desde el servidor
        const lastTask = document.querySelectorAll('.box.task').item(-1); // Selecciona la última tarea insertada
        addDragAndDropEvents(lastTask);
    });
}).catch((error) => {
    console.log("Error al procesar las tareas: ", error);
});

document.addEventListener('DOMContentLoaded', function () {
    const addTaskBtn = document.getElementById('add-task-btn');
    const saveTaskBtn = document.getElementById('save-task-btn');
    const modal = document.getElementById('taskModal');
    const closeModalButtons = document.querySelectorAll('.delete, .cancelModal');
    let draggedTask = null;

    // Muestra el modal cuando se hace clic en "Add Task"
    addTaskBtn.addEventListener('click', function () {
        modal.classList.add('is-active');
    });

    const tasksArray = [];

    // Cerra el modal
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function () {
            modal.classList.remove('is-active');
        });
    });

    // Guarda la tarea y agregarla al box de "To Do"
    saveTaskBtn.addEventListener('click', function () {
        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-description').value.trim();
        const assigned = document.getElementById('task-assigned').value;
        const priority = document.getElementById('task-priority').value;
        const dueDate = document.getElementById('task-deadline').value;

        // Verifica que los campos no estén vacíos
        if (!title || !description || !assigned || !priority || !dueDate) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        // Crea un objeto de tarea
        const task = {
            title: title,
            description: description,
            assigned: assigned,
            priority: priority,
            dueDate: dueDate,
            status: 'To Do'
        };

        // Agrega la tarea al array de tareas
        tasksArray.push(task);
        console.log("Tareas guardadas:", tasksArray);

        const taskHTML = createTaskHTML(task);

        // Crea la nueva tarea como un elemento HTML
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


        //

       
        
        //para cada tarea de la lista despues del post recorrer el array y traerlo con la task nueva 

        // Agrega la nueva tarea en la columna "To Do"
        const toDoTasksContainer = document.getElementById('to-do-tasks');
        toDoTasksContainer.insertAdjacentHTML('beforeend', taskHTML);

        // Habilita drag y drop en la nueva tarea
        const newTask = toDoTasksContainer.lastElementChild;
        addDragAndDropEvents(newTask);

        // Cierra el modal y limpia los campos
        modal.classList.remove('is-active');
        document.getElementById('task-title').value = '';
        document.getElementById('task-description').value = '';
        document.getElementById('task-assigned').value = '';
        document.getElementById('task-priority').value = '';
        document.getElementById('task-deadline').value = '';

    })
    .catch(error => {
        console.error("Error al guardar la tarea:", error);
    });
    });

    // Función para habilitar drag and drop en las tareas
    function addDragAndDropEvents(task) {
        task.addEventListener('dragstart', function (e) {
            draggedTask = e.target;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', e.target.innerHTML);
            setTimeout(() => {
                e.target.classList.add('is-hidden'); // Oculta el task mientras es arrastrado
            }, 0);
        });

        task.addEventListener('dragend', function (e) {
            e.target.classList.remove('is-hidden'); // Muestra el task después de soltarlo
            draggedTask = null;
        });
    }

    // Habilita drag and drop para las tareas existentes en "To Do"
    document.querySelectorAll('.box.task').forEach(task => {
        addDragAndDropEvents(task);
    });

    // Habilita drag and drop para las columnas
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

    
    
async function postTask(task){
    // Envía la nueva tarea al servidor
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
   
}

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
function loadTasks(){
tasks = fetchData().then((tasksResponse)=>{
    tasksResponse.forEach((tasksResponse)=>{
        console.log(tasksResponse.title);
        tasksArray.push(tasksResponse);
    });
    loadTasks();
});


    tasksArray.forEach(task => {
        createTaskHTML(task)
    })
}



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

        // Coloca la tarea en la columna correcta basada en su estado
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

        // Habilita drag and drop en las tareas añadidas desde el servidor
        const lastTask = document.querySelectorAll('.box.task').item(-1); // Selecciona la última tarea insertada
        addDragAndDropEvents(lastTask);
    });
}).catch((error) => {
    console.log("Error al procesar las tareas: ", error);
});


// app.js

// Seleccionar elementos del DOM
const taskForm = document.getElementById('task-form'); // Referencia al formulario de tareas
const taskInput = document.getElementById('task-input'); // Referencia al campo de entrada de la tarea
const taskList = document.getElementById('task-list'); // Referencia a la lista de tareas

// Función para obtener tareas del servidor
const getTasks = async () => {
    const response = await fetch('http://localhost:3000/tareas'); // Realiza una petición GET al servidor
    const data = await response.json(); // Convierte la respuesta a formato JSON
    // Itera sobre cada tarea obtenida y la añade al DOM
    data.tareas.forEach(task => addTaskToDOM(task)); 
};

// Función para agregar una tarea al DOM
const addTaskToDOM = (task) => {
    const li = document.createElement('li'); // Crea un nuevo elemento de lista
    li.textContent = task.descripcion; // Establece el texto del elemento con la descripción de la tarea

    // Crear botón para eliminar tarea
    const deleteButton = document.createElement('button'); // Crea un nuevo botón
    deleteButton.textContent = 'Eliminar'; // Establece el texto del botón
    // Asigna una función al botón que llama a deleteTask al hacer clic
    deleteButton.onclick = () => deleteTask(task.id); 

    // Agrega el botón al elemento de lista
    li.appendChild(deleteButton); 
    
    // Agrega la tarea a la lista de tareas en el DOM
    taskList.appendChild(li); 
};

// Función para agregar una nueva tarea
const addTask = async (event) => {
    event.preventDefault(); // Previene el comportamiento predeterminado del formulario (recargar la página)
    const descripcion = taskInput.value; // Obtiene la descripción de la tarea desde el campo de entrada

    // Enviar la nueva tarea al servidor
    const response = await fetch('http://localhost:3000/tareas', {
        method: 'POST', // Especifica que se va a hacer una petición POST
        headers: {
            'Content-Type': 'application/json', // Indica que se está enviando JSON
        },
        body: JSON.stringify({ descripcion }), // Convierte la tarea a formato JSON
    });
    const task = await response.json(); // Convierte la respuesta a JSON

    addTaskToDOM(task); // Agrega la nueva tarea al DOM
    taskInput.value = ''; // Limpia el campo de entrada
};

// Función para eliminar una tarea
const deleteTask = async (id) => {
    const response = await fetch(`http://localhost:3000/tareas/${id}`, {
        method: 'DELETE', // Especifica que se va a hacer una petición DELETE
    });
    if (response.ok) { // Verifica si la respuesta fue exitosa
        const li = document.querySelector(`li:has(button[textContent="Eliminar"])`);
        li.remove(); // Elimina la tarea del DOM
    }
};

// Agregar el evento de envío del formulario
taskForm.addEventListener('submit', addTask); // Llama a la función addTask al enviar el formulario

// Cargar tareas al iniciar
getTasks(); // Llama a la función getTasks para cargar las tareas existentes


// Seleccionar el botón para obtener tareas
const obtainTasksButton = document.getElementById('obtain-tasks'); // Referencia al botón

// Agregar evento al botón "Obtener Tareas"
obtainTasksButton.addEventListener('click', getTasks); // Llama a getTasks al hacer clic
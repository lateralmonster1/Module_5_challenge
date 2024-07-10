$(document).ready(function () {
    // Function to save task to localStorage
    function saveTask(task) {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    // Function to load tasks from localStorage
    function loadTasks() {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.forEach(task => {
        addTaskToBoard(task);
      });
    }
  
    // Function to add task to the board
    function addTaskToBoard(task) {
      let taskElement = `
        <div class="task">
          <h5>${task.title}</h5>
          <p>${task.description}</p>
          <p>Deadline: ${task.deadline}</p>
        </div>
      `;
      $(`#${task.column}-cards`).append(taskElement);
    }
  
    // Handle form submission
    $('#task-form').submit(function (event) {
      event.preventDefault();
      let task = {
        title: $('#task-title').val(),
        description: $('#task-desc').val(),
        deadline: $('#task-deadline').val(),
        column: 'todo'
      };
      saveTask(task);
      addTaskToBoard(task);
      $('#formModal').modal('hide');
    });
  
    // Load tasks on page load
    loadTasks();
  });
  
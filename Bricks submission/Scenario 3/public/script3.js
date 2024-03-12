document.addEventListener('DOMContentLoaded', function() {
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');

  // Function to fetch tasks from database and display
  function fetchTasks() {
    fetch('/tasks')
      .then(response => response.json())
      .then(tasks => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
          const li = document.createElement('li');
          li.textContent = task.task_name;
          if (task.completed) {
            li.classList.add('completed');
          }
          li.addEventListener('click', function() {
            markCompleted(task.id, !task.completed);
          });
          li.addEventListener('dblclick', function() {
            deleteTask(task.id);
          });
          taskList.appendChild(li);
        });
      });
  }

  // Fetch tasks on page load
  fetchTasks();

  // Function to add task to database
  function addTask(taskName) {
    fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task_name: taskName })
    })
    .then(fetchTasks);
  }

  // Function to mark task as completed in database
  function markCompleted(taskId, completed) {
    fetch(`/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed })
    })
    .then(fetchTasks);
  }

  // Function to delete task from database
  function deleteTask(taskId) {
    fetch(`/tasks/${taskId}`, {
      method: 'DELETE'
    })
    .then(fetchTasks);
  }

  // Form submission event listener
  taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      addTask(taskText);
      taskInput.value = '';
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');

  // Function to retrieve tasks from local storage and display them
  function displayTasks() {
    taskList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.textContent = task.text;
      if (task.completed) {
        li.classList.add('completed');
      }
      // Add click event listener to mark task as complete or incomplete
      li.addEventListener('click', function() {
        tasks[index].completed = !tasks[index].completed;
        saveTasks(tasks);
        displayTasks();
      });
      // Add double click event listener to delete task
      li.addEventListener('dblclick', function() {
        tasks.splice(index, 1);
        saveTasks(tasks);
        displayTasks();
      });
      taskList.appendChild(li);
    });
  }

  // Function to save tasks to local storage
  function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Display tasks on page load
  displayTasks();

  // Form submission event listener
  taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.push({ text: taskText, completed: false });
      saveTasks(tasks);
      displayTasks();
      taskInput.value = '';
    }
  });
});

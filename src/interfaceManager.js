import { TaskManager } from './taskManager.js';
import { StorageManager } from './storageManager.js';

class InterfaceManager {
  constructor() {
    this.taskManager = new TaskManager();
    this.storageManager = new StorageManager(this.taskManager);
    this.currentView = 'all'; // all, today, week, completed, project
    this.currentProject = 'default';
    this.initializeEventListeners();
    this.storageManager.loadFromStorage();
    this.initializeProjectsUI();
    this.displayTasks();
  }

  initializeEventListeners() {
    // Modal form handling
    const modal = document.getElementById('taskModal');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const closeBtn = document.getElementById('closeBtn');

    addTaskBtn.onclick = () => {
      this.populateProjectDropdown();
      modal.style.display = 'block';
    };
    closeBtn.onclick = () => (modal.style.display = 'none');
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };

    // Form submission
    document
      .getElementById('taskForm')
      .addEventListener('submit', this.handleFormSubmit.bind(this));

    // Character counter setup
    this.setupCharCounter('name', 'nameCounter');
    this.setupCharCounter('description', 'descriptionCounter');

    // Add project listeners for filtering
    document.getElementById('allTasks').addEventListener('click', () => {
      this.currentView = 'all';
      this.displayTasks();
    });

    document.getElementById('todayTasks').addEventListener('click', () => {
      this.currentView = 'today';
      this.displayTasks();
    });

    document.getElementById('weekTasks').addEventListener('click', () => {
      this.currentView = 'week';
      this.displayTasks();
    });

    document.getElementById('completedTasks').addEventListener('click', () => {
      this.currentView = 'completed';
      this.displayTasks();
    });

    // Add new project button
    const addProjectBtn = document.getElementById('addProjectBtn');
    addProjectBtn.onclick = () => {
      const projectName = prompt('Enter project name:');
      if (projectName && projectName.trim()) {
        this.taskManager.addProject(projectName.trim());
        this.initializeProjectsUI();
      }
    };

    // Save tasks and projects to localStorage
    this.storageManager.saveToStorage();
  }

  populateProjectDropdown() {
    //add dropdown options in form
    const projectGroup = document.getElementById('projectGroup');
    const projectSelect = document.getElementById('project');
    projectSelect.innerHTML = '';

    if (this.taskManager.projects.length > 1) {
      projectGroup.style.display = 'block'; // Show the project dropdown if there are projects
      this.taskManager.projects.forEach((project) => {
        const option = document.createElement('option');
        option.value = project;
        option.textContent = project;
        projectSelect.appendChild(option);
      });
    } else {
      projectGroup.style.display = 'none'; // Hide the whole thing if there are no projects
    }
  }

  initializeProjectsUI() {
    const projectsContainer = document.querySelector('.user-projects');
    projectsContainer.innerHTML =
      '<button id="addProjectBtn" class="add-project-btn"> createNewProject</button>';

    this.taskManager.projects.forEach((project) => {
      const projectDiv = document.createElement('div');
      projectDiv.classList.add('menu-item', 'project');
      projectDiv.textContent = project;
      projectDiv.onclick = () => {
        this.currentView = 'project';
        this.currentProject = project;
        this.displayTasks();
      };

      if (project !== 'default') {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          if (confirm('Are you sure you want to delete this project?')) {
            this.taskManager.deleteProject(project);
            this.initializeProjectsUI();
            this.currentView = 'all';
            this.displayTasks();
          }
        };
        projectDiv.appendChild(deleteBtn);
      }

      projectsContainer.appendChild(projectDiv);
    });

    // Re-add the event listener for the "New Project" button because it gets somehow reinitialized
    document.getElementById('addProjectBtn').onclick = () => {
      const projectName = prompt('Enter project name:');
      if (projectName && projectName.trim()) {
        this.taskManager.addProject(projectName.trim());
        this.initializeProjectsUI();
      }
    };
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.querySelector(
      'input[name="priority"]:checked'
    ).value;
    const projectSelect = document.getElementById('project');
    const project = projectSelect.value || this.currentProject;

    this.taskManager.addTask(name, description, dueDate, priority, project);
    console.log(this.taskManager);

    // Reset form and counters
    e.target.reset();
    document.getElementById('nameCounter').textContent = '0';
    document.getElementById('descriptionCounter').textContent = '0';
    document.getElementById('taskModal').style.display = 'none';

    // Refresh the task display
    this.displayTasks();
  }

  setupCharCounter(inputId, counterId) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);
    input.addEventListener('input', () => {
      counter.textContent = input.value.length;
    });
  }

  toggleTask(index) {
    this.taskManager.toggleTask(index);
    this.displayTasks();
  }

  deleteTask(index) {
    this.taskManager.deleteTask(index);
    console.log(this.taskManager);
    this.displayTasks();
  }

  displayTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = `
      <div class="task-header">
        <span class="task-header-item">Name</span>
        <span class="task-header-item">Project</span>
        <span class="task-header-item">Due Date</span>
        <span class="task-header-item">Priority</span>
        <span class="task-header-item">Actions</span>
      </div>
    `;

    let tasksToDisplay;
    if (this.currentView === 'project') {
      tasksToDisplay = this.taskManager.getTasksByProject(this.currentProject);
    } else {
      tasksToDisplay = this.taskManager.getTasksByDate(this.currentView);
    }

    tasksToDisplay.forEach((task, index) => {
      const taskElement = document.createElement('div');
      taskElement.classList.add('task');
      if (task.isDone) {
        taskElement.classList.add('done');
      }

      const toggleSymbol = task.isDone ? '\u2611' : '\u2610';

      taskElement.innerHTML = `
        <span>${task.name}</span>
        <span>${task.project}</span>
        <span>${task.dueDate}</span>
        <span>${task.priority}</span>
        <span>
          <button class="show-description">Show Description</button>
          <dialog class="description-dialog">
            <p>${task.description}</p>
            <button class="close-dialog">Close</button>
          </dialog>
          <button class="toggle-task">${toggleSymbol}</button>
          <button class="delete-task">Delete</button>
        </span>
      `;

      const showDescriptionBtn = taskElement.querySelector('.show-description');
      const descriptionDialog = taskElement.querySelector(
        '.description-dialog'
      );

      showDescriptionBtn.addEventListener('click', () => {
        const rect = showDescriptionBtn.getBoundingClientRect();
        descriptionDialog.style.top = `${rect.bottom}px`;
        descriptionDialog.style.left = `${rect.left}px`;
        descriptionDialog.showModal();
      });

      taskElement
        .querySelector('.close-dialog')
        .addEventListener('click', () => {
          descriptionDialog.close();
        });

      taskElement
        .querySelector('.toggle-task')
        .addEventListener('click', () => this.toggleTask(index));
      taskElement
        .querySelector('.delete-task')
        .addEventListener('click', () => this.deleteTask(index));

      taskList.appendChild(taskElement);
    });
  }
}

export { InterfaceManager };

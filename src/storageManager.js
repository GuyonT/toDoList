// scripts/StorageManager.js
export class StorageManager {
  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  saveToStorage() {
    const saveTasksBtn = document.getElementById('saveTasksBtn');
    saveTasksBtn.onclick = () => {
      localStorage.setItem(
        'tasks',
        JSON.stringify(this.taskManager.getAllTasks())
      );
      localStorage.setItem(
        'projects',
        JSON.stringify(this.taskManager.projects)
      );
      console.log('Tasks and projects saved to localStorage');
    };
  }

  loadFromStorage() {
    const storedTasks = localStorage.getItem('tasks');
    const storedProjects = localStorage.getItem('projects');

    if (storedProjects) {
      const projects = JSON.parse(storedProjects);
      projects.forEach((project) => this.taskManager.addProject(project));
    }

    if (storedTasks) {
      const tasks = JSON.parse(storedTasks);
      tasks.forEach((task) => {
        this.taskManager.addTask(
          task.name,
          task.description,
          task.dueDate,
          task.priority,
          task.project
        );
        if (task.isDone) {
          this.taskManager.getTask(this.taskManager.tasks.length - 1).isDone =
            true;
        }
      });
    }
  }
}

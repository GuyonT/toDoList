class Task {
  constructor(name, description, dueDate, priority, project = 'default') {
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.project = project;
    this.isDone = false;
  }

  toggleDone() {
    this.isDone = !this.isDone;
  }
}

class TaskManager {
  constructor() {
    this.tasks = [];
    this.projects = ['default'];
  }

  getAllTasks() {
    return this.tasks;
  }

  getTask(index) {
    return this.tasks[index];
  }

  addProject(projectName) {
    if (!this.projects.includes(projectName)) {
      this.projects.push(projectName);
    }
  }

  deleteProject(projectName) {
    if (projectName === 'default') return; //ensure default project is not deleted
    const index = this.projects.indexOf(projectName);
    if (index > -1) {
      //ensure project exists
      this.projects.splice(index, 1);
      this.tasks = this.tasks.filter((task) => task.project !== projectName); //return all tasks besides those in the deleted project
    }
  }

  addTask(name, description, dueDate, priority, project) {
    const task = new Task(name, description, dueDate, priority, project);
    this.tasks.push(task);
    return task;
  }

  getTasksByProject(projectName) {
    return this.tasks.filter((task) => task.project === projectName);
  }

  getTasksByDate(filter) {
    const today = new Date();
    const endOfWeek = new Date();
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    return this.tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      switch (filter) {
        case 'today':
          return taskDate.toDateString() === today.toDateString();
        case 'week':
          return taskDate <= endOfWeek && taskDate >= today;
        case 'completed':
          return task.isDone;
        default:
          return true;
      }
    });
  }

  deleteTask(index) {
    this.tasks.splice(index, 1);
  }

  toggleTask(index) {
    this.tasks[index].toggleDone();
  }
}

export { Task, TaskManager };

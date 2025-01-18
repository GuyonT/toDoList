import './styles.css';
import { TaskManager } from './taskManager.js';
import { InterfaceManager } from './interfaceManager.js';

// Set initial theme
document.body.dataset.theme = 'light';
document.addEventListener('DOMContentLoaded', () => {
  //wait the page is fully loaded before anything
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    if (document.body.dataset.theme === 'dark') {
      document.body.dataset.theme = 'light';
      themeToggle.innerHTML = '&#x263D';
    } else {
      document.body.dataset.theme = 'dark';
      themeToggle.innerHTML = '&#x263C';
    }
  });
});

const taskManager = new TaskManager();
const interfaceManager = new InterfaceManager(taskManager);

interfaceManager.displayTasks();

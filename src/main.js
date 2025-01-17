import './styles.css';
import { TaskManager } from './taskManager.js';
import { InterfaceManager } from './interfaceManager.js';

// Set initial theme
document.body.dataset.theme = 'light';

const taskManager = new TaskManager();
const interfaceManager = new InterfaceManager(taskManager);

interfaceManager.displayTasks();

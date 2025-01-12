import './styles.css';
import { InterfaceManager } from './interfaceManager.js';

// Set initial theme
document.body.dataset.theme = 'light';

const interfaceManager = new InterfaceManager();
interfaceManager.displayTasks();

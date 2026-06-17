import { initSidebar } from "./js/sidebar.js";
import {
  initProjectSearch,
  loadProjects,
  createProject,
  selectProject,
  startEditProject,
  cancelEditProject,
  saveProject,
  deleteProject,
} from "./js/project.js";
import { createTask, moveTask, deleteTask } from "./js/task.js";

// Handlers expostos para onclick inline no HTML gerado
window.selectProject = selectProject;
window.startEditProject = startEditProject;
window.cancelEditProject = cancelEditProject;
window.saveProject = saveProject;
window.deleteProject = deleteProject;
window.moveTask = moveTask;
window.deleteTask = deleteTask;

document.getElementById("projectForm").addEventListener("submit", createProject);
document.getElementById("taskForm").addEventListener("submit", createTask);

initSidebar();
initProjectSearch();
loadProjects();

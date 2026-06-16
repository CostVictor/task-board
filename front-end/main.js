import {
  loadProjects,
  createProject,
  deleteProject,
  startEditProject,
  cancelEditProject,
  saveProject,
  selectProject,
  initSidebar,
} from "./js/project.js";
import { createTask, moveTask, deleteTask } from "./js/task.js";

window.deleteProject = deleteProject;
window.startEditProject = startEditProject;
window.cancelEditProject = cancelEditProject;
window.saveProject = saveProject;
window.selectProject = selectProject;
window.moveTask = moveTask;
window.deleteTask = deleteTask;

document.getElementById("taskForm").addEventListener("submit", createTask);
document
  .getElementById("projectForm")
  .addEventListener("submit", createProject);

initSidebar();

async function init() {
  await loadProjects();
}

init();

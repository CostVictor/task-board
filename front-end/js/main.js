import {
  loadProjects,
  createProject,
  deleteProject,
  startEditProject,
  cancelEditProject,
  saveProject,
} from "./project.js";
import { loadTasks, createTask, moveTask, deleteTask } from "./task.js";

window.deleteProject = deleteProject;
window.startEditProject = startEditProject;
window.cancelEditProject = cancelEditProject;
window.saveProject = saveProject;
window.moveTask = moveTask;
window.deleteTask = deleteTask;

document.getElementById("projectFilter").addEventListener("change", loadTasks);
document.getElementById("taskForm").addEventListener("submit", createTask);
document.getElementById("projectForm").addEventListener("submit", createProject);

async function init() {
  await loadProjects();
  await loadTasks();
}

init();

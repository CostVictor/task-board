import {
  API_URL,
  STATUS_LABELS,
  PRIORITY_LABELS,
  STATUS_FLOW,
} from "./config.js";
import { state } from "./state.js";
import { escapeHtml, showToast } from "./utils.js";
import { loadProjects } from "./project.js";

// -- LOAD

export async function loadTasks() {
  if (!state.selectedProjectId) {
    state.tasks = [];
    renderBoard();
    renderStats();
    return;
  }

  const url = `${API_URL}/tasks?project_id=${state.selectedProjectId}`;
  const response = await fetch(url);

  if (!response.ok) {
    showToast("Erro ao carregar tarefas");
    return;
  }

  state.tasks = await response.json();

  renderBoard();
  renderStats();
}

// -- RENDER

function renderStats() {
  const counts = { todo: 0, doing: 0, done: 0 };

  for (const task of state.tasks) {
    if (counts[task.status] !== undefined) {
      counts[task.status]++;
    }
  }

  document.getElementById("stats").innerHTML = `
    <span class="stat stat-todo">${counts.todo} a fazer</span>
    <span class="stat stat-doing">${counts.doing} fazendo</span>
    <span class="stat stat-done">${counts.done} concluídas</span>
  `;
}

function renderBoard() {
  const columns = {
    todo: document.getElementById("column-todo"),
    doing: document.getElementById("column-doing"),
    done: document.getElementById("column-done"),
  };

  for (const key of Object.keys(columns)) {
    columns[key].innerHTML = "";
  }

  for (const task of state.tasks) {
    if (!columns[task.status]) continue;

    const card = createTaskCard(task);
    columns[task.status].appendChild(card);
  }

  for (const key of Object.keys(columns)) {
    if (columns[key].children.length === 0) {
      columns[key].innerHTML = '<p class="empty">Nenhuma tarefa</p>';
    }
  }
}

// -- ACTIONS

function createTaskCard(task) {
  const card = document.createElement("article");
  const priority = PRIORITY_LABELS[task.priority] ? task.priority : "medium";
  const flow = STATUS_FLOW[task.status] || {};

  card.classList.add("card", `priority-${priority}`);

  let actions = "";

  if (flow.prev) {
    actions += `<button class="btn btn-secondary" onclick="moveTask(${task.id}, '${flow.prev}')">${flow.prevLabel}</button>`;
  }

  if (flow.next) {
    actions += `<button class="btn btn-primary" onclick="moveTask(${task.id}, '${flow.next}')">${flow.label}</button>`;
  }

  card.innerHTML = `
    <div class="card-header">
      <span class="badge priority-${priority}">${PRIORITY_LABELS[priority]}</span>
      <button class="btn-delete" onclick="deleteTask(${task.id})" title="Excluir">&times;</button>
    </div>
    <h3>${escapeHtml(task.title)}</h3>
    ${task.description ? `<p>${escapeHtml(task.description)}</p>` : ""}
    <div class="card-actions">${actions}</div>
  `;

  return card;
}

export async function moveTask(id, status) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    showToast("Erro ao mover tarefa");
    return;
  }

  showToast(`Tarefa movida para ${STATUS_LABELS[status]}`);
  await loadProjects();
  await loadTasks();
}

export async function deleteTask(id) {
  if (!confirm("Deseja excluir esta tarefa?")) return;

  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    showToast("Erro ao excluir tarefa");
    return;
  }

  showToast("Tarefa excluída");
  await loadProjects();
  await loadTasks();
}

export async function createTask(event) {
  event.preventDefault();

  if (!state.selectedProjectId) {
    showToast("Selecione um projeto primeiro");
    return;
  }

  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const project_id = state.selectedProjectId;
  const priority = document.getElementById("taskPriority").value;

  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, project_id, priority }),
  });

  if (!response.ok) {
    showToast("Erro ao criar tarefa");
    return;
  }

  document.getElementById("taskForm").reset();
  document.getElementById("taskPriority").value = "medium";

  showToast("Tarefa criada");
  await loadProjects();
  await loadTasks();
}

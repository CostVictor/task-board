import { API_URL, STATUS_LABELS, PRIORITY_LABELS, STATUS_FLOW } from "./config.js";
import { state } from "./state.js";
import { showToast } from "./utils.js";

export async function loadTasks() {
  const projectId = document.getElementById("projectFilter").value;
  let url = `${API_URL}/tasks`;

  if (projectId) {
    url += `?project_id=${projectId}`;
  }

  const response = await fetch(url);
  state.tasks = await response.json();

  renderBoard();
  renderStats();
}

function renderStats() {
  const counts = { todo: 0, doing: 0, done: 0 };

  for (const task of state.tasks) {
    counts[task.status]++;
  }

  document.getElementById("stats").innerHTML = `
    <span class="stat stat-todo">${counts.todo} a fazer</span>
    <span class="stat stat-doing">${counts.doing} fazendo</span>
    <span class="stat stat-done">${counts.done} concluidas</span>
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
    const card = createTaskCard(task);
    columns[task.status].appendChild(card);
  }

  for (const key of Object.keys(columns)) {
    if (columns[key].children.length === 0) {
      columns[key].innerHTML = '<p class="empty">Nenhuma tarefa</p>';
    }
  }
}

function createTaskCard(task) {
  const card = document.createElement("article");
  card.classList.add("card", `priority-${task.priority}`);

  const flow = STATUS_FLOW[task.status];
  let actions = "";

  if (flow.prev) {
    actions += `<button class="btn btn-secondary" onclick="moveTask(${task.id}, '${flow.prev}')">${flow.prevLabel}</button>`;
  }

  if (flow.next) {
    actions += `<button class="btn btn-primary" onclick="moveTask(${task.id}, '${flow.next}')">${flow.label}</button>`;
  }

  card.innerHTML = `
    <div class="card-header">
      <span class="badge priority-${task.priority}">${PRIORITY_LABELS[task.priority]}</span>
      <button class="btn-delete" onclick="deleteTask(${task.id})" title="Excluir">&times;</button>
    </div>
    <h3>${task.title}</h3>
    ${task.description ? `<p>${task.description}</p>` : ""}
    <small>${task.project_name}</small>
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

  showToast("Tarefa excluida");
  await loadTasks();
}

export async function createTask(event) {
  event.preventDefault();

  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const project_id = Number(document.getElementById("taskProject").value);
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
  await loadTasks();
}

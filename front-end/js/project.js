import { API_URL } from "./config.js";
import { state } from "./state.js";
import { escapeHtml, escapeAttr, showToast } from "./utils.js";
import { loadTasks } from "./task.js";

export async function loadProjects() {
  const response = await fetch(`${API_URL}/projects`);
  state.projects = await response.json();

  const projectFilter = document.getElementById("projectFilter");
  const taskProject = document.getElementById("taskProject");
  const currentFilter = projectFilter.value;

  projectFilter.innerHTML = '<option value="">Todos</option>';
  taskProject.innerHTML = "";

  for (const project of state.projects) {
    projectFilter.innerHTML += `<option value="${project.id}">${project.name}</option>`;
    taskProject.innerHTML += `<option value="${project.id}">${project.name}</option>`;
  }

  projectFilter.value = currentFilter;
  renderProjects();
}

function renderProjects() {
  const grid = document.getElementById("projectsGrid");

  if (state.projects.length === 0) {
    grid.innerHTML = '<p class="empty">Nenhum projeto cadastrado</p>';
    return;
  }

  grid.innerHTML = "";

  for (const project of state.projects) {
    const card = document.createElement("article");
    card.classList.add("card", "project-card");
    card.dataset.id = project.id;

    card.innerHTML = `
      <div class="card-header">
        <span class="badge project-badge">${project.task_count} tarefa(s)</span>
        <button class="btn-delete" onclick="deleteProject(${project.id})" title="Excluir">&times;</button>
      </div>
      <div class="project-view">
        <h3>${escapeHtml(project.name)}</h3>
        ${project.description ? `<p>${escapeHtml(project.description)}</p>` : '<p class="empty-desc">Sem descricao</p>'}
        <div class="card-actions">
          <button class="btn btn-secondary" onclick="startEditProject(${project.id})">Editar</button>
        </div>
      </div>
      <form class="project-edit hidden" onsubmit="saveProject(event, ${project.id})">
        <input type="text" name="name" value="${escapeAttr(project.name)}" required />
        <input type="text" name="description" value="${escapeAttr(project.description || "")}" placeholder="Descricao" />
        <div class="card-actions">
          <button type="submit" class="btn btn-primary">Salvar</button>
          <button type="button" class="btn btn-secondary" onclick="cancelEditProject(${project.id})">Cancelar</button>
        </div>
      </form>
    `;

    grid.appendChild(card);
  }
}

export function startEditProject(id) {
  const card = document.querySelector(`.project-card[data-id="${id}"]`);
  card.querySelector(".project-view").classList.add("hidden");
  card.querySelector(".project-edit").classList.remove("hidden");
}

export function cancelEditProject(id) {
  const card = document.querySelector(`.project-card[data-id="${id}"]`);
  card.querySelector(".project-view").classList.remove("hidden");
  card.querySelector(".project-edit").classList.add("hidden");
}

export async function saveProject(event, id) {
  event.preventDefault();

  const form = event.target;
  const name = form.name.value.trim();
  const description = form.description.value.trim();

  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description }),
  });

  if (!response.ok) {
    showToast("Erro ao atualizar projeto");
    return;
  }

  showToast("Projeto atualizado");
  await loadProjects();
  await loadTasks();
}

export async function createProject(event) {
  event.preventDefault();

  const name = document.getElementById("projectName").value.trim();
  const description = document.getElementById("projectDescription").value.trim();

  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description }),
  });

  if (!response.ok) {
    showToast("Erro ao criar projeto");
    return;
  }

  document.getElementById("projectForm").reset();
  showToast("Projeto criado");
  await loadProjects();
}

export async function deleteProject(id) {
  if (!confirm("Deseja excluir este projeto? As tarefas vinculadas tambem serao removidas."))
    return;

  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    showToast("Erro ao excluir projeto");
    return;
  }

  const projectFilter = document.getElementById("projectFilter");
  if (projectFilter.value === String(id)) {
    projectFilter.value = "";
  }

  showToast("Projeto excluido");
  await loadProjects();
  await loadTasks();
}

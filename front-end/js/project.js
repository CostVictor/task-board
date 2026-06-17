import { API_URL } from "./config.js";
import { state } from "./state.js";
import { escapeHtml, escapeAttr, showToast } from "./utils.js";
import { closeSidebar } from "./sidebar.js";
import { loadTasks } from "./task.js";

// -- INIT

export function initProjectSearch() {
  document
    .getElementById("projectSearch")
    .addEventListener("input", (event) => {
      state.projectSearch = event.target.value;
      renderProjects();
    });
}

// -- LOAD

export async function loadProjects() {
  const response = await fetch(`${API_URL}/projects`);

  if (!response.ok) {
    showToast("Erro ao carregar projetos");
    return;
  }

  state.projects = await response.json();
  renderProjects();
  updateProjectHeader();
}

// -- RENDER

function renderProjects() {
  const list = document.getElementById("projectList");
  const search = state.projectSearch.trim().toLowerCase();
  const projects = search
    ? state.projects.filter((project) => {
        const description = project.description || "";
        return `${project.name} ${description}`.toLowerCase().includes(search);
      })
    : state.projects;

  if (state.projects.length === 0) {
    list.innerHTML = '<li class="empty">Nenhum projeto cadastrado</li>';
    return;
  }

  if (projects.length === 0) {
    list.innerHTML = '<li class="empty">Nenhum projeto encontrado</li>';
    return;
  }

  list.innerHTML = "";

  for (const project of projects) {
    const li = document.createElement("li");
    li.classList.add("project-item");
    li.dataset.id = project.id;

    if (state.selectedProjectId === project.id) {
      li.classList.add("is-active");
    }

    li.innerHTML = `
      <button type="button" class="project-item-btn" onclick="selectProject(${project.id})">
        <span class="project-item-name">${escapeHtml(project.name)}</span>
        <span class="project-item-count">${project.task_count}</span>
      </button>
      <div class="project-item-actions">
        <button type="button" class="btn-icon" onclick="startEditProject(${project.id})" title="Editar">Editar</button>
        <button type="button" class="btn-icon btn-icon-danger" onclick="deleteProject(${project.id})" title="Excluir">Excluir</button>
      </div>
      <form class="project-item-edit hidden" onsubmit="saveProject(event, ${project.id})">
        <input type="text" name="name" value="${escapeAttr(project.name)}" required />
        <input type="text" name="description" value="${escapeAttr(project.description || "")}" placeholder="Descrição" />
        <div class="edit-actions">
          <button type="submit" class="btn btn-primary">Salvar</button>
          <button type="button" class="btn btn-secondary" onclick="cancelEditProject(${project.id})">Cancelar</button>
        </div>
      </form>
    `;

    list.appendChild(li);
  }
}

function updateProjectHeader() {
  const nameEl = document.getElementById("selectedProjectName");
  const descEl = document.getElementById("selectedProjectDesc");
  const emptyState = document.getElementById("emptyState");
  const projectView = document.getElementById("projectView");

  if (!state.selectedProjectId) {
    nameEl.textContent = "Selecione um projeto";
    descEl.classList.add("hidden");
    emptyState.classList.remove("hidden");
    projectView.classList.add("hidden");
    return;
  }

  const project = state.projects.find((p) => p.id === state.selectedProjectId);

  if (!project) {
    state.selectedProjectId = null;
    updateProjectHeader();
    return;
  }

  nameEl.textContent = project.name;
  descEl.textContent = project.description || "";
  descEl.classList.toggle("hidden", !project.description);
  emptyState.classList.add("hidden");
  projectView.classList.remove("hidden");
}

// -- ACTIONS

export function selectProject(id) {
  state.selectedProjectId = id;
  renderProjects();
  updateProjectHeader();
  loadTasks();
  closeSidebar();
}

export async function createProject(event) {
  event.preventDefault();

  const name = document.getElementById("projectName").value.trim();
  const description = document
    .getElementById("projectDescription")
    .value.trim();

  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description }),
  });

  if (!response.ok) {
    showToast("Erro ao criar projeto");
    return;
  }

  const project = await response.json();
  document.getElementById("projectForm").reset();
  document.getElementById("projectSearch").value = "";
  state.projectSearch = "";
  showToast("Projeto criado");
  await loadProjects();
  selectProject(project.id);
}

export function startEditProject(id) {
  const item = document.querySelector(`.project-item[data-id="${id}"]`);
  if (!item) return;

  item.querySelector(".project-item-actions").classList.add("hidden");
  item.querySelector(".project-item-edit").classList.remove("hidden");
}

export function cancelEditProject(id) {
  const item = document.querySelector(`.project-item[data-id="${id}"]`);
  if (!item) return;

  item.querySelector(".project-item-actions").classList.remove("hidden");
  item.querySelector(".project-item-edit").classList.add("hidden");
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

export async function deleteProject(id) {
  if (
    !confirm(
      "Deseja excluir este projeto? As tarefas vinculadas também serão removidas.",
    )
  )
    return;

  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    showToast("Erro ao excluir projeto");
    return;
  }

  if (state.selectedProjectId === id) {
    state.selectedProjectId = null;
  }

  showToast("Projeto excluído");
  await loadProjects();
  updateProjectHeader();
  await loadTasks();
}

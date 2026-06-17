import { taskRepo } from "../repository/index.js";

const VALID_STATUS = ["todo", "doing", "done"];
const VALID_PRIORITY = ["low", "medium", "high"];

// -- SELECT

export async function getTasks(request, response) {
  const { project_id } = request.query;

  const result = await taskRepo.getTasks(project_id);
  if (result.error) return response.status(500).json({ error: result.error });

  response.status(200).json(result);
}

// -- INSERT

export async function createTask(request, response) {
  const { project_id, title, description, priority } = request.body;

  if (!project_id || !title) {
    return response
      .status(400)
      .json({ error: "ID do projeto e título são obrigatórios." });
  }

  if (priority && !VALID_PRIORITY.includes(priority)) {
    return response.status(400).json({ error: "Prioridade inválida." });
  }

  const result = await taskRepo.createTask({
    project_id,
    title,
    description,
    priority,
  });
  if (result.error) return response.status(500).json({ error: result.error });

  response.status(201).json(result);
}

// -- UPDATE

export async function updateTask(request, response) {
  const { status, title, description, priority } = request.body;

  if (status && !VALID_STATUS.includes(status)) {
    return response.status(400).json({ error: "Status inválido." });
  }
  if (priority && !VALID_PRIORITY.includes(priority)) {
    return response.status(400).json({ error: "Prioridade inválida." });
  }

  const result = await taskRepo.updateTask(request.params.id, {
    status,
    title,
    description,
    priority,
  });
  if (result.error) return response.status(500).json({ error: result.error });

  if (result.length === 0)
    return response.status(404).json({ error: "Tarefa não encontrada." });

  response.status(200).json(result[0]);
}

// -- DELETE

export async function deleteTask(request, response) {
  const result = await taskRepo.deleteTask(request.params.id);
  if (result.error) return response.status(500).json({ error: result.error });

  if (result.length === 0)
    return response.status(404).json({ error: "Tarefa não encontrada." });

  response.status(200).json({ message: "Tarefa removida." });
}

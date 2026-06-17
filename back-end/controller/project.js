import { projectRepo } from "../repository/index.js";

// -- SELECT

export async function getProjects(_, response) {
  const result = await projectRepo.getProjects();

  if (result.error) return response.status(500).json({ error: result.error });

  response.status(200).json(result);
}

// -- INSERT

export async function createProject(request, response) {
  const { name, description } = request.body;

  if (!name) {
    return response
      .status(400)
      .json({ error: "O nome do projeto é obrigatório." });
  }

  const result = await projectRepo.createProject({ name, description });
  if (result.error) return response.status(500).json({ error: result.error });

  response.status(201).json(result);
}

// -- UPDATE

export async function updateProject(request, response) {
  const { name, description } = request.body;

  if (!name) {
    return response
      .status(400)
      .json({ error: "O nome do projeto é obrigatório." });
  }

  const result = await projectRepo.updateProject(request.params.id, {
    name,
    description,
  });
  if (result.error) return response.status(500).json({ error: result.error });

  if (result.length === 0)
    return response.status(404).json({ error: "Projeto não encontrado." });

  response.status(200).json(result[0]);
}

// -- DELETE

export async function deleteProject(request, response) {
  const result = await projectRepo.deleteProject(request.params.id);

  if (result.error) return response.status(500).json({ error: result.error });
  if (result.length === 0)
    return response.status(404).json({ error: "Projeto não encontrado." });

  response.status(204).send();
}

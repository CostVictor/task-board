import { database } from "../database.js";
import { ProjectRepository } from "./project.js";
import { TaskRepository } from "./task.js";

export const projectRepo = new ProjectRepository(database);
export const taskRepo = new TaskRepository(database);

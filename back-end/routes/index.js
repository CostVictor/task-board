import projectRoutes from "./project.js";
import taskRoutes from "./task.js";

export function registerRoutes(app) {
  app.use("/projects", projectRoutes);
  app.use("/tasks", taskRoutes);
}

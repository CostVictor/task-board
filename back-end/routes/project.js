import { Router } from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controller/project.js";

const router = Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);

router.post("/", createProject);

router.patch("/:id", updateProject);

router.delete("/:id", deleteProject);

export default router;

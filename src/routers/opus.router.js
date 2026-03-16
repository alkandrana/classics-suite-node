import { Router } from "express";

import {
  getAllOpera,
  getOpus,
  addOpus,
  createOpus,
  editOpus,
  confirmDelete,
  deleteOpus,
  updateOpus,
} from "../controllers/opus.controller.js";

const opusRouter = Router();

opusRouter.get("/", getAllOpera);
opusRouter.get("/add{/:authorId}", addOpus);
opusRouter.get("/:opusId/", getOpus);
opusRouter.get("/:opusId/edit/", editOpus);
opusRouter.post("/add/", createOpus);
opusRouter.post("/:opusId/delete/", deleteOpus);
opusRouter.get("/:opusId/delete/", confirmDelete);
opusRouter.post("/:opusId/edit", updateOpus);

export default opusRouter;

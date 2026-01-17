import { Router } from "express";

import {
  getAllOpera,
  addOpus,
  createOpus,
  editOpus,
  confirmDelete,
  deleteOpus,
  updateOpus,
} from "../controllers/opus.controller.js";

const opusRouter = Router();

opusRouter.get("/", getAllOpera);
opusRouter.get("/add/{:authorId}", addOpus);
opusRouter.get("/:authorId/:opusId/edit/", editOpus);
opusRouter.post("/add/", createOpus);
opusRouter.post("/:authorId/:opusId/delete/", deleteOpus);
opusRouter.get("/:authorId/:opusId/delete/", confirmDelete);
opusRouter.post("/:authorId/:opusId/edit", updateOpus);

export default opusRouter;

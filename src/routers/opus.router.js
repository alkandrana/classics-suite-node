import { Router } from "express";

import {
  getAllOpera,
  addOpus,
  createOpus
} from "../controllers/opus.controller.js";

const opusRouter = Router();

opusRouter.get("/", getAllOpera);
opusRouter.get("/add/", addOpus);
opusRouter.post("/add/", createOpus);

export default opusRouter;

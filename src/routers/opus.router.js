import { Router } from "express";

import {
getAllOpera
} from "../controllers/opus.controller.js";

const opusRouter = Router();

opusRouter.get("/", getAllOpera);

export default opusRouter;

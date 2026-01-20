import { Router } from 'express';

import {
    getNode,
    addNode,
    createNode,
} from "../controllers/node.controller.js";

const nodeRouter = Router();

nodeRouter.get("/:id", getNode);
nodeRouter.get("/add/:authorId/:opusId{/:nodeId}", addNode);
nodeRouter.post("/add", createNode);

export default nodeRouter;

import { Router } from 'express';

import {
    getNode,
    addNode,
    createNode,
} from "../controllers/node.controller.js";

const nodeRouter = Router();

nodeRouter.get("/:id", getNode);
nodeRouter.get("/{:authorId}/{:opusId}/{:nodeId}/add", addNode);
nodeRouter.post("/add", createNode);

export default nodeRouter;

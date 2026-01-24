import { Router } from 'express';

import {
    getNode,
    addNode,
    createNode,
    deleteNode
} from "../controllers/node.controller.js";

const nodeRouter = Router();

nodeRouter.get("/:id", getNode);
nodeRouter.get("/:authorId/:opusId{/:nodeId}/add", addNode);
nodeRouter.post("/add", createNode);
nodeRouter.post("/:nodeId/delete", deleteNode);

export default nodeRouter;

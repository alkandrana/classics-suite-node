import { Router } from "express";

import { 
	getAllAuthors, 
  addAuthor,
  createAuthor,
} from "../controllers/author.controller.js";

const authorRouter = Router();

authorRouter.get("/", getAllAuthors);
authorRouter.get("/add", addAuthor);
authorRouter.post("/add", createAuthor);

export default authorRouter;

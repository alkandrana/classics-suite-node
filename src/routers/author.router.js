import { Router } from "express";

import { 
	getAllAuthors, 
  addAuthor,
  createAuthor,
  editAuthor,
} from "../controllers/author.controller.js";

const authorRouter = Router();

authorRouter.get("/", getAllAuthors);
authorRouter.get("/add", addAuthor);
authorRouter.get("/edit", editAuthor);
authorRouter.post("/add", createAuthor);

export default authorRouter;

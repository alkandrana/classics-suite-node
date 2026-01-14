import { Router } from "express";

import { 
	getAllAuthors, 
  addAuthor,
  createAuthor,
  editAuthor,
  updateAuthor
} from "../controllers/author.controller.js";

const authorRouter = Router();

authorRouter.get("/", getAllAuthors);
authorRouter.get("/add", addAuthor);
authorRouter.get("/edit/:id", editAuthor);
authorRouter.post("/add", createAuthor);
authorRouter.post("/edit/:id", updateAuthor);

export default authorRouter;

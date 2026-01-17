import { Router } from "express";

import { 
  getAllAuthors,
  getAuthor,
  addAuthor,
  createAuthor,
  editAuthor,
  updateAuthor,
  confirmDelete,
  deleteAuthor
} from "../controllers/author.controller.js";

const authorRouter = Router();

authorRouter.get("/", getAllAuthors);
authorRouter.get("/:id", getAuthor);
authorRouter.get("/add", addAuthor);
authorRouter.get("/edit/:id", editAuthor);
authorRouter.get("/delete/:id", confirmDelete);
authorRouter.post("/add", createAuthor);
authorRouter.post("/edit/:id", updateAuthor);
authorRouter.post("/delete/:id", deleteAuthor);

export default authorRouter;

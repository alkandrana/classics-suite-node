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

authorRouter.get("/add", addAuthor);
authorRouter.post("/add", createAuthor);

authorRouter.get("/", getAllAuthors);
authorRouter.get("/edit/:id", editAuthor);
authorRouter.post("/edit/:id", updateAuthor);
authorRouter.get("/delete/:id", confirmDelete);
authorRouter.post("/delete/:id", deleteAuthor);
authorRouter.get("/:id", getAuthor);







export default authorRouter;

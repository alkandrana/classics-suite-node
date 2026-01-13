import { prisma } from '../../lib/prisma.js';

const authorClient = prisma.author;

// get all authors
export const getAllAuthors = async (req, res) => {
  try {
    const allAuthors = await authorClient.findMany({
      
    });
    res.render("authors/index", { authors: allAuthors });
  } catch (e){
    console.log(e);
  }
};

// get add form
export const addAuthor = async (req, res) => {
  const title = "Add an Author";
  res.render("authors/add", { title: title });
}

// post new author
export const createAuthor = async (req, res) => {
  req.body.authorId = req.body.authorId.trim().toUpperCase(); 
  try {
    const authorData = req.body;
    console.log("Author to save:");
    console.log(authorData);
    const newAuthor = await authorClient.create({
      data: authorData,
    });
    console.log("Session saved successfully.");
    console.log(newAuthor);
  } catch (e) {
    console.log(e);
  }
  res.redirect("/authors");
}

export const editAuthor = async (req, res) => {
  const title = "Edit Author"
  const authorId = req.body.authorId.trim().toUpperCase();
  try {
    const author = await authorClient.findUnique({
      where: {
        authorId: authorId,
      },
    });
    console.log(author);
    res.render("authors/edit", {author: author});
  } catch (e) {
    console.log(e);
  }
}

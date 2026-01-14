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
  console.log ("In Get Author To Edit");
  const title = "Edit Author"
  const authorId = req.params.id; // irrespective of database property name
  console.log(req.params);
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

// update author (post)
export const updateAuthor = async (req, res) => {
  const authorId = req.params.id.trim().toUpperCase(); 
  try {
    const authorData = req.body;
    const editedAuthor = await authorClient.update({
      where: {
        authorId: authorId,
      },
      data: authorData,
    });
    console.log(`${editedAuthor.authorId} successfully updated.`)
  } catch (e) {
    console.log(e);
  }
  res.redirect("/authors/");
} 

// get "Confirm Delete" page
export const confirmDelete = async (req, res) => {
  const authorId = req.params.id.trim().toUpperCase();
  try {
    const record = await authorClient.findUnique({
      where: {
        authorId: authorId,
      },
    });
    console.log(record);
    res.render("authors/delete", { author: record })
  } catch (e) {
    console.log(e);
  }
}

export const deleteAuthor = async (req, res) => {
  const authorId = req.params.id.trim().toUpperCase();
  try {
    const object = await authorClient.delete({
      where: {
        authorId: authorId,
      },
    });
    console.log(`${object.name} successfully deleted.`)
    console.log(object);
    res.redirect("/authors/");
  } catch (e) {
    console.log(e);
  }
}

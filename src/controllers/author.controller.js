import {prisma} from '../../lib/prisma.js';
import {Language} from "../../generated/prisma/enums.ts";

const authorClient = prisma.author;

// ---- READ ----

// get all authors
export const getAllAuthors = async (req, res) => {
    try {
        const allAuthors = await authorClient.findMany({});
        res.render("authors/index", {authors: allAuthors});
    } catch (e) {
        console.log(e);
    }
};

export const getAuthor = async (req, res) => {
    const authorId = req.params.id.trim().toUpperCase();
    try {
        const author = await authorClient.findUnique({
            where: {
                authorId: authorId,
            },
            include: {
                opera: {
                    include: {
                        textNodes: true,
                    },
                },
            },
        });
        res.render("authors/details", {author: author});
    } catch (e) {
        console.log(e);
    }
}
// ---- CREATE ----

// get add form
export const addAuthor = async (req, res) => {
    const languages = Object.values(Language);
    const title = "Add an Author";
    res.render("authors/add", {title: title, lang: languages});
}

// post new author
export const createAuthor = async (req, res) => {
    req.body.authorId = req.body.authorId.trim().toUpperCase();
    try {
        const authorData = req.body;
        const newAuthor = await authorClient.create({
            data: authorData,
        });
        console.log("Session saved successfully.");
    } catch (e) {
        console.log(e);
    }
    res.redirect("/authors");
}

// ---- UPDATE ----

// get edit-author form
export const editAuthor = async (req, res) => {
    const title = "Edit Author"
    const authorId = req.params.id; // irrespective of database property name
    const languages = Object.values(Language);
    console.log(authorId);
    try {
        const author = await authorClient.findUnique({
            where: {
                authorId: authorId,
            },
        });
        console.log(author);
        res.render("authors/edit", {title: title, author: author, languages: languages});
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

// ---- DELETE ----

// get "Confirm Delete" page
export const confirmDelete = async (req, res) => {
    const authorId = req.params.id.trim().toUpperCase();
    try {
        const record = await authorClient.findUnique({
            where: {
                authorId: authorId,
            },
            include: {
                _count: {
                    select: {
                        opera: true,
                    },
                },
            },
        });
        console.log(record);
        res.render("authors/delete", {author: record})
    } catch (e) {
        console.log(e);
    }
}

// post delete request
export const deleteAuthor = async (req, res) => {
    const authorId = req.params.id.trim().toUpperCase();
    try {
        const object = await authorClient.delete({
            where: {
                authorId: authorId,
            },
        });
        console.log(`${object.name} successfully deleted.`)
        res.redirect("/authors/");
    } catch (e) {
        console.log(e);
    }
}

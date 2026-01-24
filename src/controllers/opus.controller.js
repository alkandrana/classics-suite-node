import {prisma} from '../../lib/prisma.js';
import {Language} from '../../generated/prisma/enums.ts';

const opusClient = prisma.opus;

// ---- READ ----

// get all works
export const getAllOpera = async (req, res) => {
    try {
        const allOpera = await opusClient.findMany({
            include: {
                author: true,
            },
        });
        res.render("opera/index", {opera: allOpera});
    } catch (e) {
        console.log(e);
    }
};

// get one work
export const getOpus = async (req, res) => {
    const authorId = req.params.authorId.trim().toUpperCase();
    const opusId = req.params.opusId.trim().toUpperCase();
    try {
        const opus = await opusClient.findUnique({
            where: {
                authorId_opusId: {
                    authorId: authorId,
                    opusId: opusId,
                },
            },
            include: {
                textNodes: {
                    where: {
                        parentId: null,
                    },
                    include: {
                        children: true,
                    },
                },
                author: true,
            },
        });
        // FOR TESTING ONLY
        console.log(opus);
        res.render("opera/details", {opus: opus});
    } catch (e) {
        console.log(e);
    }
}

// --- CREATE ---

// get add form
export const addOpus = async (req, res) => {
    const title = "Add a New Work";
    const languages = Object.values(Language);
    const author = {
        id: "",
        lang: ""
    };
    try {
        const authors = await prisma.author.findMany({});

        if (req.params.authorId) {
            author.id = req.params.authorId.trim().toUpperCase();
            const currentAuthor = await prisma.author.findUnique({
                where: {
                    authorId: author.id,
                },
                select: {
                    language: true,
                },
            });
            author.lang = currentAuthor.language;
        }
        console.log(author);
        console.log(authors);
        console.log(languages);
        res.render("opera/add", {title: title, languages: languages, authors: authors, author: author});
    } catch (err) {
        console.log(err);
    }
}

// post new work
export const createOpus = async (req, res) => {
    req.body.opusId = req.body.opusId.trim().toUpperCase();
    req.body.authorId = req.body.authorId.trim().toUpperCase();
    const opusData = req.body;
    try {
        const newOpus = await opusClient.create({
            data: opusData,
        });
        console.log(`${newOpus.authorId}. ${newOpus.opusId}. successfully created.`);
    } catch (e) {
        console.log(e);
    }
    res.redirect("/opera");
}

// --- UPDATE ---

// get edit form
export const editOpus = async (req, res) => {
    const title = "Edit Work";
    console.log(req.params);
    const authorId = req.params.authorId;
    const opusId = req.params.opusId;
    // const { authId, opusId } = req.params;
    console.log(`Author: ${authorId}, OpusId: ${opusId}`);
    const languages = Object.values(Language);
    try {
        const opus = await opusClient.findUnique({
            where: {
                authorId_opusId: {
                    authorId: authorId,
                    opusId: opusId,
                },
            },
        });
        res.render("opera/edit", {title: title, langs: languages, opus: opus});
    } catch (e) {
        console.log(e);
    }
}

// post edited work
export const updateOpus = async (req, res) => {
    const authorId = req.params.authorId.trim().toUpperCase();
    const opusId = req.params.opusId.trim().toUpperCase();
    const opusData = req.body;
    try {
        const editedOpus = await opusClient.update({
            where: {
                authorId_opusId: {
                    authorId: authorId,
                    opusId: opusId,
                },
            },
            data: opusData,
        });
        console.log(`${authorId}. ${opusId}. successfully updated.`);
        console.log(editedOpus);
    } catch (e) {
        console.log(e);
    }
    res.redirect("/opera");
}

// --- DELETE ---

// get "confirm delete" page
export const confirmDelete = async (req, res) => {
    const authId = req.params.authorId.trim().toUpperCase();
    const opusId = req.params.opusId.trim().toUpperCase();
    const title = `Delete ${authId} ${opusId}`;
    const opus = await opusClient.findUnique({
        where: {
            authorId_opusId: {
                authorId: authId,
                opusId: opusId,
            },
        },
        include: {
            author: true,
        },
    });
    res.render("opera/delete", {title: title, opus: opus});
}

// post delete request
export const deleteOpus = async (req, res) => {
    console.log("Deleting...");
    const authId = req.params.authorId.trim().toUpperCase();
    const opusId = req.params.opusId.trim().toUpperCase();
    try {
        const opus = await opusClient.delete({
            where: {
                authorId_opusId: {
                    authorId: authId,
                    opusId: opusId,
                },
            },
        });
        console.log(`${authId} ${opusId} successfully deleted.`);
        console.log(opus);
    } catch (e) {
        console.log(e);
    }
    res.redirect("/opera");
}

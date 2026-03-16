import {prisma} from '../../lib/prisma.js';
import {Language} from '../../generated/prisma/enums.ts';

const opusClient = prisma.opus;
const authorClient = prisma.author;

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
    const opusId = parseInt(req.params.opusId);
    if (isNaN(opusId)) {
        return res.status(404).send("Opus not found");
    }
    try {
        const opus = await opusClient.findUnique({
            where: {
                opusId: opusId,
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
            author.id = parseInt(req.params.authorId);
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
    console.log(req.body);
    req.body.opusCode = req.body.opusCode.trim().toUpperCase();
    req.body.authorId = parseInt(req.body.authorId);
    if (isNaN(req.body.authorId)) {
        return res.status(400).send("Invalid author id");
    }
    const opusData = req.body;
    try {
        const newOpus = await opusClient.create({
            data: opusData,
        });
        console.log(`${newOpus.opusCode} successfully created.`);
        res.redirect(`/authors/${newOpus.authorId}`);
    } catch (e) {
        console.log(e);
    }

}

// --- UPDATE ---

// get edit form
export const editOpus = async (req, res) => {
    const title = "Edit Work";
    console.log(req.params);
    const opusId = parseInt(req.params.opusId);
    const languages = Object.values(Language);
    try {
        const authors = await authorClient.findMany({});
        const opus = await opusClient.findUnique({
            where: {
                opusId: opusId,
            },
        });
        res.render("opera/edit", {title: title, langs: languages, opus: opus, authors: authors});
    } catch (e) {
        console.log(e);
    }
}

// post edited work
export const updateOpus = async (req, res) => {
    const opusId = parseInt(req.params.opusId);
    if (isNaN(opusId)) {
        return res.status(400).send("Invalid opus id");
    }
    const authorId = parseInt(req.body.authorId);
    if (isNaN(authorId)) {
        return res.status(400).send("Invalid author id");
    }
    req.body.authorId = authorId;
    const opusData = req.body;
    try {
        const editedOpus = await opusClient.update({
            where: {
                opusId: opusId,
            },
            data: opusData,
        });
        console.log(`${editedOpus.opusCode} successfully updated.`);
        console.log(editedOpus);
    } catch (e) {
        console.log(e);
    }
    res.redirect("/opera");
}

// --- DELETE ---

// get "confirm delete" page
export const confirmDelete = async (req, res) => {
    const opusId = parseInt(req.params.opusId);
    if (isNaN(opusId)) {
        return res.status(400).send("Invalid opus id");
    }
    // const title = `Delete ${authId} ${opusId}`;
    const opus = await opusClient.findUnique({
        where: {
            opusId: opusId,
        },
        include: {
            author: true,
        },
    });
    res.render("opera/delete", {opus: opus});
}

// post delete request
export const deleteOpus = async (req, res) => {
    console.log("Deleting...");
    const opusId = parseInt(req.params.opusId);
    if (isNaN(opusId)) {
        return res.status(400).send("Invalid opus id");
    }
    try {
        const opus = await opusClient.delete({
            where: {
                opusId: opusId,
            },
        });
        console.log(`${opus.opusCode} successfully deleted.`);
        console.log(opus);
    } catch (e) {
        console.log(e);
    }
    res.redirect("/opera");
}

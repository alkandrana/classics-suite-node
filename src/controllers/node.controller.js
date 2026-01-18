import { prisma } from "../../lib/prisma.js"

import { TextNodeType } from "../../generated/prisma/enums.ts"

const nodeClient = prisma.textNode;

// ---- READ ----

// get nodes by opus
export const getNode = async (req, res) => {
    const nodeId = parseInt(req.params.id);
    if (isNaN(nodeId)) {
        return res.status(400).send("Invalid ID.");
    }
    try {
        const node = await nodeClient.findUnique({
            where: {
                id: nodeId,
            },
            include: {
                children: true,
                opus: {
                    include: {
                        author: true,
                    },
                },
            },
        });
        res.render('nodes/details', { section: node });
    } catch (e) {
        console.log(e);
    }
}
// ---- CREATE ----

// get add form
export const addNode = async (req, res) => {
    const currentWork = {
        authorId: req.params.authorId.trim().toUpperCase(),
        opusId: req.params.opusId.trim().toUpperCase()
    };
    const types = Object.values(TextNodeType);
    try{
        const authors = await prisma.author.findMany({});
        const opera = await prisma.opus.findMany({});
        res.render("nodes/add", {
            work: currentWork,
            types: types,
            authors: authors,
            opera: opera
        });
    } catch (e) {
        console.log(e);
    }
}

// post new node
export const createNode = async (req, res) => {
    console.log("Creating...");
    console.log(req.body);
    const ordinal = parseInt(req.body.ordinal);
    const authorId = req.body.authorId.trim().toUpperCase();
    const opusId = req.body.opusId.trim().toUpperCase();
    const label = req.body.label.trim();
    if (isNaN(ordinal)) {
        return res.status(400).send("Number must be a valid integer.");
    }

    try {
        const nodeData = {
            ordinal: ordinal,
            label: label,
            type: req.body.type,
            authorId: authorId,
            opusId: opusId
        }
        const newNode = await nodeClient.create({
            data: nodeData,
        });
        console.log(newNode);
        console.log(`${newNode.authorId} ${newNode.opusId} ${newNode.type} ${newNode.label} successfully created`);
        res.redirect(`/opera/${newNode.authorId}/${newNode.opusId}/`)
    } catch (e) {
        console.log(e);
    }
}
// ---- UPDATE ----

// ---- DELETE ----
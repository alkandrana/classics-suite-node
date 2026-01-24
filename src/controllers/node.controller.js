import { prisma } from "../../lib/prisma.js"

import { TextNodeType } from "../../generated/prisma/enums.ts"

const nodeClient = prisma.textNode;

// ---- READ ----

// get nodes by opus
export const getNode = async (req, res) => {
    console.log("Getting node...")
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
                    select: {
                        title: true,
                        author: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                parent: true,
            },
        });
        const childTypes = new Set(node.children.map(c => c.type));
        let type;
        if (childTypes.size === 0) {
            type = 'empty';
        } else if (childTypes.size === 1) {
            type = [...childTypes][0];
        } else {
            type = 'mixed';
        }
        console.log(`Type of children: ${type}`);
        console.log(childTypes);
        console.log(node);
        res.render('nodes/details', { section: node, nodeType: type });
    } catch (e) {
        console.log(e);
    }
}
// ---- CREATE ----

// get add form
export const addNode = async (req, res) => {
    console.log("Getting add form...")
    console.log(req.params);
    let current = {
        authorId: req.params.authorId.trim().toUpperCase(),
        opusId: req.params.opusId.trim().toUpperCase()
    };
    if (req.params.nodeId) {
        current.nodeId = parseInt(req.params.nodeId);
        if (!current.nodeId) {
            return res.status(400).send("Invalid ID.");
        }
    }
    const types = Object.values(TextNodeType).map(String); // makes type explicit and suppresses Jetbrains IDE warnings related to type comparison
    try{
        const authors = await prisma.author.findMany({});
        const opera = await prisma.opus.findMany({});
        console.log(authors);
        console.log(opera);
        res.render("nodes/add", {
            work: current,
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
    const text = req.body.text;
    if (req.body.type === "Line" && !text) {
        return res.status(400).send("Line requires text field.");
    }
    const authorId = req.body.authorId.trim().toUpperCase();
    const opusId = req.body.opusId.trim().toUpperCase();
    let label;
    if(!req.body.label) {
        label = req.body.ordinal.toString();
    } else {
        label = req.body.label.trim();
    }
    if (isNaN(ordinal)) {
        return res.status(400).send("Number must be a valid integer.");
    }
    let parentId;
    if (req.body.parentId){
        parentId = parseInt(req.body.parentId);
        if (!parentId){
            return res.status(400).send("Parent ID must be a valid integer.");
        }
    }

    try {
        const nodeData = {
            ordinal: ordinal,
            label: label,
            type: req.body.type,
            text: text,
            authorId: authorId,
            opusId: opusId
        }
        if (parentId){
            nodeData.parentId = parentId;
        }
        const newNode = await nodeClient.create({
            data: nodeData,
        });
        console.log(newNode);
        console.log(`${newNode.authorId} ${newNode.opusId} ${newNode.type} ${newNode.label} successfully created`);
        res.redirect(`/nodes/${newNode.parentId}/`);
    } catch (e) {
        console.log(e);
    }
}
// ---- UPDATE ----

// ---- DELETE ----
export const deleteNode = async (req, res) => {
    const nodeId = parseInt(req.params.nodeId);
    console.log(req.params);
    console.log(nodeId);
    if (!nodeId) {
        return res.status(400).send("Invalid ID.");
    }
    try {
        const deleted = await nodeClient.delete({
            where: {
                id: nodeId,
            },
        });
        console.log(deleted);
        console.log(`${deleted.opusId} ${deleted.parentId} ${deleted.type} ${deleted.label} successfully deleted.`);
        res.redirect(`/nodes/${deleted.authorId}/${deleted.opusId}/${deleted.parentId}/`);
    } catch (e) {
        console.log(e);
    }

}
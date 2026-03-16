import {prisma} from "../../lib/prisma.js"

import {TextNodeType} from "../../generated/prisma/enums.ts"

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
        // check that all children are of the same type (i.e., direct descendants only, no malformed sections)
        const childTypes = new Set(node.children.map(c => c.type));
        let type;
        if (childTypes.size === 0) {
            type = 'empty';
        } else if (childTypes.size === 1) {
            type = [...childTypes][0];
        } else {
            type = 'mixed';
        }
        // build a title for the page through the layers of the work
        // get the id of the containing element (either work or node)
        // get the endpoint of the containing element
        let title = `${node.type} ${node.label}`;
        let containerId = node.opusId;
        let url = "opera";
        let parentType = "Work";
        if (node.parent) {
            title = `${node.parent.type} ${node.parent.label} ${title}`;
            containerId = node.parentId
            url = "nodes";
            parentType = node.parent.type;
        }
        res.render('nodes/details', {section: node, nodeType: type, label: title, parent: containerId, root: url, parentType: parentType});
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
        authorId: parseInt(req.params.authorId),
        opusId: parseInt(req.params.opusId)
    };
    if (!current.opusId || !current.authorId) {
        return res.status(400).send("Invalid ID.");
    }
    if (req.params.nodeId) {
        current.nodeId = parseInt(req.params.nodeId);
        if (!current.nodeId) {
            return res.status(400).send("Invalid ID.");
        }
    }
    console.log("Current work and author: ")
    console.log(current);
    const types = Object.values(TextNodeType).map(String); // makes type explicit and suppresses Jetbrains IDE warnings related to type comparison
    try {
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
    // check valid input for line type
    const text = req.body.text;
    if (req.body.type === "Line" && !text) {
        return res.status(400).send("Line requires text field.");
    }
    // format string properties
    let authorId = parseInt(req.body.authorId);
    let opusId = parseInt(req.body.opusId);
    if (!authorId || !opusId) {
        return res.status(400).send("Invalid ID.");
    }
    req.body.authorId = authorId;
    req.body.opusId = opusId;
    if (!req.body.label) {
        req.body.label = req.body.ordinal.toString();
    } else {
        req.body.label = req.body.label.trim();
    }
    // parse number properties
    const ordinal = parseInt(req.body.ordinal);
    if (isNaN(ordinal)) {
        return res.status(400).send("Number must be a valid integer.");
    }
    req.body.ordinal = ordinal;

    let parentId;
    if (req.body.parentId) {
        parentId = parseInt(req.body.parentId);
        if (!parentId) {
            return res.status(400).send("Parent ID must be a valid integer.");
        }
        req.body.parentId = parentId;
    }

    try {
        const nodeData = req.body;
        const newNode = await nodeClient.create({
            data: nodeData,
        });
        console.log(newNode);
        console.log(`${newNode.authorId} ${newNode.opusId} ${newNode.type} ${newNode.label} successfully created`);
        if (newNode.parentId) {
            res.redirect(`/nodes/${newNode.parentId}/`);
        } else {
            res.redirect(`/opera/${newNode.opusId}`)
        }

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

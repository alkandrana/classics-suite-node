import { prisma } from "../../lib/prisma.js"

const nodeClient = prisma.textNode;

// ---- READ ----

// get nodes by opus
export const getNode = async (req, res) => {
    const authId = req.params.authorId.trim().toUpperCase();
    const opusId = req.params.opusId.trim().toUpperCase();
    try {
        const nodes = await nodeClient.findMany({
            where: {
                authorId_opusId: {
                    authorId: authId,
                    opusId: opusId,
                },
            },
        });

    } catch (e) {
        console.log(e);
    }
}
// ---- CREATE ----

// ---- UPDATE ----

// ---- DELETE ----
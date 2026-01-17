import { prisma } from '../../lib/prisma.js';
import { Language } from '../../generated/prisma/enums.ts';

const opusClient = prisma.opus;
// get all authors
export const getAllOpera = async (req, res) => {
  try {
    const allOpera = await opusClient.findMany({
      include: {
        author: true,
      },
    });
    res.render("opera/index", { opera: allOpera });
  } catch (e){
    console.log(e);
  }
};

// --- CREATE ---
export const addOpus = async (req, res) => {
  const title = "Add a New Work";
  const languages = Object.values(Language);
  res.render("opera/add", {title: title, lang: languages} );
}

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
export const editOpus = async (req, res) => {
  const title = "Edit Work";
  console.log(req.params);
  const  authorId = req.params.authorId;
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
    res.render("opera/edit", { title: title, langs: languages, opus: opus });
  } catch (e){
    console.log(e);
  }
}

// post
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

// get
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
  res.render("opera/delete", { title: title, opus: opus });
}

// post
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
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
    console.log(newOpus);
    console.log(`${newOpus.authorId}. ${newOpus.opusId}. successfully created.`);
  } catch (e) {
    console.log(e);
  }
  res.redirect("/opera");
}



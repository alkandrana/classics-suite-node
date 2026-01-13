import { prisma } from '../../lib/prisma.js';

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


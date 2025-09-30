// import { PrismaClient } from "@prisma/client";
// const Prismaclient = new PrismaClient();
// export default Prismaclient;
// import Prisma from "@prisma/client";

// export const prisma = new Prisma.PrismaClient();
// export default prisma;
import { PrismaClient } from "./generated/prisma";

export const prisma = new PrismaClient();
export default prisma;

import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prismaClient = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prismaClient;

const extension = Prisma.defineExtension({
  name: "CascadeDelete",
  query: {
    qna: {
      async delete({ model, operation, args, query }) {
        // Find related contentBlock IDs
        const contentBlocks = await prisma.contentBlock.findMany({
          where: {
            faqId: args.where.id,
          },
        });
        const contentBlockIds = contentBlocks.map((cb) => cb.id);

        // Perform the delete operation
        const result = await query(args);

        // Update positions array in the page model
        await updatePositions(contentBlockIds);

        return result;
      },
    },
    text: {
      async delete({ model, operation, args, query }) {
        const contentBlocks = await prisma.contentBlock.findMany({
          where: {
            textId: args.where.id,
          },
        });
        const contentBlockIds = contentBlocks.map((cb) => cb.id);
        const result = await query(args);
        await updatePositions(contentBlockIds);
        return result;
      },
    },
    heading1: {
      async delete({ model, operation, args, query }) {
        const contentBlocks = await prisma.contentBlock.findMany({
          where: {
            heading1Id: args.where.id,
          },
        });
        const contentBlockIds = contentBlocks.map((cb) => cb.id);
        const result = await query(args);
        await updatePositions(contentBlockIds);
        return result;
      },
    },
    heading2: {
      async delete({ model, operation, args, query }) {
        const contentBlocks = await prisma.contentBlock.findMany({
          where: {
            heading2Id: args.where.id,
          },
        });
        const contentBlockIds = contentBlocks.map((cb) => cb.id);
        const result = await query(args);
        await updatePositions(contentBlockIds);
        return result;
      },
    },
    image: {
      async delete({ model, operation, args, query }) {
        const contentBlocks = await prisma.contentBlock.findMany({
          where: {
            imageId: args.where.id,
          },
        });
        const contentBlockIds = contentBlocks.map((cb) => cb.id);
        const result = await query(args);
        await updatePositions(contentBlockIds);
        return result;
      },
    },
  },
});

async function updatePositions(contentBlockIds: number[]) {
  for (const id of contentBlockIds) {
    // Find pages containing the contentBlock ID
    const pages = await prisma.page.findMany({
      where: {
        positions: {
          has: id,
        },
      },
    });

    // Remove the contentBlock ID from positions arrays
    for (const page of pages) {
      const updatedPositions = page.positions.filter(
        (positionId) => positionId !== id,
      );
      await prisma.page.update({
        where: { id: page.id },
        data: { positions: updatedPositions },
      });
    }
  }
}

const prisma = prismaClient.$extends(extension);

export default prisma;

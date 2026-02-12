import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const folderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        parentId: z.string().nullable(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.folder.create({
        data: {
          name: input.name,
          parentId: input.parentId,
          userId: ctx.session.user.id, // Better Auth OK
        },
      });
    }),

  getByParent: protectedProcedure
  .input(
    z.object({
      parentId: z.string().nullable(),
      sortBy: z.enum(["name", "updatedAt"]).default("updatedAt"),
      sortDir: z.enum(["asc", "desc"]).default("desc"),
    }),
  )

  .query(async ({ ctx, input }) => {
    const orderBy =
      input.sortBy === "name"
        ? ({ name: input.sortDir } as const)
        : ({ updatedAt: input.sortDir } as const);

    const [folders, files] = await Promise.all([
      ctx.db.folder.findMany({
        where: { parentId: input.parentId, userId: ctx.session.user.id },
        orderBy: { [input.sortBy]: input.sortDir },
      }),
      ctx.db.file.findMany({
        where: { folderId: input.parentId, userId: ctx.session.user.id },
        orderBy: { [input.sortBy]: input.sortDir },
      }),
    ]);

    return { folders, files };
  }),


  rename: protectedProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string().min(1),
    })
  )
  .mutation(({ ctx, input }) => {
    return ctx.db.folder.update({
      where: {
        id: input.id,
        userId: ctx.session.user.id,
      },
      data: {
        name: input.name,
      },
    });
  }),

delete: protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(({ ctx, input }) => {
    return ctx.db.folder.delete({
      where: {
        id: input.id,
        userId: ctx.session.user.id,
      },
    });
  }),

  search: protectedProcedure
  .input(
    z.object({
      q: z.string().min(1).max(100),
      limit: z.number().min(1).max(50).default(12),
    })
  )
  .query(async ({ ctx, input }) => {
    const folders = await ctx.db.folder.findMany({
      where: {
        userId: ctx.session.user.id,
        name: {
          contains: input.q,
          mode: "insensitive",
        },
      },
      take: input.limit,
      orderBy: { updatedAt: "desc" },
    });

    const files = await ctx.db.file.findMany({
      where: {
        userId: ctx.session.user.id,
        name: {
          contains: input.q,
          mode: "insensitive",
        },
      },
      take: input.limit,
      orderBy: { updatedAt: "desc" },
    });

    return { folders, files };
  }),

  deleteFile: protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const file = await ctx.db.file.findUnique({
      where: { id: input.id },
    });

    if (!file) {
      throw new Error("File not found");
    }

    // Sécurité user
    if (file.userId !== ctx.session.user.id) {
      throw new Error("Unauthorized");
    }

    // Supprimer en DB
    await ctx.db.file.delete({
      where: { id: input.id },
    });

    return { success: true };
  }),

  moveFolder: protectedProcedure
  .input(
    z.object({
      id: z.string(),
      newParentId: z.string().nullable(),
    })
  )
  .mutation(({ ctx, input }) => {
    return ctx.db.folder.update({
      where: {
        id: input.id,
        userId: ctx.session.user.id,
      },
      data: {
        parentId: input.newParentId,
      },
    });
  }),
  
  getTree: protectedProcedure.query(({ ctx }) => {
  return ctx.db.folder.findMany({
    where: {
      userId: ctx.session.user.id,
    },
    select: {
      id: true,
      name: true,
      parentId: true,
    },
    orderBy: { name: "asc" },
  });
}), 
  
});
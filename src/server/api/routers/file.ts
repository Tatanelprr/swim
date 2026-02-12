import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const fileRouter = createTRPCRouter({
  move: protectedProcedure
    .input(
      z.object({
        fileId: z.string(),
        targetFolderId: z.string().nullable(), // null = racine
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.file.update({
        where: {
          id: input.fileId,
          userId: ctx.session.user.id,
        },
        data: {
          folderId: input.targetFolderId,
        },
      });
    }),
});

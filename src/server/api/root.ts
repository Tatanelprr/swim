import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { folderRouter } from "./routers/folder";
import { fileRouter } from "./routers/file";

export const appRouter = createTRPCRouter({
  post: postRouter,
  folder: folderRouter,
  file: fileRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

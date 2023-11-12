"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { cleanup } from "../utils";

export async function createThread(
  text: string,
  authorId: string,
  path: string
) {
  await prisma.post.create({
    data: {
      text: cleanup(text),
      author: {
        connect: {
          id: authorId,
        },
      },
    },
  });

  revalidatePath(path);
}

export async function replyToThread(
  text: string,
  authorId: string,
  threadId: string,
  path: string
) {
  await prisma.post.create({
    data: {
      text: cleanup(text),
      author: {
        connect: {
          id: authorId,
        },
      },
      parent: {
        connect: {
          id: threadId,
        },
      },
    },
  });

  revalidatePath(path);
}

export async function deleteThread(id: string, path: string) {
  // ! navigate back to home if on dedicated page for this thread & its deleted

  await prisma.post.update({
    where: {
      id,
    },
    data: {

      children: {
        deleteMany: {},
      },
    },
  });

  await prisma.post.delete({
    where: {
      id,
    },
  });

  revalidatePath(path);
}


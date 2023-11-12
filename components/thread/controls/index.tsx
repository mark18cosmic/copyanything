"use client";

import Share from "./share";
import { Modal } from "../comment";
import { Prisma } from "@prisma/client";

export default function Controls({
  data,
  numPosts,
}: {
  data: Prisma.PostGetPayload<{
    include: {
      author: true;
      children: {
        include: {
          author: true;
        };
      };
      parent: true;
      likes: true;
    };
  }>;
  numPosts?: number;
}) {

  return (
    <div className="relative h-9">
      <div className="flex items-center absolute top-0 left-0 space-x-3.5 py-2 z-10">
        <Modal data={data} />
        <Share name={data.author.name} post={data.id} />
      </div>
    </div>
  );
}

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import Item from "@/components/thread";
import Link from "next/link";

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await currentUser();

  if (!user) return null;

  const getUser = await prisma.user.findUnique({
    where: {
      username: params.id,
    },
  });

  const posts = await prisma.post.findMany({
    where: {
      authorId: getUser?.id,
      parent: null,
    },
    include: {
      author: true,
      children: {
        include: {
          author: true,
        },
      },
      parent: true,
    
    },
  });

  return (
    <>
      <div className="flex mt-4 w-full">
        <button className="py-2 w-full h-10 font-semibold text-center border-b border-b-white">
          Threads
        </button>
        <Link
          href={`/${params.id}/replies`}
          className="py-2 w-full h-10 font-medium text-center border-b duration-200 border-neutral-900 hover:border-neutral-700 hover:text-neutral-500 text-neutral-600"
        >
          Replies
        </Link>
      </div>
      {posts.length === 0 ? (
        <div className="mt-4 leading-loose text-center text-neutral-600">
          No threads posted yet.
        </div>
      ) : (
        posts.map((post) => <Item data={post} key={post.id} />)
      )}
    </>
  );
}

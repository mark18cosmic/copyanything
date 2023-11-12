import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/threads.svg";
import { Button } from "@/components/ui/button";

import { currentUser } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import Nav from "@/components/ui/nav";
import { redirect } from "next/navigation";
import HomePosts from "@/components/thread/homePosts";

export const revalidate = 0;

export default async function Page() {
  const user = await currentUser();

  if (!user)
    return (
      <>
        <div className="w-16 h-16 bg-cover">
          <Image
            src={logo}
            alt="Threads logo"
            className="object-cover min-w-full min-h-full invert"
          />
        </div>
        <div className="mt-4 mb-12 text-4xl font-bold gradient">Threads</div>

        <Link href="/sign-up" className="px-6 w-full">
          <Button className="w-full" variant="outline">
            Create Your Account
          </Button>
        </Link>
        <Link href="/sign-in" className="px-6 mt-2 w-full">
          <Button className="w-full" variant="ghost">
            Sign In
          </Button>
        </Link>
      </>
    );

  const getUser = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (!getUser?.onboarded) {
    redirect("/onboarding");
  }

  const posts = await prisma.post.findMany({
    take: 20,
    orderBy: {
      createdAt: "desc",
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
    where: {
      parent: null,
    },
  });

  return (
    <>
      <Nav
        create={{
          id: getUser.id,
          name: getUser.name,
          image: getUser.image,
        }}
        username={getUser.username}
      />
      <div className="flex justify-center items-center py-5 w-full">
        <div className="w-9 h-9 bg-cover">
          <Image
            src={logo}
            alt="Threads logo"
            className="object-cover min-w-full min-h-full invert"
          />
        </div>
      </div>

      {/* <div className="text-xs whitespace-pre">
        {JSON.stringify(posts, null, 2)}
      </div> */}
      <HomePosts posts={posts} />
    </>
    // </div>
    // </main>
  );
}

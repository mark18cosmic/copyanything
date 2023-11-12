import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

import Nav from "@/components/ui/nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

import logo from "@/assets/threads.svg";
import { InfoModal } from "@/components/profile/info";
import SelfShare from "@/components/profile/selfShare";
import { nFormatter } from "@/lib/utils";
import SignOut from "@/components/profile/signOut";
import { EditModal } from "@/components/profile/edit";

export default async function ProfilePageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const user = await currentUser();

  if (!user) return null;

  const getSelf = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!getSelf?.onboarded) {
    redirect("/onboarding");
  }

  const getUser = await prisma.user.findUnique({
    where: {
      username: params.id,
    },

  });

  if (!getUser) {
    return (
      <>
        <Nav
          create={{
            id: "",
            name: "",
            image: "",
          }}
          username={null}
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
        <div className="mt-24 font-semibold text-center">
          Sorry, this page isn&apos;t available
        </div>
        <div className="mt-4 text-center text-neutral-600">
          The link you followed may be broken, or the page may have been
          removed.
        </div>
      </>
    );
  }

  const self = getSelf.username === params.id;

  return (
    <>
      <Nav
        create={{
          id: getSelf.id,
          name: getSelf.name,
          image: getSelf.image,
        }}
        username={getSelf.username}
      />
      <div className="flex relative justify-end items-center px-3 mt-8 mb-6 w-full">
        {/* <Globe className="w-5 h-5" /> */}
        <div className="flex items-center space-x-3">
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
            <Instagram className="w-5 h-5" />
          </a>
          <InfoModal />
          <SignOut />
        </div>
      </div>
      <div className="flex justify-between items-start px-3 w-full">
        <div className="grow">
          <div className="text-2xl font-semibold">{getUser?.name}</div>
          <div className="flex items-center mt-1">
            {getUser.username}
            <Badge variant="secondary" className="ml-2 text-xs">
              threads.net
            </Badge>
          </div>
          {getUser.bio ? (
            <div className="pt-4 leading-relaxed">{getUser.bio}</div>
          ) : null}
        </div>

        <div className="overflow-hidden w-14 h-14 rounded-full bg-neutral-600">
          <Image
            src={getUser.image}
            alt={getUser.name + "'s profile image"}
            height={56}
            width={56}
          />
        </div>
      </div>

      {children}
    </>
  );
}

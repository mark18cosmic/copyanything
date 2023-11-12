import Image from "next/image";
import Link from "next/link";

import Others from "./others";
import MoreMenu from "./moreMenu";
import Controls from "./controls";
import { Post, Prisma } from "@prisma/client";

// import relativeTime from "dayjs/plugin/relativeTime";
// import dayjs from "dayjs";
// import updateLocale from "dayjs/plugin/updateLocale";

import loop from "@/assets/loop.svg";
import { timeSince } from "@/lib/utils";
import Timestamp from "./timestamp";
import NameLink from "./nameLink";

export default function Item({
  data,
  comment = false,
  posts,
  noLink = false,
  parent = false,
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
  comment?: boolean;
  posts?: Prisma.PostGetPayload<{
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
  }>[];
  noLink?: boolean;
  parent?: boolean;
}) {
  const mainClass = parent
    ? "px-3 pt-4 space-x-2 flex font-light"
    : comment
    ? `space-x-2 flex font-light ${noLink ? "pointer-events-none" : ""}`
    : `px-3 py-4 space-x-2 flex border-b font-light border-neutral-900 ${
        noLink ? "pointer-events-none" : ""
      }`;

  // dayjs.extend(relativeTime);
  // const ago = dayjs(data.createdAt).fromNow();

  // dayjs.extend(updateLocale);

  // dayjs.updateLocale("en", {
  //   relativeTime: {
  //     future: "in %s",
  //     past: "%s",
  //     s: "now",
  //     m: "1m",
  //     mm: "%dm",
  //     h: "1h",
  //     hh: "%dh",
  //     d: "1d",
  //     dd: "%dd",
  //     M: "1m",
  //     MM: "%dm",
  //     y: "1y",
  //     yy: "%dy",
  //   },
  // });

  return (
    <>
      <Link href={`/t/${data.id}`} className={mainClass}>
        <div className="flex flex-col justify-between items-center">
          <div className="overflow-hidden mt-1 w-8 h-8 rounded-full bg-neutral-600">
            <Image
              src={data.author.image}
              height={32}
              width={32}
              className=""
              alt={data.author.name + "'s profile image"}
            />
          </div>
          <div
            className={`w-0.5 grow mt-2 rounded-full bg-neutral-800 relative ${
              parent ? "mb-5" : null
            }`}
          >
            {parent ? (
              <div className="absolute right-0 -bottom-7 w-4 h-8">
                <Image
                  alt=""
                  src={loop}
                  width={16}
                  height={32}
                  className="w-full h-full"
                />
              </div>
            ) : null}
          </div>
          {comment || parent ? null : <Others others={data.children} />}
        </div>
        <div className="space-y-1 w-full">
          <div className="flex justify-between items-center w-full">
            <NameLink username={data.author.username} name={data.author.name} />

            {comment ? null : (
              <div className="flex items-center space-x-2">
                {/* <Timestamp time={data.createdAt} /> */}
                <MoreMenu
                  name={data.author.name}
                  id={data.id}
                  author={data.author.id}
                />
              </div>
            )}
          </div>
          <div
            className={
              comment
                ? "pb-3 text-left text-base/relaxed"
                : "text-left text-base/relaxed"
            }
          >
            {data.text}
          </div>
          {comment ? null : (
            <>
              <Controls numPosts={posts ? posts.length : -1} data={data} />
              <div className="flex items-center space-x-2 text-neutral-600">
                {data.children.length > 0 ? (
                  <div>
                    {data.children.length}{" "}
                    {data.children.length === 1 ? "reply" : "replies"}
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </Link>
    </>
  );
}

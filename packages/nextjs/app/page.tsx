"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { communitiesConfig } from "~~/engagement.config";
import { useGlobalState } from "~~/services/store/store";

const Home: NextPage = () => {
  const setAppTheme = useGlobalState(({ setAppTheme }) => setAppTheme);

  useEffect(() => {
    setAppTheme("engagement.vision");
  }, [setAppTheme]);

  let index = 0;
  const communitiesComponents: JSX.Element[] = [];
  for (const key in communitiesConfig) {
    if (communitiesConfig.hasOwnProperty(key)) {
      const community = communitiesConfig[key];

      if (community.name === "Engagement.Vision") continue;

      console.log(community.logo);

      communitiesComponents.push(
        <Link href={community.link || "/"} key={index}>
          <div className="flex flex-col bg-base-100 px-4 py-4 text-center items-center max-w-xs w-[140px] md:w-[200px] rounded-3xl transform scale-100 hover:scale-90 transition duration-300 ease-in-out">
            <div className="flex relative w-10 h-10 md:w-20 md:h-20">
              {community.logoJs ? (
                <community.logoJs className={"fill-current w-20 h-20"} />
              ) : (
                <Image alt="Logo" className="cursor-pointer rounded-lg" fill src={`/${community.logo || ""}`} />
              )}
            </div>
            <p className="truncate">{community.name}</p>
          </div>
        </Link>,
      );

      index++;
    }
  }

  // const chainObjsComponent = communitiesConfig.forEach((obj, index) => {
  //   if (obj.name === "Engagement.Vision") return;
  //   return (
  //     <Link href={obj.link} key={index}>
  //       <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs w-[200px] rounded-3xl transform scale-100 hover:scale-90 transition duration-300 ease-in-out">
  //         <div className="flex relative w-10 h-10">
  //           <Image alt="Logo" className="cursor-pointer" fill src={`/${obj.logo || ""}`} />
  //         </div>
  //         <p>{obj.name}</p>
  //       </div>
  //     </Link>
  //   );
  // });
  return (
    <>
      <div className="flex items-center flex-col flex-grow bg-gradient-to-t from-primary to-secondary">
        <div className="px-5 mt-4">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Engagement.Vision</span>
          </h1>
          <p className="text-center">
            {"View a user's engagement with a community through "}
            <span className="bg-primary rounded-lg p-1">Onchain Activity</span>
            {", "}
            <span className="bg-primary rounded-lg p-1">Twitter Interactions</span>
            {", "}
            <span className="bg-primary rounded-lg p-1">Warpcast Interactions</span> {", and "}
            <span className="bg-primary rounded-lg p-1">Talent Protocol Badges</span>.
          </p>
        </div>

        <div className="flex flex-col w-full px-8">
          <p className="text-center text-4xl">Select a community to get started! </p>
          <div className="flex justify-center items-center gap-12 flex-wrap">{communitiesComponents}</div>
        </div>
        <div className="pt-10 flex flex-col">
          <p className="text-3xl text-center">Integrations</p>
          <div className="flex flex-wrap">
            <div className="flex relative w-24 h-24">
              <Link href="https://ethfollow.xyz">
                <Image alt="Logo" className="cursor-pointer" fill src={"/efp-first-100.png"} />
              </Link>
            </div>
            <div className="flex relative w-24 h-24">
              <Link href="https://ethfollow.xyz">
                <Image alt="Logo" className="cursor-pointer" fill src={"/efp-logo.svg"} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

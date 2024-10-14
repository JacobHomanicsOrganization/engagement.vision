"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { useGlobalState } from "~~/services/store/store";

const chainObjs = [
  {
    name: "Engagement.Vision",
    logo: "favicon.svg",
    link: "/",
  },
  {
    name: "Nouns",
    logo: "noggles.svg",
    link: "/nouns/welcome",
  },
  {
    name: "Base",
    logo: "Base_Network_Logo.svg",
    link: "/base/welcome",
  },
  {
    name: "OP Mainnet",
    logo: "optimism-ethereum-op-logo.png",
    link: "/optimism/welcome",
  },

  {
    name: "Ethereum",
    logo: "ethereum-eth.svg",
    link: "/mainnet/welcome",
  },

  {
    name: "Arbitrum",
    logo: "arbitrum-arb-logo.png",
    link: "/arbitrum/welcome",
  },
];

const Home: NextPage = () => {
  const setAppTheme = useGlobalState(({ setAppTheme }) => setAppTheme);

  useEffect(() => {
    setAppTheme("app");
  }, [setAppTheme]);

  const chainObjsComponent = chainObjs.map((obj, index) => {
    if (obj.name === "Engagement.Vision") return;
    return (
      <Link href={obj.link} key={index}>
        <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs w-[200px] rounded-3xl transform scale-100 hover:scale-90 transition duration-300 ease-in-out">
          <div className="flex relative w-10 h-10">
            <Image alt="Logo" className="cursor-pointer" fill src={`/${obj.logo || ""}`} />
          </div>
          <p>{obj.name}</p>
        </div>
      </Link>
    );
  });
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

        <div className="flex-grow w-full mt-16 px-8 py-12">
          <div className="rounded-lg">
            {" "}
            <p className="text-center text-lg">Select a community to get started! </p>
          </div>
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">{chainObjsComponent}</div>
        </div>
      </div>
    </>
  );
};

export default Home;

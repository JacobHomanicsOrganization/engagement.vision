"use client";

import Link from "next/link";

// import { IconsLinksData } from "./config/socials.config";
// import { IconsLinks } from "./icons-links/IconLinks";

type Props = {
  address?: string;
  efpFollowers?: number;
  efpFollowing?: number;
};

export const EFPCard = ({ address, efpFollowers, efpFollowing }: Props) => {
  return efpFollowers && efpFollowing ? (
    <Link
      href={`https://ethfollow.xyz/${address}`}
      target="#"
      className="transform scale-100 hover:scale-95 transition duration-300 ease-in-out"
    >
      <div className="bg-gradient-to-t from-[#FFBCE4] to-[#FFFA80] rounded-lg text-[#1E2025] p-2 font-bold text-center">
        <p className="m-0">Ethereum Follow Protocol</p>
        <div className="flex items-center justify-center space-x-4">
          <div>
            <div className="text-sm">Followers </div>
            <div className="text-sm">{efpFollowers} </div>
          </div>
          <div>
            <div className="text-sm">Following </div>
            <div className="text-sm">{efpFollowing} </div>
          </div>
        </div>
      </div>
    </Link>
  ) : (
    <></>
  );
};

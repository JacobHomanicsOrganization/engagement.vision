"use client";

import Link from "next/link";
import { AddressRaw } from "../scaffold-eth/AddressRaw";
import { Chain } from "viem/chains";

// import { IconsLinksData } from "./config/socials.config";
// import { IconsLinks } from "./icons-links/IconLinks";

type Props = {
  name: string | null;
  description: string | null;
  image: string | null;
  address?: string;
  chain?: Chain;
  ens?: string;
  efpFollowers?: number;
  size?: "sm" | "base" | "lg";
  efpFollowing?: number;
  // iconslinks?: any;
};

const sizeMap = {
  sm: "w-[75px] md:w-[100px]",
  base: "w-[75px] md:w-[150px]",
  lg: "",
};

export const PfpCard = ({
  name,
  description,
  address,
  chain,
  ens,
  image, //iconslinks,
  size = "base",
  efpFollowers,
  efpFollowing,
}: Props) => {
  return (
    <div className="flex flex-col items-center text-center">
      {image ? (
        image?.length > 0 ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={image}
            alt={"Profile Picture"}
            className={`${sizeMap[size]} rounded-full`}
            style={{ aspectRatio: "1 / 1" }}
          />
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
      <div className="text-2xl">{name}</div>
      {address ? (
        <AddressRaw address={address} ens={ens} ensAvatar={image} chain={chain} size="xl" showIcon={false} />
      ) : (
        <></>
      )}
      {/* <div className="pointer-events-auto border-4 border-primary rounded-lg p-2">
        <IconsLinks iconsLinks={iconslinks} size="sm" justify="center" />
      </div> */}
      {efpFollowers && efpFollowing ? (
        <Link href={`https://ethfollow.xyz/${address}`} target="#">
          <div className="bg-gradient-to-t from-[#FFBCE4] to-[#FFFA80] rounded-lg text-[#1E2025] p-2 font-bold">
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
      )}
      {description ? <div className="text-lg m-2">{description}</div> : <></>}
    </div>
  );
};

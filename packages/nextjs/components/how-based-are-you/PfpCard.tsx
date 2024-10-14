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
      {efpFollowers ? (
        <Link href={`https://ethfollow.xyz/${address}`} target="#">
          <div className="text-[#FF79C9]">EFP Followers: {efpFollowers} </div>
        </Link>
      ) : (
        <></>
      )}
      {description ? <div className="text-lg m-2">{description}</div> : <></>}
    </div>
  );
};

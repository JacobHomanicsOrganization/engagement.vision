"use client";

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
  image, //iconslinks,
  size = "base",
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
        <AddressRaw address={address} ens={name} ensAvatar={image} chain={chain} size="xl" showIcon={false} />
      ) : (
        <></>
      )}
      {/* <div className="pointer-events-auto border-4 border-primary rounded-lg p-2">
        <IconsLinks iconsLinks={iconslinks} size="sm" justify="center" />
      </div> */}
      {description ? <div className="text-lg m-2">{description}</div> : <></>}
    </div>
  );
};

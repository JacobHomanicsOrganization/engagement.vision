"use client";

import { AddressRaw } from "../scaffold-eth/AddressRaw";
import { Chain } from "viem/chains";

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
  talentScore?: number;
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
      {description ? <div className="text-lg m-2">{description}</div> : <></>}
      {/* {talentScore ? (
        <div className="flex m-4 border-t-4 border-t-[#826AEE] border-l-4 border-l-[#826AEE] border-r-4 border-r-[#826AEE] rounded-xl p-4">
          <Image src={`/talent-protocol-logo/logo-purple.svg`} alt="TP" width={52} height={52} />
          <div className="flex flex-col">
            <p className="m-0">Builder Score</p>
            <p className="m-0 text-[#826AEE] font-bold">{talentScore}</p>
          </div>
        </div>
      ) : (
        <></>
      )}

      {efpFollowers && efpFollowing ? (
        <Link
          href={`https://ethfollow.xyz/${address}`}
          target="#"
          className="transform scale-100 hover:scale-95 transition duration-300 ease-in-out"
        >
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
      )} */}
    </div>
  );
};

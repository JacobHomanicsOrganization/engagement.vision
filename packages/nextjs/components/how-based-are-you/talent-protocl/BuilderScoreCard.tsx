"use client";

import Image from "next/image";

type Props = {
  talentScore?: number;
};

export const BuilderScoreCard = ({ talentScore }: Props) => {
  return talentScore ? (
    <div className="flex border-t-4 border-t-[#826AEE] border-l-4 border-l-[#826AEE] border-r-4 border-r-[#826AEE] rounded-xl p-3 items-center justify-center">
      <Image src={`/talent-protocol-logo/logo-purple.svg`} alt="TP" width={52} height={52} />
      <div className="flex flex-col text-center">
        <p className="m-0">Builder Score</p>
        <p className="m-0 text-[#826AEE] font-bold">{talentScore}</p>
      </div>
    </div>
  ) : (
    <></>
  );
};

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAddress } from "viem";
import { InputBase } from "~~/components/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";

const communities = {
  mainnet: {
    titleCard: "How Programmable Are You?",
    ctaCard: "Find out how Programmable you are!",
  },
  base: {
    titleCard: "How Based Are You?",
    ctaCard: "Find out how Based you are!",
  },
  arbitrum: {
    titleCard: "How Stylized Are You?",
    ctaCard: "Find out how Stylized you are!",
  },
  optimism: {
    titleCard: "How Optimistic Are You?",
    ctaCard: "Find out how Optimistic you are!",
  },
  nouns: {
    titleCard: "How Nounish Are You? ⌐◨-◨",
    ctaCard: "Find Out How ⌐◨-◨ Nounish ⌐◨-◨ You Are!",
  },
};

export default function WelcomePage({ params }: { params: { community: string } }) {
  const setAppTheme = useGlobalState(({ setAppTheme }) => setAppTheme);

  useEffect(() => {
    setAppTheme(params.community);
  }, [params.community, setAppTheme]);

  const router = useRouter();

  const [nameValue, setNameValue] = useState<string>("");

  const community = communities[params.community as keyof typeof communities];

  return (
    <form
      onSubmit={e => {
        e.preventDefault();

        let finalNameValue = nameValue;

        if (!isAddress(nameValue)) {
          finalNameValue = finalNameValue.toLowerCase();
        }
        router.push(`/${params.community}/${finalNameValue}`);
      }}
      className="flex flex-col justify-center items-center space-y-32"
    >
      <p className="text-4xl md:text-8xl text-center text-primary">{community.titleCard}</p>
      <div className="w-[300px] md:w-[800px] flex justify-center flex-col text-center">
        <p className="text-xl md:text-4xl">Enter an Address/ENS Name/Basename</p>

        <InputBase
          value={nameValue}
          onChange={updatedValue => {
            setNameValue(updatedValue);
          }}
          placeholder="0x / name.eth / name.base.eth"
        />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-xl md:text-4xl text-center">{community.ctaCard}</p>
        <button type="submit" className="btn btn-primary btn-lg text-4xl">
          Go!
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputBase } from "~~/components/scaffold-eth";

export default function WelcomePage() {
  const router = useRouter();

  const [nameValue, setNameValue] = useState<string>("");

  return (
    <div className="flex flex-col justify-center items-center space-y-32">
      <p className="text-4xl md:text-8xl text-center">How Based Are You?</p>
      <div className="w-[300px] md:w-[800px] flex justify-center flex-col text-center">
        <p className="text-xl md:text-4xl">Enter an address</p>
        <InputBase
          value={nameValue}
          onChange={updatedValue => {
            setNameValue(updatedValue);
          }}
          placeholder="0x"
        />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-xl md:text-4xl text-center">Find out how based you are!</p>
        <button
          onClick={() => {
            router.push(`/base/${nameValue}`);
          }}
          className="btn btn-primary btn-lg text-4xl"
        >
          Go!
        </button>
      </div>
    </div>
  );
}

import React from "react";

type Props = {
  title: string;
  score: number;
};

export const Score = ({ title, score }: Props) => {
  return (
    <div className="flex flex-col bg-secondary w-[100px] md:w-[200px] rounded-lg items-center justify-center">
      <p className="text-sm md:text-xl m-0 text-center">{title}</p>
      <p className="text-2xl md:text-6xl m-0 text-center text-primary">{score}</p>
    </div>
  );
};

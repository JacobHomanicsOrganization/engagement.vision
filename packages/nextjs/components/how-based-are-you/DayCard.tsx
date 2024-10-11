import React from "react";

type Props = {
  day: number;
  score: number;
  sources?: any;
};

export const DayCard = ({ day, score, sources }: Props) => {
  return (
    <div className="bg-secondary rounded-lg shadow-lg w-[85px] h-[85px] md:w-[100px] md:h-[100px]">
      <div className="flex">
        <p className="text-xl m-0 p-1">{day}</p>
        <div className="flex space-x-1 p-1">{sources}</div>
      </div>
      <p
        className={`text-3xl md:text-3xl text-center m-0 pt-3 md:pt-8 text-primary ${
          score === 0 ? `brightness-50` : `brightness-100`
        }`}
      >
        {score}
      </p>
    </div>
  );
};

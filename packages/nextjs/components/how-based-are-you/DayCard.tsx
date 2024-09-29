import React from "react";

type Props = {
  day: number;
  score: number;
};

export const DayCard = ({ day, score }: Props) => {
  return (
    <div className="bg-base-100 rounded-lg shadow-lg w-[85px] h-[85px] md:w-[100px] md:h-[100px]">
      <p className="text-xl m-0 p-1">{day}</p>
      <p
        className={`text-3xl md:text-6xl text-center m-0 pt-3 md:pt-1 ${
          score === 0 ? "text-[#4069BF]" : "text-primary"
        }`}
      >
        {score}
      </p>
    </div>
  );
};

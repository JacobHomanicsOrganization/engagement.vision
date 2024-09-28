import React from "react";

type Props = {
  day: number;
  score: number;
};

export const DayCard = ({ day, score }: Props) => {
  return (
    <div className="bg-base-100 rounded-lg shadow-lg w-[85px] h-[85px] md:w-[175px] md:h-[175px]">
      <p className="text-xl m-0 p-1">{day}</p>
      <p
        className={`text-3xl md:text-6xl text-center m-0 pt-3 md:pt-20 ${
          score === 0 ? "text-[#4069BF]" : "text-primary"
        }`}
      >
        {score}
      </p>
    </div>
  );
};

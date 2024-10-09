import React from "react";

type Props = {
  day: number;
  score: number;
};

export const DayCard = ({ day, score }: Props) => {
  return (
    <div className="bg-secondary rounded-lg shadow-lg w-[85px] h-[85px] md:w-[100px] md:h-[100px]">
      <p className="text-xl m-0 p-1">{day}</p>
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

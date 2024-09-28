"use client";

import { useEffect, useState } from "react";
import { DayCard } from "~~/components/how-based-are-you/DayCard";
import { useTransactions } from "~~/hooks/how-based-are-you/useTransactions";

// function getRandomInt(min: number, max: number): number {
//   min = Math.ceil(min); // Ensure the minimum is rounded up
//   max = Math.floor(max); // Ensure the maximum is rounded down
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

const monthsAsStrings = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function UserPage({ params }: { params: { chain: string; address: string } }) {
  const numOfDays = 31;

  const [selectedMonth, setSelectedMonth] = useState(9);
  const [selectedYear, setSelectedYear] = useState(2024);

  const transactions = useTransactions({ address: params.address });

  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);

  const [allTimeScore, setAllTimeScore] = useState(0);

  useEffect(() => {
    let count = 0;

    for (let i = 0; i < transactions.length; i++) {
      count += 5;
    }

    setAllTimeScore(count);
  }, [transactions, transactions?.length]);

  const [yearlyScore, setYearlyScore] = useState(0);

  useEffect(() => {
    const filteredTransactions = transactions.filter((tx: any) => {
      const txDate = new Date(tx.timeStamp * 1000);
      return txDate.getFullYear() === selectedYear;
    }) as any;

    let count = 0;

    for (let i = 0; i < filteredTransactions.length; i++) {
      count += 5;
    }

    setYearlyScore(count);
  }, [transactions, transactions?.length, selectedYear]);

  const [totalMonthlyScore, setTotalMonthlyScore] = useState(0);

  useEffect(() => {
    const filteredTransactions = transactions.filter((tx: any) => {
      const txDate = new Date(tx.timeStamp * 1000);
      return txDate.getFullYear() === selectedYear && txDate.getMonth() + 1 === selectedMonth;
    }) as any;

    let count = 0;

    for (let i = 0; i < filteredTransactions.length; i++) {
      count += 5;
    }

    setTotalMonthlyScore(count);
  }, [transactions, transactions?.length, selectedMonth, selectedYear]);

  useEffect(() => {
    const randomNumbers = [];

    for (let i = 0; i < numOfDays; i++) {
      const theDayTransactions = transactions.filter((tx: any) => {
        const txDate = new Date(tx.timeStamp * 1000);
        return (
          txDate.getFullYear() === selectedYear && txDate.getMonth() + 1 === selectedMonth && txDate.getDate() === i + 1
        );
      }) as any;

      let count = 0;

      for (let i = 0; i < theDayTransactions.length; i++) {
        count += 5;
      }

      randomNumbers.push(count);
    }

    setRandomNumbers([...randomNumbers]);
  }, [numOfDays, transactions, transactions?.length, selectedMonth, selectedYear]);

  const monthsComponents = randomNumbers.map((value, index) => {
    return (
      <div className="m-0.5 md:m-1" key={index}>
        <DayCard day={index + 1} score={value} />
      </div>
    );
  });

  return (
    <>
      {/* <TransactionList address={params.address} year={selectedYear} month={selectedMonth} /> */}
      <div className="flex items-center flex-col flex-grow">
        <div className="flex flex-wrap justify-center m-4 space-x-1">
          <div className="flex flex-col bg-base-300 w-[200px] rounded-lg items-center justify-center">
            <p className="text-xl m-0">Monthly Score</p>
            <p className="text-6xl m-0">{totalMonthlyScore}</p>
          </div>

          <div className="flex flex-col bg-base-300 w-[200px] rounded-lg items-center justify-center">
            <p className="text-xl m-0">Yearly Score</p>
            <p className="text-6xl m-0">{yearlyScore}</p>
          </div>

          <div className="flex flex-col bg-base-300 w-[200px] rounded-lg items-center justify-center">
            <p className="text-xl m-0">All Time Score</p>
            <p className="text-6xl m-0">{allTimeScore}</p>
          </div>
        </div>

        <div className="bg-secondary rounded-lg">
          <div className="bg-base-100 p-4">
            <div className="flex flex-wrap justify-center items-center space-x-1">
              <button
                onClick={() => {
                  if (selectedMonth === 1) {
                    setSelectedMonth(12);
                    setSelectedYear(selectedYear - 1);
                    return;
                  }

                  setSelectedMonth(selectedMonth - 1);
                }}
                className="btn btn-primary"
              >
                {"<"}
              </button>
              <div className="w-80 flex flex-col items-center justify-center">
                <p className="text-center text-3xl md:text-6xl m-0">{monthsAsStrings[selectedMonth - 1]}</p>
                <p className="text-center text-3xl md:text-6xl m-0">{selectedYear}</p>
              </div>

              <button
                onClick={() => {
                  if (selectedMonth === 12) {
                    setSelectedMonth(1);
                    setSelectedYear(selectedYear + 1);

                    return;
                  }

                  setSelectedMonth(selectedMonth + 1);
                }}
                className="btn btn-primary"
              >
                {">"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center">{monthsComponents}</div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { isAddress } from "viem";
import {
  Basename,
  BasenameTextRecordKeys,
  getBasename,
  getBasenameAddr, //etBasename,
  getBasenameAvatar,
  getBasenameTextRecord,
} from "~~/abis/basenames";
import { DayCard } from "~~/components/how-based-are-you/DayCard";
import { PfpCard } from "~~/components/how-based-are-you/PfpCard";
import { Score } from "~~/components/how-based-are-you/Score";
import { useTransactions } from "~~/hooks/how-based-are-you/useTransactions";
import { useGlobalState } from "~~/services/store/store";
import { getChainByName } from "~~/utils/how-based-are-you/viemHelpers";

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
  const setAppTheme = useGlobalState(({ setAppTheme }) => setAppTheme);

  useEffect(() => {
    setAppTheme(params.chain);
  }, [params.chain, setAppTheme]);

  const [profile, setProfile] = useState<any>();

  console.log(profile);

  useEffect(() => {
    async function fetchData() {
      let basename: Basename | undefined;

      if (isAddress(params.address)) {
        basename = await getBasename(params.address as `0x${string}`);
        if (basename === undefined) throw Error("failed to resolve address to name");
      } else {
        basename = params.address;
      }

      try {
        const addr = await getBasenameAddr(basename);
        const avatar = await getBasenameAvatar(basename);

        const description = await getBasenameTextRecord(basename, BasenameTextRecordKeys.Description);

        const twitter = await getBasenameTextRecord(basename, BasenameTextRecordKeys.Twitter);

        setProfile({
          addr,
          basename,
          avatar,
          description,
          twitter,
        });
      } catch (e) {
        console.log("Error!");
      }
    }

    fetchData();
  }, [params.address]);

  const numOfDays = 31;

  const [selectedMonth, setSelectedMonth] = useState(9);
  const [selectedYear, setSelectedYear] = useState(2024);

  const chain = getChainByName(params.chain);

  const transactions = useTransactions({ chainId: chain.id, address: profile?.addr });

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
        <div className="m-4">
          <PfpCard name={profile?.name} image={profile?.avatar} size="sm" />
        </div>

        <div className="bg-secondary rounded-lg">
          <div className="p-1 md:p-4">
            <div className="flex flex-wrap justify-center m-0.5 md:m-4 space-x-1">
              <Score title="Monthly Score" score={totalMonthlyScore} />
              <Score title="Yearly Score" score={yearlyScore} />
              <Score title="All Time Score" score={allTimeScore} />
            </div>
            <div className="flex flex-wrap justify-center items-center space-x-1 m-4 bg-secondary rounded-xl">
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
              <div className="w-64 md:w-[600px] flex flex-col items-center justify-center">
                <p className="text-center text-3xl md:text-6xl m-0">
                  {monthsAsStrings[selectedMonth - 1]} {selectedYear}
                </p>
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

            <div className="flex flex-wrap justify-center bg-base-100 rounded-lg mx-1 md:mx-[450px]">
              {monthsComponents}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

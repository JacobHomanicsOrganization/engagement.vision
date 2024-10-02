"use client";

import { useEffect, useState } from "react";
import { Chain, isAddress } from "viem";
import { base, mainnet } from "viem/chains";
import {
  Basename,
  BasenameTextRecordKeys,
  getBasename,
  getBasenameAddr, //etBasename,
  getBasenameAvatar,
  getBasenameTextRecord,
  isBasename,
} from "~~/abis/basenames";
import { getEnsAddress, getEnsAvatar, getEnsDescription, getEnsName, isEnsName } from "~~/abis/ens";
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

  const chain = getChainByName(params.chain);

  const [profile, setProfile] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      // let profileAddress;
      // let profileName;
      // let profileAvatar;
      // let profileDescription;
      // let profileTwitter;

      async function getFullEnsProfile(ensName: string) {
        const resolvedAddress = await getEnsAddress(ensName);
        const resolvedAvatar = await getEnsAvatar(ensName);
        const resolvedDescription = await getEnsDescription(ensName);
        // const resolvedTwitter = await getBasenameTextRecord(basename, BasenameTextRecordKeys.Twitter);
        return {
          addr: resolvedAddress,
          name: ensName,
          avatar: resolvedAvatar,
          description: resolvedDescription,
          // twitter: resolvedTwitter,
        };
      }

      async function getFullBaseProfile(basename: Basename) {
        const resolvedAddress = await getBasenameAddr(basename);
        const resolvedAvatar = await getBasenameAvatar(basename);
        const resolvedDescription = await getBasenameTextRecord(basename, BasenameTextRecordKeys.Description);
        // const resolvedTwitter = await getBasenameTextRecord(basename, BasenameTextRecordKeys.Twitter);
        return {
          addr: resolvedAddress,
          name: basename,
          avatar: resolvedAvatar,
          description: resolvedDescription,
          // twitter: resolvedTwitter,
        };
      }

      async function ResolveWithBase() {
        let profile = { addr: params.address } as any;
        let isError;
        let resolved;

        if (isAddress(params.address)) {
          const basename = await getBasename(params.address as `0x${string}`);

          if (isBasename(basename)) {
            profile = await getFullBaseProfile(basename as Basename);
            resolved = true;
          }
        } else if (isBasename(params.address)) {
          profile = await getFullBaseProfile(params.address as Basename);
          resolved = true;
        } else if (isEnsName(params.address)) {
          const resolvedEnsAddress = await getEnsAddress(params.address);

          const basename = await getBasename(resolvedEnsAddress as `0x${string}`);

          if (isBasename(basename)) {
            profile = await getFullBaseProfile(basename as Basename);
            resolved = true;
          } else {
            profile = { addr: resolvedEnsAddress };
          }
        }

        return { profile, isError, resolved };
      }

      async function ResolveWithEns(chain: Chain = mainnet) {
        let profile = { addr: params.address } as any;
        let isError;
        let resolved;

        if (isAddress(params.address)) {
          let ensName;
          try {
            ensName = await getEnsName(params.address as `0x${string}`, chain);
          } catch (e) {
            isError = true;
          }

          if (isEnsName(ensName as string)) {
            profile = await getFullEnsProfile(ensName as Basename);
            resolved = true;
          }
        } else if (isEnsName(params.address)) {
          profile = await getFullEnsProfile(params.address as Basename);
          resolved = true;
        } else if (isBasename(params.address)) {
          const resolvedBasenameAddress = await getBasenameAddr(params.address);

          const ensName = await getEnsName(resolvedBasenameAddress as `0x${string}`);

          if (isEnsName(ensName as string)) {
            profile = await getFullEnsProfile(ensName as Basename);
            resolved = true;
          } else {
            profile = { addr: resolvedBasenameAddress };
          }
        }

        return { profile, isError, resolved };
      }

      const resolutionLoop = [];
      if (chain.id === base.id) {
        resolutionLoop.push(async () => {
          const result = await ResolveWithBase();
          return result;
        });
        resolutionLoop.push(async () => {
          const result = await ResolveWithEns(chain);
          return result;
        });
        resolutionLoop.push(async () => {
          const result = await ResolveWithEns(mainnet);
          return result;
        });

        // resolutionLoop.push("ensResolutionLocalChain");
        // resolutionLoop.push("ensResolutionMainnet");
        // resolutionLoop.push("address");
      } else {
        resolutionLoop.push(async () => {
          const result = await ResolveWithEns(chain);
          return result;
        });
        resolutionLoop.push(async () => {
          const result = await ResolveWithEns();
          return result;
        });
        resolutionLoop.push(async () => {
          const result = await ResolveWithBase();
          return result;
        });
        // resolutionLoop.push("ensResolutionLocalChain");
        // resolutionLoop.push("ensResolutionMainnet");
        // resolutionLoop.push("basenamesResolution");
        // resolutionLoop.push("address");
      }

      for (let i = 0; i < resolutionLoop.length; i++) {
        const result = await resolutionLoop[i]();

        //did it error?
        if (!result?.isError) {
          setProfile(result?.profile);
          if (result?.resolved) {
            break;
          }
        }
      }

      // if (chain.id === base.id) {
      //   await ResolveWithBasePreference();
      // } else {
      //   // regular resolution algorithm
      // }

      // let usedAddress;
      // let usedBasename: Basename | undefined;
      // if (isAddress(params.chain)) {
      //   usedBasename = await getBasename(params.address as `0x${string}`);

      //   usedAddress = params.chain;
      // } else {
      // }

      // if (isBasename(usedBasename as string)) {
      // }

      // let resolvedName;

      // if (isAddress(params.address)) {
      //   resolvedName = await getBasename(params.address as `0x${string}`);

      //   if (!resolvedName) {
      //     resolvedName = await getEnsName(params.address);
      //   }

      //   profileAddress = params.address;
      // } else {
      //   if (isBasename(params.address) || isEnsName(params.address)) {
      //     resolvedName = params.address;
      //   }
      // }

      // if (resolvedName) {
      //   if (isBasename(resolvedName)) {
      //     const convertedResolvedName = resolvedName as Basename;
      //     const resolvedAddress = await getBasenameAddr(convertedResolvedName);
      //     const avatar = await getBasenameAvatar(convertedResolvedName);
      //     const description = await getBasenameTextRecord(convertedResolvedName, BasenameTextRecordKeys.Description);
      //     const twitter = await getBasenameTextRecord(convertedResolvedName, BasenameTextRecordKeys.Twitter);

      //     profileAddress = resolvedAddress;
      //     profileAvatar = avatar;
      //     profileDescription = description;
      //     profileTwitter = twitter;
      //   } else if (isEnsName(resolvedName)) {
      //     const resolvedAddress = await getEnsAddress(resolvedName);

      //     profileAddress = resolvedAddress;
      //   }

      //   profileName = resolvedName;
      // }

      // setProfile({
      //   addr: profileAddress,
      //   name: profileName,
      //   avatar: profileAvatar,
      //   description: profileDescription,
      //   twitter: profileTwitter,
      // });
    }

    fetchData();
  }, [chain, chain?.id, params.address]);

  // console.log(profile);

  const numOfDays = 31;

  const [selectedMonth, setSelectedMonth] = useState(9);
  const [selectedYear, setSelectedYear] = useState(2024);

  const { transactions, isError } = useTransactions({ chainId: chain.id, address: profile?.addr });

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

  let transactionOutput;
  if (isError) {
    transactionOutput = (
      <div>
        {"There was an error loading this user's transactions. You may be trying to access an unsupported network."}
      </div>
    );
  } else {
    transactionOutput = (
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
    );
  }

  return (
    <>
      {/* <TransactionList address={params.address} year={selectedYear} month={selectedMonth} /> */}
      <div className="flex items-center flex-col flex-grow">
        <div className="m-4">
          <PfpCard
            name={profile?.name ?? profile?.addr}
            image={profile?.avatar}
            description={profile?.description}
            size="sm"
          />
        </div>
        {transactionOutput}
      </div>
    </>
  );
}

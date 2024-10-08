"use client";

import { useEffect, useState } from "react";
import axios from "axios";
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
import { getEnsText } from "~~/abis/ens";
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

const getPassport = async (username: string) => {
  console.log("Trying with..." + username);
  try {
    const response = await axios.get(`/api/talent-protocol/passport/${username}`);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const getPassportCredentials = async (username: string) => {
  console.log("Trying with..." + username);
  try {
    const response = await axios.get(`/api/talent-protocol/credentials/${username}`);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// const getUserWarpcastFid = async (username: string) => {
//   // console.log(username);
//   try {
//     // const response = await axios.get(`/api/twitter/${username}`);
//     // const response = await axios.get("https://hub.pinata.cloud/v1/castsByFid?fid=6023&pageSize=10&reverse=true");
//     const response = await axios.get(`https://fnames.farcaster.xyz/transfers/current?name=${username}`);
//     console.log(response.data);
//     return response.data.transfer.id;
//   } catch (err) {
//     console.log(err);
//   }
// };

// const getUserCastsByFid = async (fid: number) => {
//   try {
//     // const response = await axios.get(`/api/twitter/${username}`);
//     const response = await axios.get(`https://hub.pinata.cloud/v1/castsByFid?fid=${fid}&pageSize=100&reverse=true`);
//     console.log(response.data);
//     return response.data;
//   } catch (err) {
//     console.log(err);
//   }
// };

// const getUserByUsername = async (username: string) => {
//   try {
//     const response = await axios.get(`/api/twitter/${username}`);
//     console.log(response.data);
//     return response.data;
//   } catch (err) {
//     console.log(err);
//   }
// };

// const getUserTweets = async (username: string) => {
//   console.log(username);
//   // try {
//   //   const response = await axios.get(`/api/twitter2/${username}`);
//   //   console.log(response.data);
//   //   return response.data;
//   // } catch (err) {
//   //   console.log(err);
//   // }
// };

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

type Profile = {
  addr?: string;
  name?: string;
  avatar?: string;
  description?: string;
  twitter?: string;
  farcaster?: string;
};

export default function UserPage({ params }: { params: { chain: string; address: string } }) {
  //after cleanup, fix bug by making params.address lowercase if its not an address

  const setAppTheme = useGlobalState(({ setAppTheme }) => setAppTheme);

  useEffect(() => {
    setAppTheme(params.chain);
  }, [params.chain, setAppTheme]);

  const { chain } = getChainByName(params.chain);
  const [profile, setProfile] = useState<any>();

  const [userError, setUserError] = useState<string>();

  useEffect(() => {
    if (chain === undefined) {
      setUserError("Invalid chain. Please check for typos!");
    } else if (!isAddress(profile?.addr)) {
      setUserError("This account cannot be found anywhere. Please check for typos!");
    } else {
      setUserError(undefined);
    }
  }, [chain, chain?.id, profile, profile?.addr]);

  const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (chain === undefined) return;
      // let profileAddress;
      // let profileName;
      // let profileAvatar;
      // let profileDescription;
      // let profileTwitter;

      setIsLoadingUserProfile(true);
      async function getFullEnsProfile(ensName: string) {
        const resolvedAddress = await getEnsAddress(ensName);
        const resolvedAvatar = await getEnsAvatar(ensName);
        const resolvedDescription = await getEnsDescription(ensName);
        const resolvedTwitter = await getEnsText(ensName, "com.twitter");
        return {
          addr: resolvedAddress,
          name: ensName,
          avatar: resolvedAvatar,
          description: resolvedDescription,
          twitter: resolvedTwitter,
        } as Profile;
      }

      async function getFullBaseProfile(basename: Basename) {
        const resolvedAddress = await getBasenameAddr(basename);
        const resolvedAvatar = await getBasenameAvatar(basename);
        const resolvedDescription = await getBasenameTextRecord(basename, BasenameTextRecordKeys.Description);
        const resolvedTwitter = await getBasenameTextRecord(basename, BasenameTextRecordKeys.Twitter);
        const resolvedFarcaster = await getBasenameTextRecord(basename, BasenameTextRecordKeys.Farcaster);

        return {
          addr: resolvedAddress,
          name: basename,
          avatar: resolvedAvatar,
          description: resolvedDescription,
          twitter: resolvedTwitter,
          farcaster: resolvedFarcaster,
        } as Profile;
      }

      async function ResolveWithBase() {
        let profile;
        const isError = false;
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

          if (resolvedEnsAddress) {
            const basename = await getBasename(resolvedEnsAddress as `0x${string}`);

            if (isBasename(basename)) {
              profile = await getFullBaseProfile(basename as Basename);
              resolved = true;
            }
          }
        }

        return { profile, isError, resolved };
      }

      async function ResolveWithEns(chain: Chain = mainnet) {
        let profile;
        let isError = false;
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
          profile = await getFullEnsProfile(params.address as string);
          resolved = true;
        } else if (isBasename(params.address)) {
          const resolvedBasenameAddress = await getBasenameAddr(params.address);

          if (resolvedBasenameAddress) {
            const ensName = await getEnsName(resolvedBasenameAddress as `0x${string}`);

            if (isEnsName(ensName as string)) {
              profile = await getFullEnsProfile(ensName as string);
              resolved = true;
            }
          }
        }

        return { profile, isError, resolved };
      }

      const resolutionLoop = [async () => await ResolveWithEns(chain), async () => await ResolveWithEns()];

      if (chain.id === base.id) {
        resolutionLoop.unshift(ResolveWithBase);
      } else {
        resolutionLoop.push(ResolveWithBase);
      }

      let chosenProfile: Profile = { addr: params.address };

      for (let i = 0; i < resolutionLoop.length; i++) {
        const { profile } = await resolutionLoop[i]();

        if (profile) {
          chosenProfile = profile;
          break;
        }
      }

      setProfile(chosenProfile);
      if (chosenProfile.twitter) {
        // const user = await getUserByUsername(chosenProfile.twitter);
        // console.log(user);
        // const tweets = await getUserTweets(chosenProfile.twitter);
        // console.log(tweets);
      }

      if (chosenProfile.farcaster) {
        // const fid = await getUserWarpcastFid(chosenProfile.farcaster);
        // console.log(fid);
        // if (fid) {
        //   const results = await getUserCastsByFid(fid);
        //   console.log(results);
        // }
      }

      console.log("getting passport");
      const result = await getPassport(chosenProfile.addr || "");
      console.log(result);
      console.log("got passport");

      const result2 = await getPassportCredentials(chosenProfile.addr || "");
      console.log(result2);
      setIsLoadingUserProfile(false);
    }

    fetchData();
  }, [chain, chain?.id, params.address]);

  // console.log(profile);

  const numOfDays = 31;

  const [selectedMonth, setSelectedMonth] = useState(9);
  const [selectedYear, setSelectedYear] = useState(2024);

  const { transactions, isError, errorMessage } = useTransactions({ chainId: chain?.id, address: profile?.addr });

  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);

  const [allTimeScore, setAllTimeScore] = useState(0);

  useEffect(() => {
    let count = 0;

    for (let i = 0; i < transactions.length; i++) {
      count += 1;
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
      count += 1;
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
      count += 1;
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
        count += 1;
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

  const [isLoadingWebsite, setIsLoadingWebsite] = useState(false);
  useEffect(() => {
    setIsLoadingWebsite(isLoadingUserProfile);
  }, [isLoadingUserProfile]);

  if (isLoadingWebsite) return <>Loading...</>;
  if (userError) return <>{userError}</>;

  let transactionOutput;
  if (isError) {
    transactionOutput = <div>{errorMessage}</div>;
  } else {
    transactionOutput = (
      <div className="bg-secondary rounded-lg">
        <div className="p-1 md:p-4">
          <div className="flex flex-wrap justify-center m-0.5 md:m-4 space-x-1">
            <Score title="Monthly Score" score={totalMonthlyScore} />
            <Score title="Yearly Score" score={yearlyScore} />
            <Score title="All Time Score" score={allTimeScore} />
          </div>

          <div className="flex flex-col bg-base-100">
            <div className="flex flex-wrap justify-center items-center space-x-1 m-4 rounded-xl">
              <button
                onClick={() => {
                  if (selectedMonth === 1) {
                    setSelectedMonth(12);
                    setSelectedYear(selectedYear - 1);
                    return;
                  }

                  setSelectedMonth(selectedMonth - 1);
                }}
                className="btn btn-primary btn-sm md:btn-md"
              >
                {"<"}
              </button>
              <div className="w-56 md:w-[600px] flex flex-col items-center justify-center">
                <p className="text-center text-2xl md:text-6xl m-0">
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
                className="btn btn-primary btn-sm md:btn-md"
              >
                {">"}
              </button>
            </div>
            <div className="flex flex-wrap justify-center rounded-lg mx-1 md:mx-[450px]">{monthsComponents}</div>
          </div>
        </div>
      </div>
    );
  }

  console.log(profile);
  return (
    <>
      {/* <TransactionList address={params.address} year={selectedYear} month={selectedMonth} /> */}
      <div className="flex items-center flex-col flex-grow">
        <div className="m-4">
          <PfpCard
            name={profile?.name ?? profile?.addr}
            image={profile?.avatar}
            description={profile?.description}
            chain={chain}
            address={profile?.addr}
            size="sm"
          />
        </div>
        {transactionOutput}
      </div>
    </>
  );
}

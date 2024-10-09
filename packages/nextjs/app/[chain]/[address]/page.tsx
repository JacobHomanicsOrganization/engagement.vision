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

// const BASE_FID = 12142;
// const COINBASE_WALLET_FID = 309857;
const FARCASTER_START_EPOCH = 1609459200;

const chainsObjs = {
  Base: {
    mentionFids: [
      12142, //Base,
      309857, //Coinbase Wallet
    ],
  },
};

// function getRandomInt(min: number, max: number): number {
//   min = Math.ceil(min); // Ensure the minimum is rounded up
//   max = Math.floor(max); // Ensure the maximum is rounded down
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

const getPassport = async (username: string) => {
  try {
    const response = await axios.get(`/api/talent-protocol/passport/${username}`);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const getPassportCredentials = async (username: string) => {
  try {
    const response = await axios.get(`/api/talent-protocol/credentials/${username}`);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const getUserWarpcastFid = async (username: string) => {
  const response = await axios.get(`https://fnames.farcaster.xyz/transfers/current?name=${username}`);
  return response.data.transfer.id;

  // try {
  //   const response = await axios.get(`/api/farcaster/getUserByFid/${username}`);
  //   return response.data;
  // } catch (err) {
  //   console.log(err);
  // }

  // // console.log(username);
  // try {
  //   // const response = await axios.get(`/api/twitter/${username}`);
  //   // const response = await axios.get("https://hub.pinata.cloud/v1/castsByFid?fid=6023&pageSize=10&reverse=true");

  //   //https://fnames.farcaster.xyz/transfers/current?name=${username}
  //   //https://api.farcaster.xyz/v2/user-by-fname?fname=${username}
  //   const response = await axios.get(`https://fnames.farcaster.xyz/transfers/current?name=${username}`);
  //   return response.data.transfer.id;
  // } catch (err) {
  //   console.log(err);
  // }
};

const getUserCastsByFid = async (fid: number) => {
  const response = await axios.get(`https://hub.pinata.cloud/v1/castsByFid?fid=${fid}&reverse=true`);
  return response.data;
  // try {
  //   const response = await axios.get(`/api/farcaster/getUserCastsByFid/${fid}`);
  //   return response.data;
  // } catch (err) {
  //   console.log(err);
  // }

  // try {
  //   // const response = await axios.get(`/api/twitter/${username}`);

  //   //for setting a max limit: https://hub.pinata.cloud/v1/castsByFid?fid=${fid}&pageSize=100&reverse=true
  //   const response = await axios.get(`https://hub.pinata.cloud/v1/castsByFid?fid=${fid}&reverse=true`);
  //   return response.data;
  // } catch (err) {
  //   console.log(err);
  // }
};

const getUserCastsByFidNextPageToken = async (fid: number, nextPageToken: string) => {
  const response = await axios.get(
    `https://hub.pinata.cloud/v1/castsByFid?fid=${fid}&reverse=true&pageToken=${nextPageToken}`,
  );
  return response.data;
};

// try {
//   // const response = await axios.get(`/api/twitter/${username}`);

//   // console.log(
//   //   "Trying " + `https://hub.pinata.cloud/v1/castsByFid?fid=${fid}&reverse=true&nextPageToken=${nextPageToken}`,
//   // );
//   //for setting a max limit: https://hub.pinata.cloud/v1/castsByFid?fid=${fid}&pageSize=100&reverse=true
//   const response = await axios.get(
//     `https://hub.pinata.cloud/v1/castsByFid?fid=${fid}&reverse=true&nextPageToken=${nextPageToken}`,
//   );
//   // console.log("Returned");

//   return response.data;
// } catch (err) {
//   // console.log("errored");

//   console.log(err);
// }
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
        const resolvedFarcaster = await getEnsText(ensName, "fnameOrFid");

        return {
          addr: resolvedAddress,
          name: ensName,
          avatar: resolvedAvatar,
          description: resolvedDescription,
          twitter: resolvedTwitter,
          farcaster: resolvedFarcaster,
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

      function isNumeric(str: string): boolean {
        return /^\d+$/.test(str);
      }

      if (chosenProfile.farcaster) {
        let fid;
        if (isNumeric(chosenProfile.farcaster)) {
          fid = chosenProfile.farcaster;
        } else {
          if (!isEnsName(chosenProfile.farcaster)) {
            fid = await getUserWarpcastFid(chosenProfile.farcaster);
            console.log(fid);
          } else {
            //is ENS name and supported.
            throw "Error with ENS support";
          }
        }

        // if (isEnsName(chosenProfile.farcaster)) {
        //   fid = await getUserWarpcastFid("jacobhomanics");
        // } else {
        //   fid = await getUserWarpcastFid(chosenProfile.farcaster);
        // }

        // console.log(fid);

        // const JESSE_POLLACK_FID = 99;
        // const JACOB_HOMANICS_FID = 240799;
        // const fid = JESSE_POLLACK_FID;
        // console.log(fid);

        if (fid) {
          let totalResults: any = [];

          let results;

          results = await getUserCastsByFid(fid);
          totalResults = totalResults.concat(results.messages);

          while (results.nextPageToken !== "") {
            results = await getUserCastsByFidNextPageToken(fid, results.nextPageToken);
            totalResults = totalResults.concat(results.messages);
          }

          console.log(totalResults);

          const msgs = totalResults.filter((x: any) => {
            return x;
          });

          setMessages(msgs);
        }
      }

      const result = await getPassport(chosenProfile.addr || "");

      const result2 = await getPassportCredentials(result.passport["passport_id"]);
      setCredentials(result2["passport_credentials"]);
      setIsLoadingUserProfile(false);
    }

    fetchData();
  }, [chain, chain?.id, params.address]);

  const [messages, setMessages] = useState([]);
  // console.log(messages);

  const [credentials, setCredentials] = useState([]);

  const numOfDays = 31;

  const [selectedMonth, setSelectedMonth] = useState(9);
  const [selectedYear, setSelectedYear] = useState(2024);

  const { transactions, isError, errorMessage } = useTransactions({ chainId: chain?.id, address: profile?.addr });

  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);

  const [allTimeScore, setAllTimeScore] = useState(0);

  useEffect(() => {
    const filteredCasts = messages?.filter((tx: any) => {
      let isPresent = false;

      for (let i = 0; i < tx.data.castAddBody?.mentions.length; i++) {
        for (let j = 0; j < chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids.length; j++) {
          if (tx.data.castAddBody.mentions[i] === chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids[j]) {
            isPresent = true;
          }
        }
      }
      // console.log(txDate);
      return isPresent;
    }) as any;

    let count = 0;

    for (let i = 0; i < transactions.length; i++) {
      count += 1;
    }

    for (let i = 0; i < filteredCasts.length; i++) {
      count += 400;
    }

    setAllTimeScore(count);
  }, [transactions, transactions?.length, messages?.length]);

  const [yearlyScore, setYearlyScore] = useState(0);

  useEffect(() => {
    const filteredCasts = messages?.filter((tx: any) => {
      const txDate = new Date((FARCASTER_START_EPOCH + tx.data.timestamp) * 1000);

      let isPresent = false;

      for (let i = 0; i < tx.data.castAddBody?.mentions.length; i++) {
        for (let j = 0; j < chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids.length; j++) {
          if (tx.data.castAddBody.mentions[i] === chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids[j]) {
            isPresent = true;
          }
        }
      }
      // console.log(txDate);
      return isPresent && txDate.getFullYear() === selectedYear;
    }) as any;

    // const filteredCredentials = credentials.filter((tx: any) => {
    //   const date = new Date(tx["onchain_at"]);

    //   return date.getFullYear() === selectedYear;
    // });

    const filteredTransactions = transactions.filter((tx: any) => {
      const txDate = new Date(tx.timeStamp * 1000);
      return txDate.getFullYear() === selectedYear;
    }) as any;

    let count = 0;

    for (let i = 0; i < filteredTransactions.length; i++) {
      count += 1;
    }

    // for (let i = 0; i < filteredCredentials.length; i++) {
    //   count += 200;
    // }

    for (let i = 0; i < filteredCasts.length; i++) {
      count += 400;
    }

    setYearlyScore(count);
  }, [transactions, transactions?.length, selectedYear, credentials?.length]);

  const [totalMonthlyScore, setTotalMonthlyScore] = useState(0);

  useEffect(() => {
    const filteredCasts = messages?.filter((tx: any) => {
      const txDate = new Date((FARCASTER_START_EPOCH + tx.data.timestamp) * 1000);

      let isPresent = false;

      for (let i = 0; i < tx.data.castAddBody?.mentions.length; i++) {
        for (let j = 0; j < chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids.length; j++) {
          if (tx.data.castAddBody.mentions[i] === chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids[j]) {
            isPresent = true;
          }
        }
      }
      // console.log(txDate);
      return isPresent && txDate.getFullYear() === selectedYear && txDate.getMonth() + 1 === selectedMonth;
    }) as any;

    // const filteredCredentials = credentials.filter((tx: any) => {
    //   const date = new Date(tx["onchain_at"]);

    //   return date.getFullYear() === selectedYear && date.getMonth() + 1 === selectedMonth;
    // });

    const filteredTransactions = transactions.filter((tx: any) => {
      const txDate = new Date(tx.timeStamp * 1000);
      return txDate.getFullYear() === selectedYear && txDate.getMonth() + 1 === selectedMonth;
    }) as any;

    let count = 0;

    for (let i = 0; i < filteredTransactions.length; i++) {
      count += 1;
    }

    // for (let i = 0; i < filteredCredentials.length; i++) {
    //   count += 200;
    // }

    for (let i = 0; i < filteredCasts.length; i++) {
      count += 400;
    }

    // 1728448744;
    // 1693336885;
    // 103160891;
    setTotalMonthlyScore(count);
  }, [transactions, transactions?.length, selectedMonth, selectedYear, credentials?.length]);

  // const baseChainObj = {
  //   mentionFids: [BASE_FID, COINBASE_WALLET_FID],
  // };

  useEffect(() => {
    const randomNumbers = [];

    for (let i = 0; i < numOfDays; i++) {
      const theDayCasts = messages?.filter((tx: any) => {
        const txDate = new Date((FARCASTER_START_EPOCH + tx.data.timestamp) * 1000);

        let isPresent = false;

        for (let i = 0; i < tx.data.castAddBody?.mentions.length; i++) {
          for (let j = 0; j < chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids.length; j++) {
            if (
              tx.data.castAddBody.mentions[i] === chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids[j]
            ) {
              isPresent = true;
            }
          }
        }
        // console.log(txDate);
        return (
          isPresent &&
          txDate.getFullYear() === selectedYear &&
          txDate.getMonth() + 1 === selectedMonth &&
          txDate.getDate() === i + 1
        );
      }) as any;

      // const theDayCredentials = credentials.filter((tx: any) => {
      //   const date = new Date(tx["onchain_at"]);

      //   return date.getFullYear() === selectedYear && date.getMonth() + 1 === selectedMonth && date.getDate() === i + 1;
      // });

      const theDayTransactions = transactions.filter((tx: any) => {
        const txDate = new Date(tx.timeStamp * 1000);
        return (
          txDate.getFullYear() === selectedYear && txDate.getMonth() + 1 === selectedMonth && txDate.getDate() === i + 1
        );
      }) as any;

      let count = 0;

      // console.log(messages);
      // console.log(theDayCasts);

      for (let i = 0; i < theDayCasts.length; i++) {
        count += 400;
      }

      // for (let i = 0; i < theDayCredentials.length; i++) {
      //   count += 200;
      // }

      for (let i = 0; i < theDayTransactions.length; i++) {
        count += 1;
      }

      randomNumbers.push(count);
    }

    setRandomNumbers([...randomNumbers]);
  }, [
    numOfDays,
    transactions,
    transactions?.length,
    selectedMonth,
    selectedYear,
    credentials?.length,
    messages?.length,
    chain?.id,
  ]);

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

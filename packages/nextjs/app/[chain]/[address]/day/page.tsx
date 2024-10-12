"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
// import { DayCard } from "~~/components/how-based-are-you/DayCard";
import { PfpCard } from "~~/components/how-based-are-you/PfpCard";
// import { Score } from "~~/components/how-based-are-you/Score";
import { useTransactions } from "~~/hooks/how-based-are-you/useTransactions";
import { useGlobalState } from "~~/services/store/store";
import {
  getDailyFarcasterMessage, // getAllTimeFarcasterMessagesTally,
  getDailyFarcasterMessagesTally, // getMonthlyFarcasterMessagesTally,
  // getYearlyFarcasterMessagesTally,
} from "~~/utils/how-based-are-you/filterFarcasterMessagesForTally";
import {
  // getAllTimeOnchainTransactionsTally,
  getDailyOnchainTransactions,
  getDailyOnchainTransactionsTally, // getMonthlyOnchainTransactionsTally,
  // getYearlyOnchainTransactionsTally,
} from "~~/utils/how-based-are-you/filterOnchainTransactionsForTally";
// import {
//   getAllTimeTalentProtocolBadgesTally, // getDailyTalentProtocolBadgesTally,
//   getMonthlyTalentProtocolBadgesTally,
//   getYearlyTalentProtocolBadgesTally,
// } from "~~/utils/how-based-are-you/filterTalentProtocolBadgesForTally";
import { getChainByName } from "~~/utils/how-based-are-you/viemHelpers";
import { getBlockExplorerTxLink } from "~~/utils/scaffold-eth";

// const BASE_FID = 12142;
// const COINBASE_WALLET_FID = 309857;
// const FARCASTER_START_EPOCH = 1609459200;

// const chainsObjs = {
//   Base: {
//     mentionFids: [
//       12142, //Base,
//       309857, //Coinbase Wallet
//     ],
//   },
// };

// function getRandomInt(min: number, max: number): number {
//   min = Math.ceil(min); // Ensure the minimum is rounded up
//   max = Math.floor(max); // Ensure the maximum is rounded down
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// const getPassport = async (username: string) => {
//   try {
//     const response = await axios.get(`/api/talent-protocol/passport/${username}`);
//     return response.data;
//   } catch (err) {
//     console.log(err);
//   }
// };

// const getPassportCredentials = async (username: string) => {
//   try {
//     const response = await axios.get(`/api/talent-protocol/credentials/${username}`);
//     return response.data;
//   } catch (err) {
//     console.log(err);
//   }
// };

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

export default function DayPage({ params }: { params: { chain: string; address: string; day: number } }) {
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

          // console.log(totalResults);

          const msgs = totalResults.filter((x: any) => {
            return x;
          });

          setFarcasterMessages(msgs);
        }
      }

      // const result = await getPassport(chosenProfile.addr || "");

      // const result2 = await getPassportCredentials(result.passport["passport_id"]);
      // setCredentials(result2["passport_credentials"]);

      // const validPassports = result2["passport_credentials"].filter((x: any) => {
      //   return x["onchain_at"] !== null;
      // });

      // console.log(validPassports);
      // for (let i = 0; i < result2["passport_credentials"].length; i++) {
      //   if (result2["passport_credentials"][i]["onchain_at"] !== null) {
      //     console.log(result2["passport_credentials"][i]);
      //   }
      // }

      // console.log(result2);

      setIsLoadingUserProfile(false);
    }

    fetchData();
  }, [chain, chain?.id, params.address]);

  const [farcasterMessages, setFarcasterMessages] = useState([]);

  // const [credentials, setCredentials] = useState([]);

  const numOfDays = 31;

  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(9);
  const [selectedYear, setSelectedYear] = useState(2024);

  const { transactions, isError, errorMessage } = useTransactions({ chainId: chain?.id, address: profile?.addr });

  const POINTS_PER_TRANSACTION = 100;
  const POINTS_PER_FARCASTER_MESSAGE = 25;
  // const POINTS_PER_CREDENTIAL = 10;

  // function getAllTimeTally(transactions: any) {
  //   let tally = 0;

  //   tally += getAllTimeOnchainTransactionsTally(transactions, POINTS_PER_TRANSACTION);
  //   tally += getAllTimeFarcasterMessagesTally(farcasterMessages, POINTS_PER_FARCASTER_MESSAGE, chain);
  //   // tally += getAllTimeTalentProtocolBadgesTally(credentials, POINTS_PER_CREDENTIAL);

  //   return tally;
  // }

  // function getYearlyTally(transactions: any, year: number) {
  //   let tally = 0;

  //   tally += getYearlyOnchainTransactionsTally(transactions, POINTS_PER_TRANSACTION, year);
  //   tally += getYearlyFarcasterMessagesTally(farcasterMessages, POINTS_PER_FARCASTER_MESSAGE, chain, year);
  //   // tally += getYearlyTalentProtocolBadgesTally(credentials, POINTS_PER_CREDENTIAL, year);
  //   return tally;
  // }

  // function getMonthlyTally(transactions: any, year: number, month: number) {
  //   let tally = 0;

  //   tally += getMonthlyOnchainTransactionsTally(transactions, POINTS_PER_TRANSACTION, year, month);
  //   tally += getMonthlyFarcasterMessagesTally(farcasterMessages, POINTS_PER_FARCASTER_MESSAGE, chain, year, month);
  //   // tally += getMonthlyTalentProtocolBadgesTally(credentials, POINTS_PER_CREDENTIAL, year, month);
  //   return tally;
  // }

  function getDailyTally(transactions: any, year: number, month: number, day: number) {
    const onchainTransactions = getDailyOnchainTransactions(transactions, year, month, day);
    const filteredFarcasterMessages = getDailyFarcasterMessage(farcasterMessages, year, month, day, chain);
    const onchainTransactionTally = getDailyOnchainTransactionsTally(
      transactions,
      POINTS_PER_TRANSACTION,
      year,
      month,
      day,
    );
    const farcasterMessagesTally = getDailyFarcasterMessagesTally(
      farcasterMessages,
      POINTS_PER_FARCASTER_MESSAGE,
      chain,
      year,
      month,
      day,
    );
    // tally += getDailyTalentProtocolBadgesTally(credentials, POINTS_PER_CREDENTIAL, year, month, day);
    return {
      transactions: onchainTransactions,
      filteredFarcasterMessages,
      totalTally: onchainTransactionTally + farcasterMessagesTally,
      onchainTransactionTally,
      farcasterMessagesTally,
    };
  }

  // const allTimeScore = getAllTimeTally(transactions);
  // const yearlyTally = getYearlyTally(transactions, selectedYear);
  // const totalMonthlyTally = getMonthlyTally(transactions, selectedYear, selectedMonth);

  const dailyTallies = [];
  for (let i = 0; i < numOfDays; i++) {
    const selectedDay = i + 1;
    const {
      transactions: filteredTransactions,
      filteredFarcasterMessages,
      totalTally,
      onchainTransactionTally,
      farcasterMessagesTally,
    } = getDailyTally(transactions, selectedYear, selectedMonth, selectedDay);

    dailyTallies.push({
      filteredTransactions,
      filteredFarcasterMessages,
      totalTally,
      onchainTransactionTally,
      farcasterMessagesTally,
    });
  }

  const farcasterMessagesComponents = dailyTallies[selectedDay - 1]?.filteredFarcasterMessages?.map((value, index) => {
    const chainsObjs = {
      Base: {
        12142: "base",
        309857: "coinbasewallet",
        12144: "wbnns",
        99: "jessepollack",
      },
    };

    const textArray = value.data.castAddBody.text.split("");

    for (let i = 0; i < value.data.castAddBody.mentions.length; i++) {
      const adjustedPosition = value.data.castAddBody.mentionsPositions[i] + i;

      const chainKey = chain?.name as keyof typeof chainsObjs;
      const valueToInsert =
        chainsObjs[chainKey][value.data.castAddBody.mentions[i] as keyof (typeof chainsObjs)[typeof chainKey]];

      textArray.splice(adjustedPosition, 0, "@" + valueToInsert.toString());
    }

    const reconstructedText = textArray.join("");

    console.log(reconstructedText);

    return (
      <Link key={"Farcaster Messages" + index} href={getBlockExplorerTxLink(chain.id, value.hash)} target="#">
        <div className="flex space-x-1 bg-base-100 rounded-lg p-2">
          <div>#{index}</div>
          <div>{reconstructedText}</div>
          {/* {value.functionName.length > 0 ? <div>{removeTextBetweenChars(value.functionName, "(", ")")}</div> : <></>} */}
        </div>
      </Link>
    );
  });

  const transactionsComponents = dailyTallies[selectedDay - 1]?.filteredTransactions?.map((value, index) => {
    function removeTextBetweenChars(input: string, startChar: string, endChar: string): string {
      // Create a regex pattern to match everything between the first occurrence of startChar and endChar, including the characters themselves
      const regex = new RegExp(`\\${startChar}[^\\${startChar}\\${endChar}]*?\\${endChar}`, "g");
      const result = input.replace(regex, "").trim(); // Remove matched content and trim any extra whitespace
      return result;
    }

    return (
      <Link key={"Transactions" + index} href={getBlockExplorerTxLink(chain.id, value.hash)} target="#">
        <div className="flex space-x-1 bg-base-100 rounded-lg p-2">
          <div>#{index}</div>
          {value.functionName.length > 0 ? <div>{removeTextBetweenChars(value.functionName, "(", ")")}</div> : <></>}
        </div>
      </Link>
    );
  });

  // const monthsComponents = dailyTallies.map((value, index) => {
  //   const sources = [];
  //   if (value.farcasterMessagesTally > 0) {
  //     sources.push(
  //       /* eslint-disable-next-line @next/next/no-img-element */
  //       <img
  //         alt="Logo"
  //         src={`/farcaster.webp`}
  //         className="h-[25px] rounded-lg"
  //         style={{ aspectRatio: "1 / 1" }}
  //         key={"source" + sources.length}
  //       />,
  //     );
  //   }
  //   if (value.onchainTransactionTally) {
  //     sources.push(
  //       /* eslint-disable-next-line @next/next/no-img-element */
  //       <img
  //         alt="Logo"
  //         src={`/etherscan.png`}
  //         className="h-[25px] rounded-lg"
  //         style={{ aspectRatio: "1 / 1" }}
  //         key={"source" + sources.length}
  //       />,
  //     );
  //   }

  //   return (
  //     <Link href={"/"} key={index}>
  //       <div className="m-0.5 md:m-1">
  //         <DayCard day={index + 1} score={value.totalTally} sources={sources} />
  //       </div>
  //     </Link>
  //   );
  // });

  const [isLoadingWebsite, setIsLoadingWebsite] = useState(false);
  useEffect(() => {
    setIsLoadingWebsite(isLoadingUserProfile);
  }, [isLoadingUserProfile]);

  if (isLoadingWebsite) return <>Loading...</>;
  if (userError) return <>{userError}</>;

  let transactionOutput;
  if (isError) {
    console.log("ERROR");
    console.log(errorMessage);

    transactionOutput = <div>{errorMessage}</div>;
  } else {
    transactionOutput = (
      <div>
        <div>Farcaster Messages</div>
        <div className="flex flex-col space-y-1">{farcasterMessagesComponents}</div>
        <div>Transactions</div>
        <div className="flex flex-col space-y-1">{transactionsComponents}</div>
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
        <p>This is the day page</p>
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
        </div>
        <div className="flex flex-col bg-base-100">
          <div className="flex flex-wrap justify-center items-center space-x-1 m-4 rounded-xl">
            <button
              onClick={() => {
                if (selectedDay === 1) {
                  setSelectedDay(31);
                  setSelectedMonth(selectedMonth - 1);
                  return;
                }

                setSelectedDay(selectedDay - 1);
              }}
              className="btn btn-primary btn-sm md:btn-md"
            >
              {"<"}
            </button>
            <div className="w-56 md:w-[600px] flex flex-col items-center justify-center">
              <p className="text-center text-2xl md:text-6xl m-0">
                {selectedDay}
                {/* {monthsAsStrings[selectedMonth - 1]} {selectedYear} */}
              </p>
            </div>

            <button
              onClick={() => {
                if (selectedDay === 31) {
                  setSelectedDay(1);
                  setSelectedMonth(selectedMonth + 1);

                  return;
                }

                setSelectedDay(selectedDay + 1);
              }}
              className="btn btn-primary btn-sm md:btn-md"
            >
              {">"}
            </button>
          </div>
        </div>

        {transactionOutput}
      </div>
    </>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Chain, getAddress, isAddress } from "viem";
import { base, mainnet } from "viem/chains";
import {
  Basename,
  BasenameTextRecordKeys,
  getBasename,
  getBasenameAddr,
  getBasenameAvatar,
  getBasenameTextRecord,
  isBasename,
} from "~~/abis/basenames";
import { getEnsAddress, getEnsAvatar, getEnsDescription, getEnsName, isEnsName } from "~~/abis/ens";
import { getEnsText } from "~~/abis/ens";
import { DayCard } from "~~/components/how-based-are-you/DayCard";
import { PfpCard } from "~~/components/how-based-are-you/PfpCard";
import { Score } from "~~/components/how-based-are-you/Score";
import { communitiesConfig } from "~~/engagement.config";
import { getBlockscoutExplorerTxLink, useTransactionsFromChains } from "~~/hooks/how-based-are-you/useTransactions";
import { useGlobalState } from "~~/services/store/store";
import { areAnyValuesInCriteria, isTextInCriteria, isValueInCriteria } from "~~/utils/engagement.vision/criteria";
import { isDateWithinDay, isDateWithinMonth, isDateWithinYear } from "~~/utils/engagement.vision/dates/dates";
import { getFarcasterDate } from "~~/utils/engagement.vision/dates/farcaster";
import { getFilteredArrayForEvery, getFilteredArrayForSome } from "~~/utils/engagement.vision/filtering";
import { getChainById, getChainByName } from "~~/utils/engagement.vision/viem";

// import {
//   areAnyValuesInCriteria,
//   getFarcasterDate,
//   getFilteredArray,
//   isDateWithinDay,
//   isDateWithinMonth,
//   isDateWithinYear,
//   isValueInCriteria,
// } from "~~/utils/how-based-are-you/filterFarcasterMessagesForTally";
// import { getBlockExplorerTxLink } from "~~/utils/scaffold-eth";

function customNotation(num: any) {
  if (num < 1000) {
    return num.toString(); // Return the number as a string if it's less than 1000
  }

  const units = ["K", "M", "B", "T"]; // K = Thousand, M = Million, B = Billion, T = Trillion
  let index = 0; // Index for the units
  let result = num;

  // Loop to find the appropriate unit
  while (result >= 1000 && index < units.length) {
    result /= 1000;
    index++;
  }

  // Format the result to one decimal place if necessary
  return `${result.toFixed(1)}${units[index - 1] || ""}`;
}

// function getRandomInt(min: number, max: number): number {
//   min = Math.ceil(min); // Ensure the minimum is rounded up
//   max = Math.floor(max); // Ensure the maximum is rounded down
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

const getPassport = async (username: string) => {
  try {
    const response = await axios.get(`/api/talent-protocol/passport/${username}`);
    return response.data;
  } catch (err) {}
};

const getPassportCredentials = async (username: string) => {
  try {
    const response = await axios.get(`/api/talent-protocol/credentials/${username}`);
    return response.data;
  } catch (err) {}
};

// const getUserWarpcastFid = async (username: string) => {
//   const response = await axios.get(`https://fnames.farcaster.xyz/transfers/current?name=${username}`);
//   return response.data.transfer.id;

//   // try {
//   //   const response = await axios.get(`/api/farcaster/getUserByFid/${username}`);
//   //   return response.data;
//   // } catch (err) {
//   // }

//   // try {
//   //   // const response = await axios.get(`/api/twitter/${username}`);
//   //   // const response = await axios.get("https://hub.pinata.cloud/v1/castsByFid?fid=6023&pageSize=10&reverse=true");

//   //   //https://fnames.farcaster.xyz/transfers/current?name=${username}
//   //   //https://api.farcaster.xyz/v2/user-by-fname?fname=${username}
//   //   const response = await axios.get(`https://fnames.farcaster.xyz/transfers/current?name=${username}`);
//   //   return response.data.transfer.id;
//   // } catch (err) {
//   // }
// };

const getUserCastsByFid = async (fid: number) => {
  const response = await axios.get(`https://hub.pinata.cloud/v1/castsByFid?fid=${fid}&reverse=true`);
  return response.data;
  // try {
  //   const response = await axios.get(`/api/farcaster/getUserCastsByFid/${fid}`);
  //   return response.data;
  // } catch (err) {
  // }

  // try {
  //   // const response = await axios.get(`/api/twitter/${username}`);

  //   //for setting a max limit: https://hub.pinata.cloud/v1/castsByFid?fid=${fid}&pageSize=100&reverse=true
  //   const response = await axios.get(`https://hub.pinata.cloud/v1/castsByFid?fid=${fid}&reverse=true`);
  //   return response.data;
  // } catch (err) {
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

//   //   "Trying " + `https://hub.pinata.cloud/v1/castsByFid?fid=${fid}&reverse=true&nextPageToken=${nextPageToken}`,
//   // );
//   //for setting a max limit: https://hub.pinata.cloud/v1/castsByFid?fid=${fid}&pageSize=100&reverse=true
//   const response = await axios.get(
//     `https://hub.pinata.cloud/v1/castsByFid?fid=${fid}&reverse=true&nextPageToken=${nextPageToken}`,
//   );

//   return response.data;
// } catch (err) {
// }
// };

// const getUserByUsername = async (username: string) => {
//   try {
//     const response = await axios.get(`/api/twitter/${username}`);
//     return response.data;
//   } catch (err) {
//   }
// };

// const getUserTweets = async (username: string) => {
//   // try {
//   //   const response = await axios.get(`/api/twitter2/${username}`);
//   //   return response.data;
//   // } catch (err) {
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
  farcasterName?: string;
};

export default function UserPage({ params }: { params: { community: string; address: string } }) {
  // const mentionsCriteria = criteriaDatabase[params.community as keyof typeof criteriaDatabase]?.fids || [];
  // const channelsCriteria = criteriaDatabase[params.community as keyof typeof criteriaDatabase]?.channels || [];

  const communityConfig = communitiesConfig[params.community as keyof typeof communitiesConfig];

  const farcasterChecksCommunity = communityConfig.farcasterChecks || [];
  const followerChecksCommunity = communityConfig.followerChecks || [];
  const chainNameCommunity = communityConfig.chainName;

  // const chains = communitiesConfig[params.community as keyof typeof communitiesConfig]?.onchainActivity || [];

  //after cleanup, fix bug by making params.address lowercase if its not an address

  const setAppTheme = useGlobalState(({ setAppTheme }) => setAppTheme);

  const router = useRouter();

  useEffect(() => {
    if (params.address === undefined) return;

    function hasUppercase(str: string): boolean {
      return str.split("").some(char => char === char.toUpperCase() && char !== char.toLowerCase());
    }

    if (!isAddress(params.address) && hasUppercase(params.address)) {
      router.push(`/${params.community}/${(params.address as string).toLowerCase()}`);
    }
  }, [params.community, params.address, router]);

  // const currentDate = new Date();

  const [selectedDate] = useState(new Date());

  useEffect(() => {
    setAppTheme(params.community);
  }, [params.community, setAppTheme]);

  // let community: string;

  const resolvedChains = useMemo(() => {
    const chains: Chain[] = [];
    communitiesConfig[params.community as keyof typeof communitiesConfig]?.checks?.onchainActivities?.forEach(
      (onchainActivity: any) => {
        const resolvedChain = getChainById(onchainActivity.chainId);
        if (resolvedChain) {
          chains.push(resolvedChain);
        }
      },
    );
    return chains;
  }, [params.community]);

  let resolvedChain: Chain | undefined;
  const { chain: selectedChain } = getChainByName(chainNameCommunity || "");

  if (selectedChain !== undefined) {
    //community is a blockchain!
    resolvedChain = selectedChain;
  }

  // if (resolvedChain) {
  //   chain = resolvedChain;
  //   community = chain.name;
  // } else {
  //   chain = mainnet;
  //   community = params.community;
  // }

  const [profile, setProfile] = useState<any>();

  const [
    userError, //setUserError
  ] = useState<string>();

  // useEffect(() => {
  //   // if (chain === undefined) {
  //   //   setUserError("Invalid chain. Please check for typos!");
  //   // }
  //   // else
  //   //  if (!isAddress(profile?.addr)) {
  //   //   setUserError("This account cannot be found anywhere. Please check for typos!");
  //   // } else {
  //   //   setUserError(undefined);
  //   // }
  // }, [resolvedChain, resolvedChain?.id, profile, profile?.addr]);

  const [isEnsResolved, setIsEnsResolved] = useState(false);

  const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // if (resolvedChains.length === 0) return;
      // if (params.address === undefined) return;
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
        let resolved = false;

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
        let resolved = false;

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

      const resolutionLoop = [async () => await ResolveWithEns()];

      for (let i = 0; i < resolvedChains.length; i++) {
        resolutionLoop.unshift(async () => await ResolveWithEns(resolvedChains[i]));
      }

      for (let i = 0; i < resolvedChains.length; i++) {
        if (resolvedChains[i]?.id === base.id) {
          resolutionLoop.unshift(ResolveWithBase);
        } else {
          resolutionLoop.push(ResolveWithBase);
        }
      }

      let chosenProfile: Profile = {};

      if (isAddress(params.address)) {
        chosenProfile = { addr: params.address };
      }

      for (let i = 0; i < resolutionLoop.length; i++) {
        const { profile, resolved } = await resolutionLoop[i]();

        setIsEnsResolved(resolved);

        if (profile) {
          chosenProfile = profile;
          break;
        }
      }

      setProfile(chosenProfile);

      if (chosenProfile.twitter) {
        // const user = await getUserByUsername(chosenProfile.twitter);
        // const tweets = await getUserTweets(chosenProfile.twitter);
      }

      function isNumeric(str: string): boolean {
        return /^\d+$/.test(str);
      }

      if (!chosenProfile.farcaster) {
        if (isEnsName(chosenProfile.name) || isBasename(chosenProfile.name)) {
          chosenProfile.farcaster = chosenProfile.name;
        } else {
          chosenProfile.farcaster = params.address;
        }
      }

      if (chosenProfile.farcaster) {
        let fid;
        if (isNumeric(chosenProfile.farcaster)) {
          fid = chosenProfile.farcaster;
        } else {
          const isEnsNameResult = isEnsName(chosenProfile.farcaster);
          const isBasenameResult = isBasename(chosenProfile.farcaster);

          if (isEnsNameResult === false && isBasenameResult === false && chosenProfile.addr === undefined) {
            const response = await fetch(`/api/neynar/getUserByName?username=${chosenProfile.farcaster}`);
            const data = await response.json();
            if (!data.error) {
              fid = data["user"].fid;
              chosenProfile.farcasterName = chosenProfile.farcaster;
              chosenProfile.description = data["user"].profile.bio.text;
              chosenProfile.avatar = data["user"]["pfp_url"];
              chosenProfile.addr = data["user"]["custody_address"];
              chosenProfile.name = data["user"]["display_name"];
            }
          } else {
            const response = await fetch(`/api/neynar/getUserByAddress?address=${chosenProfile.addr}`);
            const data = await response.json();

            if (!data.error) {
              const user = data[chosenProfile.addr?.toLowerCase() || ""];
              fid = user[0].fid;
              chosenProfile.farcasterName = chosenProfile.farcaster;
            }
          }
        }

        // const JESSE_POLLACK_FID = 99;
        // const JACOB_HOMANICS_FID = 240799;
        // const fid = JESSE_POLLACK_FID;

        if (fid) {
          let totalResults: any = [];

          let results;

          results = await getUserCastsByFid(fid);
          totalResults = totalResults.concat(results.messages);

          while (results.nextPageToken !== "") {
            results = await getUserCastsByFidNextPageToken(fid, results.nextPageToken);
            totalResults = totalResults.concat(results.messages);
          }

          const msgs = totalResults.filter((x: any) => {
            return x;
          });

          setFarcasterMessages(msgs);
        }
      }

      if (followerChecksCommunity.length > 0) {
        if (isEnsName(chosenProfile.name) || isBasename(chosenProfile.name)) {
          try {
            const response2 = await axios.get(
              `https://api.ethfollow.xyz/api/v1/users/${chosenProfile.name}/following?limit=5000`,
            );

            setFollowing(response2.data.following);

            const response = await axios.get(`https://api.ethfollow.xyz/api/v1/users/${chosenProfile.name}/lists`);

            const result = await axios.get(
              `https://api.ethfollow.xyz/api/v1/lists/${response.data["primary_list"]}/followers?limit=3000`,
            );
            setFollowers(result.data.followers);
          } catch (e) {
            // "no eth follow"
          }

          // const lists = response.data.lists;

          // let followersAllLists: any[] = [];
          // for (let i = 0; i < lists.length; i++) {
          //   const result = await axios.get(`https://api.ethfollow.xyz/api/v1/lists/${lists[i]}/followers?limit=3000`);
          //   followersAllLists = followersAllLists.concat(result.data.followers);
          // }

          // setFollowers(followersAllLists);
        }
      }

      const result = await getPassport(chosenProfile.addr || "");

      const result2 = await getPassportCredentials(result.passport["passport_id"]);
      setCredentials(result2["passport_credentials"]);

      setIsLoadingUserProfile(false);
    }

    fetchData();
  }, [
    resolvedChains,
    resolvedChains.length,
    // resolvedChain,
    // resolvedChain?.id,
    params.address,
    followerChecksCommunity.length,
  ]);

  const [farcasterMessages, setFarcasterMessages] = useState([]);

  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  const [credentials, setCredentials] = useState([]);

  const numOfDays = 13;

  const [selectedDay, setSelectedDay] = useState(selectedDate.getDay());
  const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear());

  const {
    transactions: unfilteredTransactionsGroupedByChain, //isError,
    // errorMessage,
  } = useTransactionsFromChains({
    chains: resolvedChains,
    address: profile?.addr,
  });

  const POINTS_PER_TRANSACTION = 100;
  const POINTS_PER_FARCASTER_MESSAGE = 25;
  const POINTS_PER_TALENT_PROTOCOL_BADGE = 300;
  // const POINTS_PER_CREDENTIAL = 10;
  const POINTS_PER_FOLLOW = 10;

  const mentionsDatabase = {
    12142: "base",
    309857: "coinbasewallet",
    12144: "wbnns",
    99: "jessepollack",
    20910: "zora",
    300898: "optimism",
    2375: "nouns",
    749097: "nounstown.eth",
    383235: "raidguild",
  };

  function buildTalentProtocolChecks() {
    // const someCriterias: any[] = [];
    // farcasterChecksCommunity.forEach(item => {
    //   if (item.channels) {
    //     someCriterias.push((element: any) => isValueInCriteria(item.channels, element.data.castAddBody?.parentUrl));
    //   }
    //   if (item.mentions) {
    //     someCriterias.push((element: any) => areAnyValuesInCriteria(item.mentions, element.data.castAddBody?.mentions));
    //   }
    // });
  }

  function buildFarcasterChecks() {
    const someCriterias: any[] = [];

    farcasterChecksCommunity.forEach(item => {
      if (item.channels) {
        someCriterias.push((element: any) => isValueInCriteria(item.channels, element.data.castAddBody?.parentUrl));
      }

      if (item.mentions) {
        someCriterias.push((element: any) => areAnyValuesInCriteria(item.mentions, element.data.castAddBody?.mentions));
      }

      if (item.text) {
        someCriterias.push((element: any) => isTextInCriteria(item.text, element.data.castAddBody?.text));
      }
    });

    return someCriterias;
  }

  function buildOnchainActivityCriteriaChecks(criteria: any) {
    const criteriaFunctions: Array<(tx: any) => boolean> = [];

    if (criteria.to) {
      criteriaFunctions.push((tx: any) => getAddress(tx.to) === criteria.to);
    }

    if (criteria.blockNumber) {
      criteriaFunctions.push((tx: any) => tx.blockNumber.toString() === criteria.blockNumber);
    }

    return criteriaFunctions;
  }

  function getAllValidTransactions(transactions: any[], criteriaList: any[]) {
    const validTransactions: any[] = [];

    if (!criteriaList) {
      validTransactions.push(...transactions);
    } else {
      criteriaList.forEach((criteria: any) => {
        const criteriaChecks = buildOnchainActivityCriteriaChecks(criteria);
        const filteredTransactions = getFilteredArrayForEvery(transactions || [], criteriaChecks);

        validTransactions.push(...filteredTransactions);
      });
    }

    return validTransactions;
  }

  function getFilteredTransactions() {
    const onchainActivityChecks = communityConfig?.checks?.onchainActivities || [];
    const allFilteredTransactionsGroupedByChain: any[] = [];

    onchainActivityChecks.forEach((activityCheck: any) => {
      const transactionsForChain = unfilteredTransactionsGroupedByChain.find(
        (tx: any) => tx.chain.id === activityCheck.chainId,
      );

      const validTransactionsForChain = getAllValidTransactions(
        transactionsForChain?.transactions || [],
        activityCheck.criteriaList,
      );

      allFilteredTransactionsGroupedByChain.push({
        chain: activityCheck.chainId,
        transactions: validTransactionsForChain,
      });
    });

    return allFilteredTransactionsGroupedByChain;
  }

  const allValidTransactions = getFilteredTransactions();

  function getFilteredTalentProtocolCredentials() {
    const talentProtocolChecks = communityConfig?.checks?.talentProtocol || [];

    const allValidTalentProtocolCredentials: any[] = [];

    talentProtocolChecks.forEach((check: any) => {
      const criteriaFunctions: Array<(credential: any) => boolean> = [];
      const checkCriteria: any[] = [];
      check.forEach((criterion: any) => {
        if (criterion === "onchain_at") {
          criteriaFunctions.push((credential: any) => credential["onchain_at"] !== null);
          checkCriteria.push("onchain_at");
        }

        if (criterion === "earned_at") {
          criteriaFunctions.push((credential: any) => credential["earned_at"] !== null);
          checkCriteria.push("earned_at");
        }
      });

      allValidTalentProtocolCredentials.push({
        criteria: checkCriteria,
        credentials: getFilteredArrayForEvery(credentials || [], criteriaFunctions),
      });
    });

    return allValidTalentProtocolCredentials;
  }

  const allValidTalentProtocolCredentials = getFilteredTalentProtocolCredentials();

  function getAllTimeTally(transactionsGroupedByChain: any) {
    let tally = 0;

    // const followersChecks = [];
    // followersChecks.push((element: any) => isDateWithinMonth(new Date(element["updated_at"]), year, month));
    const filteredFollowers = followers; // getFilteredArrayForSome(followers, followersChecks);
    const filteredFollowersTally = filteredFollowers.length * POINTS_PER_FOLLOW;
    tally += filteredFollowersTally;

    // const onchainChecks: any[] = [];
    let filteredTransactionsTally = 0;
    for (let i = 0; i < transactionsGroupedByChain.length; i++) {
      filteredTransactionsTally += transactionsGroupedByChain[i].transactions.length * POINTS_PER_TRANSACTION;
    }
    tally += filteredTransactionsTally;

    const filteredFarcasterMessages = getFilteredArrayForEvery(farcasterMessages, buildFarcasterChecks());

    tally += filteredFarcasterMessages.length * POINTS_PER_FARCASTER_MESSAGE;

    tally += credentials.length * POINTS_PER_TALENT_PROTOCOL_BADGE;

    return tally;
  }

  function getYearlyTally(transactionsGroupedByChain: any, year: number) {
    let tally = 0;

    const followersChecks = [];
    for (let i = 0; i < followerChecksCommunity.length; i++) {
      if (followerChecksCommunity[i] === "date") {
        followersChecks.push((element: any) => isDateWithinYear(new Date(element["updated_at"]), year));
      }
    }
    const filteredFollowers = getFilteredArrayForSome(followers, followersChecks);
    const filteredFollowersTally = filteredFollowers.length * POINTS_PER_FOLLOW;
    tally += filteredFollowersTally;

    let filteredTransactionsTally = 0;
    const allValidTransactions = [];
    for (let i = 0; i < transactionsGroupedByChain.length; i++) {
      const allValidTransactionsForSpecificChain = transactionsGroupedByChain[i].transactions.filter((element: any) =>
        isDateWithinYear(new Date(element.timeStamp * 1000), year),
      );
      allValidTransactions.push({
        chain: transactionsGroupedByChain[i].chain,
        transactions: allValidTransactionsForSpecificChain,
      });

      filteredTransactionsTally += allValidTransactionsForSpecificChain.length * POINTS_PER_TRANSACTION;
    }

    tally += filteredTransactionsTally;

    const filteredByYearFarcasterMessages = farcasterMessages.filter((element: any) =>
      isDateWithinYear(getFarcasterDate(element.data.timestamp), year),
    );

    allValidTalentProtocolCredentials.forEach((element: any) => {
      const criteriaFunctions: Array<(credential: any) => boolean> = [];
      for (let i = 0; i < element.criteria.length; i++) {
        // const checkCriteria: any[] = [];

        for (let j = 0; j < element.criteria[i].length; j++) {
          if (element.criteria[i][j] === "onchain_at") {
            criteriaFunctions.push((credential: any) => credential["onchain_at"] !== null);
            // checkCriteria.push("onchain_at");
          }

          if (element.criteria[i][j] === "earned_at") {
            criteriaFunctions.push((credential: any) => credential["earned_at"] !== null);
            // checkCriteria.push("earned_at");
          }
        }
      }
      getFilteredArrayForEvery(element.credentials || [], criteriaFunctions);
    });

    // }

    // if (element.criteria.includes("onchain_at")) {
    //   const filtered1 = element.credentials.filter((element: any) =>
    //     isDateWithinYear(new Date(element["onchain_at"]), year),
    //   );

    //   tally += filtered1.length * POINTS_PER_TALENT_PROTOCOL_BADGE;
    // }

    // if (element.criteria.includes("earned_at")) {
    //   const filtered2 = element.credentials.filter((element: any) =>
    //     isDateWithinYear(new Date(element["earned_at"]), year),
    //   );

    //   tally += filtered2.length * POINTS_PER_TALENT_PROTOCOL_BADGE;
    // }
    // });

    // let filteredTalentProtocolBadges: any[] = [];

    // filteredTalentProtocolBadges = allValidTalentProtocolCredentials.filter((element: any) =>
    //   isDateWithinYear(new Date(element["onchain_at"]), year),
    // );

    // tally += filteredTalentProtocolBadges.length * POINTS_PER_TALENT_PROTOCOL_BADGE;

    const filteredFarcasterMessages = getFilteredArrayForEvery(filteredByYearFarcasterMessages, buildFarcasterChecks());

    tally += filteredFarcasterMessages.length * POINTS_PER_FARCASTER_MESSAGE;

    return tally;
  }

  function getMonthlyTally(transactionsGroupedByChain: any, year: number, month: number) {
    let tally = 0;

    const followersChecks = [];
    for (let i = 0; i < followerChecksCommunity.length; i++) {
      if (followerChecksCommunity[i] === "date") {
        followersChecks.push((element: any) => isDateWithinMonth(new Date(element["updated_at"]), year, month));
      }
    }

    const filteredFollowers = getFilteredArrayForSome(followers, followersChecks);
    const filteredFollowersTally = filteredFollowers.length * POINTS_PER_FOLLOW;
    tally += filteredFollowersTally;

    let filteredTransactionsTally = 0;
    const allValidTransactions = [];
    for (let i = 0; i < transactionsGroupedByChain.length; i++) {
      const allValidTransactionsForSpecificChain = transactionsGroupedByChain[i].transactions.filter((element: any) =>
        isDateWithinMonth(new Date(element.timeStamp * 1000), year, month),
      );
      allValidTransactions.push({
        chain: transactionsGroupedByChain[i].chain,
        transactions: allValidTransactionsForSpecificChain,
      });

      filteredTransactionsTally += allValidTransactionsForSpecificChain.length * POINTS_PER_TRANSACTION;
    }

    tally += filteredTransactionsTally;

    // allValidTalentProtocolCredentials.forEach((element: any) => {
    //   if (element.tags.includes("onchain_at")) {
    //     const filtered1 = element.credentials.filter((element: any) =>
    //       isDateWithinMonth(new Date(element["onchain_at"]), year, month),
    //     );

    //     tally += filtered1.length * POINTS_PER_TALENT_PROTOCOL_BADGE;
    //   }

    //   if (element.tags.includes("earned_at")) {
    //     const filtered2 = element.credentials.filter((element: any) =>
    //       isDateWithinMonth(new Date(element["earned_at"]), year, month),
    //     );

    //     tally += filtered2.length * POINTS_PER_TALENT_PROTOCOL_BADGE;
    //   }
    // });

    // let filteredTalentProtocolBadges: any[] = [];

    // filteredTalentProtocolBadges = credentials.filter((element: any) =>
    //   isDateWithinMonth(new Date(element["onchain_at"]), year, month),
    // );

    // tally += filteredTalentProtocolBadges.length * POINTS_PER_TALENT_PROTOCOL_BADGE;

    const filteredByMonthFarcasterMessages = farcasterMessages.filter((element: any) =>
      isDateWithinMonth(getFarcasterDate(element.data.timestamp), year, month),
    );
    const filteredFarcasterMessages = getFilteredArrayForEvery(
      filteredByMonthFarcasterMessages,
      buildFarcasterChecks(),
    );
    tally += filteredFarcasterMessages.length * POINTS_PER_FARCASTER_MESSAGE;

    buildTalentProtocolChecks();

    return tally;
  }

  // useEffect(() => {
  //   async function getChannelByName(channelName: string) {
  //     try {
  //       // Replace this with the actual API endpoint to fetch channels by name
  //       const response = await fetch(`https://api.farcaster.com/channels?name=${encodeURIComponent(channelName)}`);
  //       const channels: any[] = await response.json();

  //       // Assuming the API returns an array of channels, find the one matching the channel name
  //       const channel = channels.find(ch => ch.name === channelName);

  //       return channel; // Return the channel object if found
  //     } catch (error) {
  //       console.error("Error fetching channel by name:", error);
  //       return undefined;
  //     }
  //   }
  //   getChannelByName(community);
  // }, [community]);

  function getDailyTally(transactionsGroupedByChain: any, year: number, month: number, day: number) {
    let tally = 0;

    const followersChecks = [];
    for (let i = 0; i < followerChecksCommunity.length; i++) {
      if (followerChecksCommunity[i] === "date") {
        followersChecks.push((element: any) => isDateWithinDay(new Date(element["updated_at"]), year, month, day));
      }
    }

    const filteredFollowers = getFilteredArrayForSome(followers, followersChecks);
    const filteredFollowersTally = filteredFollowers.length * POINTS_PER_FOLLOW;
    tally += filteredFollowersTally;

    let filteredTransactionsTally = 0;
    const allValidTransactions = [];
    for (let i = 0; i < transactionsGroupedByChain.length; i++) {
      const allValidTransactionsForSpecificChain = transactionsGroupedByChain[i].transactions.filter((element: any) => {
        return isDateWithinDay(new Date(element.timeStamp * 1000), year, month, day);
      });

      allValidTransactions.push({
        chain: transactionsGroupedByChain[i].chain,
        transactions: allValidTransactionsForSpecificChain,
      });

      filteredTransactionsTally += allValidTransactionsForSpecificChain.length * POINTS_PER_TRANSACTION;
    }

    tally += filteredTransactionsTally;

    const allFilteredTalentProtocolBadges: any[] = [];

    allValidTalentProtocolCredentials.forEach((element: any) => {
      const criteriaFunctions: Array<(credential: any) => boolean> = [];

      for (let i = 0; i < element.criteria.length; i++) {
        // const checkCriteria: any[] = [];

        if (element.criteria[i] === "onchain_at") {
          criteriaFunctions.push((credential: any) => {
            return isDateWithinDay(new Date(credential["onchain_at"]), year, month, day);
          });
          // checkCriteria.push("onchain_at");
        }

        if (element.criteria[i] === "earned_at") {
          criteriaFunctions.push((credential: any) =>
            isDateWithinDay(new Date(credential["earned_at"]), year, month, day),
          );
          // checkCriteria.push("earned_at");
        }
      }

      allFilteredTalentProtocolBadges.push({
        criteria: element.criteria,
        credentials: getFilteredArrayForEvery(element.credentials || [], criteriaFunctions),
      });
    });

    // const allFilteredTalentProtocolBadges: any[] = [];
    // const global_tags = [["onchain_at"], ["earned_at"], ["onchain_at", "earned_at"]];

    // // for (let i = 0; i < allValidTalentProtocolCredentials.length; i++) {

    // //   allValidTalentProtocolCredentials[i].tags.forEach((tag: string) => {

    // //   });
    // //   }
    // // }

    // for (let i = 0; i < global_tags.length; i++) {
    //   for (let j = 0; j < global_tags[i].length; j++) {
    //     allValidTalentProtocolCredentials.forEach((element: any) => {
    //       if (element.tags.includes(global_tags[i][j])) {
    //         const criteriaFunctions: Array<(credential: any) => boolean> = [];

    //         if (global_tags[i][j] === "onchain_at") {
    //           criteriaFunctions.push((credential: any) =>
    //             isDateWithinDay(new Date(credential["onchain_at"]), year, month, day),
    //           );
    //         }

    //         if (global_tags[i][j] === "earned_at") {
    //           criteriaFunctions.push((credential: any) =>
    //             isDateWithinDay(new Date(credential["earned_at"]), year, month, day),
    //           );
    //         }

    //         allFilteredTalentProtocolBadges.push({
    //           tags: global_tags[i],
    //           credentials: getFilteredArrayForEvery(element.credentials || [], criteriaFunctions),
    //         });
    //       }
    //     });
    //   }
    // }

    // for (let i = 0; i < allFilteredTalentProtocolBadges.length; i++) {
    //   tally += allFilteredTalentProtocolBadges[i].credentials.length * POINTS_PER_TALENT_PROTOCOL_BADGE;
    // }

    //   if (element.tags.includes("onchain_at")) {
    //     const filtered1 = element.credentials.filter((element: any) =>
    //       isDateWithinDay(new Date(element["onchain_at"]), year, month, day),
    //     );

    //     allFilteredTalentProtocolBadges.push({ tags: [] });

    //     tally += filtered1.length * POINTS_PER_TALENT_PROTOCOL_BADGE;
    //   }

    //   if (element.tags.includes("earned_at")) {
    //     const filtered2 = element.credentials.filter((element: any) =>
    //       isDateWithinDay(new Date(element["earned_at"]), year, month, day),
    //     );

    //     allFilteredTalentProtocolBadges.push(...filtered2);

    //     tally += filtered2.length * POINTS_PER_TALENT_PROTOCOL_BADGE;
    //   }
    // });

    // let filteredTalentProtocolBadges: any[] = [];

    // filteredTalentProtocolBadges = credentials.filter((element: any) =>
    //   isDateWithinDay(new Date(element["onchain_at"]), year, month, day),
    // );

    // tally += filteredTalentProtocolBadges.length * POINTS_PER_TALENT_PROTOCOL_BADGE;

    const filteredByDayFarcasterMessages = farcasterMessages.filter((element: any) =>
      isDateWithinDay(getFarcasterDate(element.data.timestamp), year, month, day),
    );

    const filteredFarcasterMessages = getFilteredArrayForEvery(filteredByDayFarcasterMessages, buildFarcasterChecks());

    const filteredFarcasterMessagesTally = filteredFarcasterMessages.length * POINTS_PER_FARCASTER_MESSAGE;
    tally += filteredFarcasterMessagesTally;

    return {
      transactions: allValidTransactions,
      filteredFarcasterMessages: filteredFarcasterMessages,
      filteredFollowers,
      filteredTalentProtocolBadges: allFilteredTalentProtocolBadges,
      totalTally: tally,
    };
  }

  const allTimeScore = getAllTimeTally(allValidTransactions);
  const yearlyTally = getYearlyTally(allValidTransactions, selectedYear);
  const totalMonthlyTally = getMonthlyTally(allValidTransactions, selectedYear, selectedMonth);

  const dailyTallies = [];
  for (let i = 0; i < numOfDays; i++) {
    const selectedDay = i + 1;
    const {
      transactions: filteredTransactions,
      filteredFollowers,
      filteredFarcasterMessages,
      totalTally,
      filteredTalentProtocolBadges,
    } = getDailyTally(allValidTransactions, selectedYear, selectedMonth, selectedDay);

    dailyTallies.push({
      filteredTransactions,
      filteredTalentProtocolBadges,
      filteredFollowers,
      filteredFarcasterMessages,
      totalTally,
    });
  }

  const [isInDayView, setIsInDayView] = useState(false);

  const farcasterMessagesComponents = dailyTallies[selectedDay - 1]?.filteredFarcasterMessages?.map((value, index) => {
    const textArray = value.data.castAddBody.text.split("");

    for (let i = 0; i < value.data.castAddBody.mentions.length; i++) {
      const adjustedPosition = value.data.castAddBody.mentionsPositions[i] + i;

      const valueToInsert = mentionsDatabase[value.data.castAddBody.mentions[i] as keyof typeof mentionsDatabase];

      if (valueToInsert !== undefined) {
        textArray.splice(adjustedPosition, 0, "@" + valueToInsert.toString());
      }
    }

    const reconstructedText = textArray.join("");

    let channel;
    if (value.data.castAddBody.parentUrl) {
      if (value.data.castAddBody.parentUrl === "https://onchainsummer.xyz") {
        channel = "/base";
      } else if (
        value.data.castAddBody.parentUrl === "chain://eip155:1/erc721:0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03"
      ) {
        channel = "/nouns";
      } else {
        channel = value.data.castAddBody.parentUrl.replace("https://warpcast.com/~/channel", "");
      }
    }

    return (
      <Link
        key={"Farcaster Messages" + index}
        href={`https://warpcast.com/${profile.farcasterName}/${value.hash}`}
        target="#"
      >
        <div className="w-[200px] md:w-[400px] space-y-1 bg-base-100 rounded-lg p-2 bg-primary transform scale-100 hover:scale-95 transition duration-300 ease-in-out">
          <div className="flex space-x-1">
            <div className="bg-secondary rounded-lg p-1">#{index + 1}</div>
            <div className="overflow-hidden">{reconstructedText}</div>
          </div>
          {channel ? <div className="bg-secondary rounded-lg p-1">{channel}</div> : <></>}
        </div>
      </Link>
    );
  });

  const followersComponents = dailyTallies[selectedDay - 1]?.filteredFollowers?.map((value, index) => {
    return (
      // <Link key={"Followers" + index} href={getBlockExplorerTxLink(resolvedChain?.id, value.hash) || ""} target="#">
      <div
        key={"Followers" + index}
        className="w-[200px] md:w-[400px] flex space-x-1 bg-base-100 rounded-lg p-2 bg-primary transform scale-100 hover:scale-95 transition duration-300 ease-in-out"
      >
        <div className="bg-secondary rounded-lg">#{index + 1}</div>
        <div className="overflow-hidden">{"Gained follower: " + value.address}</div>
      </div>
      // </Link>
    );
  });

  const talentProtocolComponents = dailyTallies[selectedDay - 1]?.filteredTalentProtocolBadges?.map((value, index) => {
    console.log(value);

    console.log(value.credentials);

    return value.credentials.map((element: any, index2: number) => {
      let criteriaString = "";
      for (let i = 0; i < value.criteria.length; i++) {
        criteriaString += value.criteria[i] + `${i + 1 < value.criteria.length ? "," : ""}`;
      }

      return (
        <div
          key={"TP" + index + "-" + index2}
          className="w-[200px] md:w-[400px] flex space-x-1 bg-base-100 rounded-lg p-2 bg-primary transform scale-100 hover:scale-95 transition duration-300 ease-in-out"
        >
          <div className="bg-secondary rounded-lg">#{index + 1}</div>
          <div className="overflow-hidden">{`${element.name} ${criteriaString} at: ` + element.onchain_at}</div>
        </div>
      );
    });

    return (
      // <Link key={"Followers" + index} href={getBlockExplorerTxLink(resolvedChain?.id, value.hash) || ""} target="#">
      <div
        key={"TP" + index}
        className="w-[200px] md:w-[400px] flex space-x-1 bg-base-100 rounded-lg p-2 bg-primary transform scale-100 hover:scale-95 transition duration-300 ease-in-out"
      >
        <div className="bg-secondary rounded-lg">#{index + 1}</div>
        <div className="overflow-hidden">{`${value.name} onchain at: ` + value.onchain_at}</div>
      </div>
      // </Link>
    );
  });

  const transactionsComponents = dailyTallies[selectedDay - 1]?.filteredTransactions?.map(value => {
    function removeTextBetweenChars(input: string, startChar: string, endChar: string): string {
      // Create a regex pattern to match everything between the first occurrence of startChar and endChar, including the characters themselves
      const regex = new RegExp(`\\${startChar}[^\\${startChar}\\${endChar}]*?\\${endChar}`, "g");
      const result = input.replace(regex, "").trim(); // Remove matched content and trim any extra whitespace
      return result;
    }

    return value.transactions.map((transaction: any, index: number) => {
      return (
        <Link
          key={"Transactions" + index}
          href={getBlockscoutExplorerTxLink(value.chain, transaction.hash) || ""}
          target="#"
        >
          <div className="w-[200px] md:w-[400px] flex space-x-1 bg-base-100 rounded-lg p-2 bg-primary transform scale-100 hover:scale-95 transition duration-300 ease-in-out">
            <div className="bg-secondary rounded-lg">#{index + 1}</div>
            {transaction?.functionName?.length > 0 ? (
              <div>{removeTextBetweenChars(transaction.functionName, "(", ")")}</div>
            ) : (
              <></>
            )}
          </div>
        </Link>
      );
    });
  });

  const monthsComponents = dailyTallies.map((value, index) => {
    const sources = [];
    if (value.filteredFollowers.length > 0) {
      sources.push(
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          alt="Logo"
          src={`/efp-logo.svg`}
          className="h-[25px] rounded-lg"
          style={{ aspectRatio: "1 / 1" }}
          key={"source" + sources.length}
        />,
      );
    }

    for (let i = 0; i < value.filteredTalentProtocolBadges.length; i++) {
      if (value.filteredTalentProtocolBadges[i].credentials.length > 0) {
        sources.push(
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            alt="Logo"
            src={`/talent-protocol-logo/logo-purple.svg`}
            className="h-[25px] rounded-lg"
            style={{ aspectRatio: "1 / 1" }}
            key={"source" + sources.length}
          />,
        );
      }
    }

    if (value.filteredFarcasterMessages.length > 0) {
      sources.push(
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          alt="Logo"
          src={`/farcaster.webp`}
          className="h-[25px] rounded-lg"
          style={{ aspectRatio: "1 / 1" }}
          key={"source" + sources.length}
        />,
      );
    }

    const chainConfig = {
      42220: {
        logo: "/celo-celo-logo.png",
      },
      42161: {
        logo: "/arbitrum-arb-logo.png",
      },
      8453: {
        logo: "/Base_Network_Logo.svg",
      },
    } as any;

    for (let i = 0; i < value.filteredTransactions.length; i++) {
      if (value.filteredTransactions[i].transactions.length > 0) {
        sources.push(
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            alt="Logo"
            src={chainConfig[value.filteredTransactions[i].chain]?.logo || "/etherscan.png"}
            className="h-[25px] rounded-lg"
            style={{ aspectRatio: "1 / 1" }}
            key={"source" + sources.length}
          />,
        );
      }
    }

    return (
      <button
        key={index}
        className="transform scale-100 hover:scale-90 transition duration-300 ease-in-out"
        onClick={() => {
          setIsInDayView(true);
          setSelectedDay(index + 1);
        }}
      >
        <div className="m-0.5 md:m-1">
          <DayCard day={index + 1} score={value.totalTally} sources={sources} />
        </div>
      </button>
    );
  });

  const [isLoadingWebsite, setIsLoadingWebsite] = useState(false);
  useEffect(() => {
    setIsLoadingWebsite(isLoadingUserProfile);
  }, [isLoadingUserProfile]);

  if (isLoadingWebsite) return <>Loading...</>;
  if (userError) return <>{userError}</>;

  let transactionOutput;
  if (
    false //isError
  ) {
    // transactionOutput = <div>{errorMessage}</div>;
  } else {
    transactionOutput = (
      <div className="bg-secondary rounded-lg">
        <div className="p-1 md:p-4">
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
            <div className="flex flex-col bg-base-100">
              {isInDayView ? (
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
              ) : (
                <></>
              )}
            </div>

            {isInDayView ? (
              <div className="mx-1 md:mx-[450px] text-center">
                <button
                  className="btn btn-primary m-10"
                  onClick={() => {
                    setIsInDayView(false);
                  }}
                >
                  Back to Monthly View
                </button>
                {farcasterMessagesComponents.length === 0 && transactionsComponents.length === 0 ? (
                  <p>No points were earned on this day!</p>
                ) : (
                  <></>
                )}
                {talentProtocolComponents.length > 0 ? (
                  <>
                    <div className="text-4xl">Talent Protocol</div>
                    <div className="flex flex-col space-y-1 items-center">{talentProtocolComponents}</div>
                  </>
                ) : (
                  <></>
                )}
                {farcasterMessagesComponents.length > 0 ? (
                  <>
                    <div className="text-4xl">Farcaster Messages</div>
                    <div className="flex flex-col space-y-1 items-center">{farcasterMessagesComponents}</div>
                  </>
                ) : (
                  <></>
                )}

                {followersComponents.length > 0 ? (
                  <>
                    <div className="text-4xl">Ethereum Follow Protocol</div>
                    <div className="flex flex-col space-y-1 items-center">{followersComponents}</div>{" "}
                  </>
                ) : (
                  <></>
                )}

                {transactionsComponents[0].length > 0 ? (
                  <>
                    <div className="text-4xl">Transactions</div>
                    <div className="flex flex-col space-y-1 items-center">{transactionsComponents}</div>{" "}
                  </>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center rounded-lg md:w-[800px]">{monthsComponents}</div>
            )}
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
          <div className="flex">
            <PfpCard
              name={!isEnsResolved ? profile?.name ?? profile?.addr : undefined}
              image={profile?.avatar}
              description={profile?.description}
              chain={resolvedChain}
              address={profile?.addr}
              ens={isEnsResolved ? profile?.name : undefined}
              size="sm"
              efpFollowers={followers.length > 0 ? followers.length : undefined}
              efpFollowing={following.length > 0 ? following.length : undefined}
            />

            <div className="flex flex-wrap justify-center m-0.5 md:m-4 space-x-1">
              <Score title="Monthly Score" score={customNotation(totalMonthlyTally)} />
              <Score title="Yearly Score" score={customNotation(yearlyTally)} />
              <Score title="Overall Score" score={customNotation(allTimeScore)} />
            </div>
          </div>
        </div>
        {transactionOutput}
      </div>
    </>
  );
}

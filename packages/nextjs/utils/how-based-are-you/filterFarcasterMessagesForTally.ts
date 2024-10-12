// import { getTallyForFilteredArray } from "./getTallyForFilteredArray";
import { Chain } from "viem";

const FARCASTER_START_EPOCH = 1609459200;

const chainsObjs = {
  Base: {
    mentionFids: [
      12142, //Base,
      309857, //Coinbase Wallet
    ],
  },
};

export function getAllTimeFarcasterMessages(array: any[], mentions: any[]) {
  return array.filter(element => {
    let isPresent = false;

    for (let i = 0; i < element.data.castAddBody?.mentions.length; i++) {
      for (let j = 0; j < mentions.length; j++) {
        if (element.data.castAddBody.mentions[i] === mentions[j]) {
          isPresent = true;
        }
      }
    }
    return isPresent;
  });
}

export function getYearlyFarcasterMessages(array: any[], year: number, mentions: any[]) {
  return array.filter(element => {
    const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);
    let isPresent = false;
    for (let i = 0; i < element.data.castAddBody?.mentions.length; i++) {
      for (let j = 0; j < mentions.length; j++) {
        if (element.data.castAddBody.mentions[i] === mentions[j]) {
          isPresent = true;
        }
      }
    }
    return isPresent && date.getFullYear() === year;
  });
}

export function getMonthlyFarcasterMessages(array: any[], year: number, month: number, mentions: any[]) {
  return array.filter(element => {
    const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);
    let isPresent = false;
    for (let i = 0; i < element.data.castAddBody?.mentions.length; i++) {
      for (let j = 0; j < mentions.length; j++) {
        if (element.data.castAddBody.mentions[i] === mentions[j]) {
          isPresent = true;
        }
      }
    }
    return isPresent && date.getFullYear() === year && date.getMonth() + 1 === month;
  });
}

export function getDailyFarcasterMessage(array: any[], year: number, month: number, day: number, mentions: any[]) {
  return array.filter(element => {
    const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);
    let isPresent = false;
    for (let i = 0; i < element.data.castAddBody?.mentions.length; i++) {
      for (let j = 0; j < mentions.length; j++) {
        if (element.data.castAddBody.mentions[i] === mentions[j]) {
          isPresent = true;
        }
      }
    }
    return isPresent && date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
  });
}

export function getAllTimeFarcasterMessagesTally(array: any[], pointsPer: number, chain: Chain) {
  const mentions = chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids;

  return getAllTimeFarcasterMessages(array, mentions).length * pointsPer;
  // return getTallyForFilteredArray(array, pointsPer, (element: any) => {
  //   let isPresent = false;

  //   for (let i = 0; i < element.data.castAddBody?.mentions.length; i++) {
  //     for (let j = 0; j < chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids.length; j++) {
  //       if (
  //         element.data.castAddBody.mentions[i] === chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids[j]
  //       ) {
  //         isPresent = true;
  //       }
  //     }
  //   }
  //   return isPresent;
  // });
}

export function getYearlyFarcasterMessagesTally(array: any[], pointsPer: number, chain: Chain, year: number) {
  const mentions = chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids;
  return getYearlyFarcasterMessages(array, year, mentions).length * pointsPer;

  // return getTallyForFilteredArray(array, pointsPer, (element: any) => {
  //   const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);
  //   let isPresent = false;
  //   for (let i = 0; i < element.data.castAddBody?.mentions.length; i++) {
  //     for (let j = 0; j < chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids.length; j++) {
  //       if (
  //         element.data.castAddBody.mentions[i] === chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids[j]
  //       ) {
  //         isPresent = true;
  //       }
  //     }
  //   }
  //   return isPresent && date.getFullYear() === year;
  // });
}

export function getMonthlyFarcasterMessagesTally(
  array: any[],
  pointsPer: number,
  chain: Chain,
  year: number,
  month: number,
) {
  const mentions = chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids;
  return getMonthlyFarcasterMessages(array, year, month, mentions).length * pointsPer;

  // return getTallyForFilteredArray(array, pointsPer, (element: any) => {
  //   const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);
  //   let isPresent = false;
  //   for (let i = 0; i < element.data.castAddBody?.mentions.length; i++) {
  //     for (let j = 0; j < chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids.length; j++) {
  //       if (
  //         element.data.castAddBody.mentions[i] === chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids[j]
  //       ) {
  //         isPresent = true;
  //       }
  //     }
  //   }
  //   return isPresent && date.getFullYear() === year && date.getMonth() + 1 === month;
  // });
}

export function getDailyFarcasterMessagesTally(
  array: any[],
  pointsPer: number,
  chain: Chain,
  year: number,
  month: number,
  day: number,
) {
  const mentions = chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids;
  return getDailyFarcasterMessage(array, year, month, day, mentions).length * pointsPer;

  // return getTallyForFilteredArray(array, pointsPer, (element: any) => {
  //   const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);
  //   let isPresent = false;
  //   for (let i = 0; i < element.data.castAddBody?.mentions.length; i++) {
  //     for (let j = 0; j < chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids.length; j++) {
  //       if (
  //         element.data.castAddBody.mentions[i] === chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids[j]
  //       ) {
  //         isPresent = true;
  //       }
  //     }
  //   }
  //   return isPresent && date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
  // });
}

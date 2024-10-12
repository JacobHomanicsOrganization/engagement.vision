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

export function getAllTimeFarcasterMessages(array: any[], chain: Chain) {
  return array.filter(element => {
    let isPresent = false;

    for (let i = 0; i < element.data.castAddBody?.mentions.length; i++) {
      for (let j = 0; j < chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids.length; j++) {
        if (
          element.data.castAddBody.mentions[i] === chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids[j]
        ) {
          isPresent = true;
        }
      }
    }
    return isPresent;
  });
}

export function getYearlyFarcasterMessages(array: any[], year: number, chain: Chain) {
  return array.filter(element => {
    const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);
    let isPresent = false;
    for (let i = 0; i < element.data.castAddBody?.mentions.length; i++) {
      for (let j = 0; j < chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids.length; j++) {
        if (
          element.data.castAddBody.mentions[i] === chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids[j]
        ) {
          isPresent = true;
        }
      }
    }
    return isPresent && date.getFullYear() === year;
  });
}

export function getMonthlyFarcasterMessages(array: any[], year: number, month: number, chain: Chain) {
  return array.filter(element => {
    const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);
    let isPresent = false;
    for (let i = 0; i < element.data.castAddBody?.mentions.length; i++) {
      for (let j = 0; j < chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids.length; j++) {
        if (
          element.data.castAddBody.mentions[i] === chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids[j]
        ) {
          isPresent = true;
        }
      }
    }
    return isPresent && date.getFullYear() === year && date.getMonth() + 1 === month;
  });
}

export function getDailyFarcasterMessage(array: any[], year: number, month: number, day: number, chain: Chain) {
  return array.filter(element => {
    const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);
    let isPresent = false;
    for (let i = 0; i < element.data.castAddBody?.mentions.length; i++) {
      for (let j = 0; j < chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids.length; j++) {
        if (
          element.data.castAddBody.mentions[i] === chainsObjs[chain?.name as keyof typeof chainsObjs]?.mentionFids[j]
        ) {
          isPresent = true;
        }
      }
    }
    return isPresent && date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
  });
}

export function getAllTimeFarcasterMessagesTally(array: any[], pointsPer: number, chain: Chain) {
  return getAllTimeFarcasterMessages(array, chain).length * pointsPer;
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
  return getYearlyFarcasterMessages(array, year, chain).length * pointsPer;

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
  return getMonthlyFarcasterMessages(array, year, month, chain).length * pointsPer;

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
  return getDailyFarcasterMessage(array, year, month, day, chain).length * pointsPer;

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

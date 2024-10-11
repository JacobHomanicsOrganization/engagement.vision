import { getTallyForFilteredArray } from "./getTallyForFilteredArray";
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

export function getAllTimeFarcasterMessagesTally(array: any[], pointsPer: number, chain: Chain) {
  return getTallyForFilteredArray(array, pointsPer, (element: any) => {
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

export function getYearlyFarcasterMessagesTally(array: any[], pointsPer: number, chain: Chain, year: number) {
  return getTallyForFilteredArray(array, pointsPer, (element: any) => {
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

export function getMonthlyFarcasterMessagesTally(
  array: any[],
  pointsPer: number,
  chain: Chain,
  year: number,
  month: number,
) {
  return getTallyForFilteredArray(array, pointsPer, (element: any) => {
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

export function getDailyFarcasterMessagesTally(
  array: any[],
  pointsPer: number,
  chain: Chain,
  year: number,
  month: number,
  day: number,
) {
  return getTallyForFilteredArray(array, pointsPer, (element: any) => {
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

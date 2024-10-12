// import { getTallyForFilteredArray } from "./getTallyForFilteredArray";
import { Chain } from "viem";

const FARCASTER_START_EPOCH = 1609459200;

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

const mentionsCriteria = {
  Base: {
    fids: [
      12142, //Base,
      309857, //Coinbase Wallet
    ],
  },
};

export function getAllTimeFarcasterMessagesTally(array: any[], pointsPer: number, chain: Chain) {
  const mentions = mentionsCriteria[chain?.name as keyof typeof mentionsCriteria]?.fids;

  return getAllTimeFarcasterMessages(array, mentions).length * pointsPer;
}

export function getYearlyFarcasterMessagesTally(array: any[], pointsPer: number, chain: Chain, year: number) {
  const mentions = mentionsCriteria[chain?.name as keyof typeof mentionsCriteria]?.fids;
  return getYearlyFarcasterMessages(array, year, mentions).length * pointsPer;
}

export function getMonthlyFarcasterMessagesTally(
  array: any[],
  pointsPer: number,
  chain: Chain,
  year: number,
  month: number,
) {
  const mentions = mentionsCriteria[chain?.name as keyof typeof mentionsCriteria]?.fids;
  return getMonthlyFarcasterMessages(array, year, month, mentions).length * pointsPer;
}

export function getDailyFarcasterMessagesTally(
  array: any[],
  pointsPer: number,
  chain: Chain,
  year: number,
  month: number,
  day: number,
) {
  const mentions = mentionsCriteria[chain?.name as keyof typeof mentionsCriteria]?.fids;
  return getDailyFarcasterMessage(array, year, month, day, mentions).length * pointsPer;
}

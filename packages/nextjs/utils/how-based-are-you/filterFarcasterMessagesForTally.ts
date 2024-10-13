// import { getTallyForFilteredArray } from "./getTallyForFilteredArray";

const FARCASTER_START_EPOCH = 1609459200;

function getIsPresent(mentionsCriteria: any[] = [], mention: any) {
  let isPresent = false;

  for (let j = 0; j < mentionsCriteria.length; j++) {
    if (mention === mentionsCriteria[j]) {
      isPresent = true;
    }
  }

  return isPresent;
}

function areAnyMentionsPresent(mentionsCriteria: any[] = [], observedMentions: any[] = []) {
  let isPresent = false;

  for (let i = 0; i < observedMentions.length; i++) {
    isPresent = getIsPresent(mentionsCriteria, observedMentions[i]);
  }
  return isPresent;
}

export function getAllTimeFarcasterMessages(array: any[], criteria: any[] = []) {
  return array.filter(element => {
    return areAnyMentionsPresent(criteria, element.data.castAddBody?.mentions);
  });
}

export function getYearlyFarcasterMessages(array: any[], year: number, criteria: any[] = []) {
  return array.filter(element => {
    const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);
    return areAnyMentionsPresent(criteria, element.data.castAddBody?.mentions) && date.getFullYear() === year;
  });
}

export function getMonthlyFarcasterMessages(array: any[], year: number, month: number, criteria: any[] = []) {
  return array.filter(element => {
    const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);
    return (
      areAnyMentionsPresent(criteria, element.data.castAddBody?.mentions) &&
      date.getFullYear() === year &&
      date.getMonth() + 1 === month
    );
  });
}

export function getDailyFarcasterMessage(array: any[], year: number, month: number, day: number, criteria: any[] = []) {
  return array.filter(element => {
    const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);

    return (
      areAnyMentionsPresent(criteria, element.data.castAddBody?.mentions) &&
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    );
  });
}

export function getAllTimeFarcasterMessagesTally(array: any[], pointsPer: number, criteria: any[] = []) {
  return getAllTimeFarcasterMessages(array, criteria).length * pointsPer;
}

export function getYearlyFarcasterMessagesTally(array: any[], pointsPer: number, criteria: any[] = [], year: number) {
  return getYearlyFarcasterMessages(array, year, criteria).length * pointsPer;
}

export function getMonthlyFarcasterMessagesTally(
  array: any[],
  pointsPer: number,
  criteria: any[] = [],
  year: number,
  month: number,
) {
  return getMonthlyFarcasterMessages(array, year, month, criteria).length * pointsPer;
}

export function getDailyFarcasterMessagesTally(
  array: any[],
  pointsPer: number,
  criteria: any[] = [],
  year: number,
  month: number,
  day: number,
) {
  return getDailyFarcasterMessage(array, year, month, day, criteria).length * pointsPer;
}

//https://warpcast.com/~/channel/base
export function getAllTimeFarcasterMessagesInSpecificChannel(array: any[], criteria: any[] = []) {
  return array.filter(element => {
    return getIsPresent(criteria, element.data.castAddBody?.parentUrl);
  });
}

export function getYearlyFarcasterMessagesInSpecificChannel(array: any[], year: number, criteria: any[] = []) {
  return array.filter(element => {
    const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);
    return getIsPresent(criteria, element.data.castAddBody?.parentUrl) && date.getFullYear() === year;
  });
}

export function getMonthlyFarcasterMessagesInSpecificChannel(
  array: any[],
  year: number,
  month: number,
  criteria: any[] = [],
) {
  return array.filter(element => {
    const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);
    return (
      getIsPresent(criteria, element.data.castAddBody?.parentUrl) &&
      date.getFullYear() === year &&
      date.getMonth() + 1 === month
    );
  });
}

export function getDailyFarcasterMessageInSpecificChannel(
  array: any[],
  year: number,
  month: number,
  day: number,
  criteria: any[] = [],
) {
  return array.filter(element => {
    const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);

    return (
      getIsPresent(criteria, element.data.castAddBody?.parentUrl) &&
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    );
  });
}

export function getAllTimeFarcasterMessagesInSpecificChannelTally(
  array: any[],
  pointsPer: number,
  criteria: any[] = [],
) {
  return getAllTimeFarcasterMessagesInSpecificChannel(array, criteria).length * pointsPer;
}

export function getYearlyFarcasterMessagesInSpecificChannelTally(
  array: any[],
  pointsPer: number,
  criteria: any[] = [],
  year: number,
) {
  return getYearlyFarcasterMessagesInSpecificChannel(array, year, criteria).length * pointsPer;
}

export function getMonthlyFarcasterMessagesInSpecificChannelTally(
  array: any[],
  pointsPer: number,
  criteria: any[] = [],
  year: number,
  month: number,
) {
  return getMonthlyFarcasterMessagesInSpecificChannel(array, year, month, criteria).length * pointsPer;
}

export function getDailyFarcasterMessagesInSpecificChannelTally(
  array: any[],
  pointsPer: number,
  criteria: any[] = [],
  year: number,
  month: number,
  day: number,
) {
  return getDailyFarcasterMessageInSpecificChannel(array, year, month, day, criteria).length * pointsPer;
}

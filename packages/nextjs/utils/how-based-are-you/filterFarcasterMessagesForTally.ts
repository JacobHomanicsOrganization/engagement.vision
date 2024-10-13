// import { getTallyForFilteredArray } from "./getTallyForFilteredArray";

const FARCASTER_START_EPOCH = 1609459200;

function areAnyMentionsPresent(mentionsCriteria: any[] = [], observedMentions: any[] = []) {
  let isPresent = false;

  for (let i = 0; i < observedMentions.length; i++) {
    for (let j = 0; j < mentionsCriteria.length; j++) {
      if (observedMentions[i] === mentionsCriteria[j]) {
        isPresent = true;
      }
    }
  }
  return isPresent;
}

export function getAllTimeFarcasterMessages(array: any[], mentions: any[] = []) {
  return array.filter(element => {
    return areAnyMentionsPresent(mentions, element.data.castAddBody?.mentions);
  });
}

export function getYearlyFarcasterMessages(array: any[], year: number, mentions: any[] = []) {
  return array.filter(element => {
    const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);
    return areAnyMentionsPresent(mentions, element.data.castAddBody?.mentions) && date.getFullYear() === year;
  });
}

export function getMonthlyFarcasterMessages(array: any[], year: number, month: number, mentions: any[] = []) {
  return array.filter(element => {
    const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);
    return (
      areAnyMentionsPresent(mentions, element.data.castAddBody?.mentions) &&
      date.getFullYear() === year &&
      date.getMonth() + 1 === month
    );
  });
}

export function getDailyFarcasterMessage(array: any[], year: number, month: number, day: number, mentions: any[] = []) {
  return array.filter(element => {
    const date = new Date((FARCASTER_START_EPOCH + element.data.timestamp) * 1000);

    return (
      areAnyMentionsPresent(mentions, element.data.castAddBody?.mentions) &&
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    );
  });
}

export function getAllTimeFarcasterMessagesTally(array: any[], pointsPer: number, mentions: any[] = []) {
  return getAllTimeFarcasterMessages(array, mentions).length * pointsPer;
}

export function getYearlyFarcasterMessagesTally(array: any[], pointsPer: number, mentions: any[] = [], year: number) {
  return getYearlyFarcasterMessages(array, year, mentions).length * pointsPer;
}

export function getMonthlyFarcasterMessagesTally(
  array: any[],
  pointsPer: number,
  mentions: any[] = [],
  year: number,
  month: number,
) {
  return getMonthlyFarcasterMessages(array, year, month, mentions).length * pointsPer;
}

export function getDailyFarcasterMessagesTally(
  array: any[],
  pointsPer: number,
  mentions: any[] = [],
  year: number,
  month: number,
  day: number,
) {
  return getDailyFarcasterMessage(array, year, month, day, mentions).length * pointsPer;
}

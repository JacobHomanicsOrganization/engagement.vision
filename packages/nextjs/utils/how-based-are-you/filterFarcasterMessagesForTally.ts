// import { getTallyForFilteredArray } from "./getTallyForFilteredArray";

const FARCASTER_START_EPOCH = 1609459200;

export function getIsPresent(mentionsCriteria: any[] = [], mention: any) {
  let isPresent = false;

  for (let j = 0; j < mentionsCriteria.length; j++) {
    if (mention === mentionsCriteria[j]) {
      isPresent = true;
    }
  }

  return isPresent;
}

export function areAnyMentionsPresent(mentionsCriteria: any[] = [], observedMentions: any[] = []) {
  let isPresent = false;

  for (let i = 0; i < observedMentions.length; i++) {
    isPresent = getIsPresent(mentionsCriteria, observedMentions[i]);
  }
  return isPresent;
}

function getFarcasterDate(farcasterMessageTimestamp: number) {
  return new Date((FARCASTER_START_EPOCH + farcasterMessageTimestamp) * 1000);
}

export function isWithinYear(farcasterMessageTimestamp: number, year: number) {
  const date = getFarcasterDate(farcasterMessageTimestamp);
  return date.getFullYear() === year;
}

export function isWithinMonth(farcasterMessageTimestamp: number, year: number, month: number) {
  const date = getFarcasterDate(farcasterMessageTimestamp);
  return date.getFullYear() === year && date.getMonth() + 1 === month;
}

export function isWithinDay(farcasterMessageTimestamp: number, year: number, month: number, day: number) {
  const date = getFarcasterDate(farcasterMessageTimestamp);
  return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}

//
//
// Mentions
//
//

// export function getAllTimeFarcasterMessages(array: any[], criteria: any[] = []) {
//   return array.filter(element => {
//     return areAnyMentionsPresent(criteria, element.data.castAddBody?.mentions);
//   });
// }

// export function getYearlyFarcasterMessages(array: any[], year: number, criteria: any[] = []) {
//   return array.filter(element => {
//     return (
//       areAnyMentionsPresent(criteria, element.data.castAddBody?.mentions) && isWithinYear(element.data.timestamp, year)
//     );
//   });
// }

// export function getMonthlyFarcasterMessages(array: any[], year: number, month: number, criteria: any[] = []) {
//   return array.filter(element => {
//     return (
//       areAnyMentionsPresent(criteria, element.data.castAddBody?.mentions) &&
//       isWithinMonth(element.data.timestamp, year, month)
//     );
//   });
// }

// export function getAllTimeFarcasterMessagesTally(array: any[], pointsPer: number, criteria: any[] = []) {
//   return getAllTimeFarcasterMessages(array, criteria).length * pointsPer;
// }

// export function getYearlyFarcasterMessagesTally(array: any[], pointsPer: number, criteria: any[] = [], year: number) {
//   return getYearlyFarcasterMessages(array, year, criteria).length * pointsPer;
// }

// export function getMonthlyFarcasterMessagesTally(
//   array: any[],
//   pointsPer: number,
//   criteria: any[] = [],
//   year: number,
//   month: number,
// ) {
//   return getMonthlyFarcasterMessages(array, year, month, criteria).length * pointsPer;
// }

// // export function getDailyFarcasterMessagesTally(
// //   array: any[],
// //   pointsPer: number,
// //   criteria: any[] = [],
// //   year: number,
// //   month: number,
// //   day: number,
// // ) {
// //   return getDailyFarcasterMessage(array, year, month, day, criteria).length * pointsPer;
// // }

// //
// //
// // Channels
// //
// //
// export function getAllTimeFarcasterMessagesInSpecificChannel(array: any[], criteria: any[] = []) {
//   return array.filter(element => {
//     return getIsPresent(criteria, element.data.castAddBody?.parentUrl);
//   });
// }

// export function getYearlyFarcasterMessagesInSpecificChannel(array: any[], year: number, criteria: any[] = []) {
//   return array.filter(element => {
//     return getIsPresent(criteria, element.data.castAddBody?.parentUrl) && isWithinYear(element.data.timestamp, year);
//   });
// }

// export function getMonthlyFarcasterMessagesInSpecificChannel(
//   array: any[],
//   year: number,
//   month: number,
//   criteria: any[] = [],
// ) {
//   return array.filter(element => {
//     return (
//       getIsPresent(criteria, element.data.castAddBody?.parentUrl) && isWithinMonth(element.data.timestamp, year, month)
//     );
//   });
// }

// export function getAllTimeFarcasterMessagesInSpecificChannelTally(
//   array: any[],
//   pointsPer: number,
//   criteria: any[] = [],
// ) {
//   return getAllTimeFarcasterMessagesInSpecificChannel(array, criteria).length * pointsPer;
// }

// export function getYearlyFarcasterMessagesInSpecificChannelTally(
//   array: any[],
//   pointsPer: number,
//   criteria: any[] = [],
//   year: number,
// ) {
//   return getYearlyFarcasterMessagesInSpecificChannel(array, year, criteria).length * pointsPer;
// }

// export function getMonthlyFarcasterMessagesInSpecificChannelTally(
//   array: any[],
//   pointsPer: number,
//   criteria: any[] = [],
//   year: number,
//   month: number,
// ) {
//   return getMonthlyFarcasterMessagesInSpecificChannel(array, year, month, criteria).length * pointsPer;
// }

// // export function getDailyFarcasterMessagesInSpecificChannelTally(
// //   array: any[],
// //   pointsPer: number,
// //   criteria: any[] = [],
// //   year: number,
// //   month: number,
// //   day: number,
// // ) {
// //   return getDailyFarcasterMessageInSpecificChannel(array, year, month, day, criteria).length * pointsPer;
// // }

// export function getAllTimeFarcasterMessages2(
//   array: any[],
//   checks: Array<(element: any, year: number, month: number, day: number) => boolean>,
// ) {
//   return array.filter(element => {
//     return checks.every(check => check(element, year, month, day));
//   });
// }

// export function getYearlyFarcasterMessages2(
//   array: any[],
//   year: number,
//   month: number,
//   day: number,
//   checks: Array<(element: any, year: number, month: number, day: number) => boolean>,
// ) {
//   return array.filter(element => {
//     return checks.every(check => check(element, year, month, day));
//   });
// }

// export function getMonthlyFarcasterMessages2(
//   array: any[],
//   year: number,
//   month: number,
//   day: number,
//   checks: Array<(element: any, year: number, month: number, day: number) => boolean>,
// ) {
//   return array.filter(element => {
//     return checks.every(check => check(element, year, month, day));
//   });
// }

export function getDailyFarcasterMessages2(array: any[], checks: Array<(element: any) => boolean>) {
  return array.filter(element => {
    return checks.every(check => check(element));
  });
}

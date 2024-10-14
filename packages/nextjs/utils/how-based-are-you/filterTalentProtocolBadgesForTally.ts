// import { getTallyForFilteredArray } from "./getTallyForFilteredArray";

// export function getAllTimeTalentProtocolBadgesTally(array: any[], pointsPer: number) {
//   return getTallyForFilteredArray(array, pointsPer, (element: any) => {
//     return element["onchain_at"] !== null;
//   });
// }

// export function getYearlyTalentProtocolBadgesTally(array: any[], pointsPer: number, year: number) {
//   return getTallyForFilteredArray(array, pointsPer, (element: any) => {
//     const date = new Date(element["onchain_at"]);
//     return date.getFullYear() === year;
//   });
// }

// export function getMonthlyTalentProtocolBadgesTally(array: any[], pointsPer: number, year: number, month: number) {
//   return getTallyForFilteredArray(array, pointsPer, (element: any) => {
//     const date = new Date(element["onchain_at"]);
//     return date.getFullYear() === year && date.getMonth() + 1 === month;
//   });
// }

// export function getDailyTalentProtocolBadgesTally(
//   array: any[],
//   pointsPer: number,
//   year: number,
//   month: number,
//   day: number,
// ) {
//   return getTallyForFilteredArray(array, pointsPer, (element: any) => {
//     const date = new Date(element["onchain_at"]);
//     return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
//   });
// }

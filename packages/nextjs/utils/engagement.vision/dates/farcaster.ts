export const FARCASTER_START_EPOCH = 1609459200;

export function getFarcasterDate(timestamp: number) {
  return new Date((FARCASTER_START_EPOCH + timestamp) * 1000);
}

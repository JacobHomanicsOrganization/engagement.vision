import * as chains from "viem/chains";
import { Chain } from "viem/chains";

export function getChainByName(name: string) {
  const chain = chains[name as keyof typeof chains];

  return { chain, isError: chain === undefined };
}

export function getAllChains() {
  const allChains: Chain[] = [];

  Object.entries(chains).forEach(chain => {
    allChains.push(chain as any);
  });

  return allChains;
}

import * as chains from "viem/chains";
import { Chain } from "viem/chains";

export function getChainByName(name: string) {
  return chains[name as keyof typeof chains];
}

export function getAllChains() {
  const allChains: Chain[] = [];

  Object.entries(chains).forEach(chain => {
    allChains.push(chain as any);
  });

  return allChains;
}

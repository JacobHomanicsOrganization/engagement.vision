import { Chain, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { getEnsAddress as coreGetEnsAddress, getEnsName as coreGetEnsName } from "viem/ens";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

export function isEnsName(ensName: string) {
  if (!ensName) return false;

  return ensName.endsWith(".eth");
}

export async function getEnsName(address: string, chain?: Chain) {
  chain = chain ? chain : mainnet;

  const publicClient = createPublicClient({
    chain: chain,
    transport: http(getAlchemyHttpUrl(chain.id)),
  });

  const ensName = await coreGetEnsName(publicClient, { address });
  return ensName;
}

export async function getEnsAddress(ensName: string, chain?: Chain) {
  chain = chain ? chain : mainnet;

  const publicClient = createPublicClient({
    chain: chain,
    transport: http(getAlchemyHttpUrl(chain.id)),
  });

  const address = await coreGetEnsAddress(publicClient, { name: ensName });
  return address;
}

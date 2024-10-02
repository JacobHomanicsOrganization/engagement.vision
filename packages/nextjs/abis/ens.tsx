import { Chain, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import {
  getEnsAddress as coreGetEnsAddress,
  getEnsAvatar as coreGetEnsAvatar,
  getEnsName as coreGetEnsName,
  getEnsText as coreGetEnsText,
} from "viem/ens";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

export function isEnsName(ensName: string) {
  if (!ensName) return false;

  const periodCount = (ensName.match(/\./g) || []).length;

  return (periodCount === 1 && ensName.endsWith(".eth")) || (periodCount === 1 && ensName.endsWith(".xyz"));
}

export async function getEnsName(address: string, chain: Chain = mainnet) {
  console.log(chain);
  const publicClient = createPublicClient({
    chain: chain,
    transport: http(getAlchemyHttpUrl(chain.id)),
  });

  console.log("pre ens");
  const ensName = await coreGetEnsName(publicClient, { address });
  console.log(ensName);
  return ensName;
}

export async function getEnsAvatar(name: string, chain: Chain = mainnet) {
  const publicClient = createPublicClient({
    chain: chain,
    transport: http(getAlchemyHttpUrl(chain.id)),
  });

  const result = await coreGetEnsAvatar(publicClient, { name });
  return result;
}

export async function getEnsDescription(name: string, chain: Chain = mainnet) {
  const publicClient = createPublicClient({
    chain: chain,
    transport: http(getAlchemyHttpUrl(chain.id)),
  });

  const result = await coreGetEnsText(publicClient, { name, key: "description" });
  return result;
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

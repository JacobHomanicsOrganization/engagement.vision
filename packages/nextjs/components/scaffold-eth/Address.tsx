"use client";

import { useEffect, useState } from "react";
import { AddressRaw } from "./AddressRaw";
import { Address as AddressType, getAddress, isAddress } from "viem";
import { normalize } from "viem/ens";
import { useEnsAvatar, useEnsName } from "wagmi";
import { Basename, getBasename, getBasenameAvatar } from "~~/abis/basenames";
import { isEnsName } from "~~/abis/ens";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

type AddressProps = {
  address?: AddressType;
  disableAddressLink?: boolean;
  format?: "short" | "long";
  ensType?: "ens" | "basename";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
};

/**
 * Displays an address (or ENS) with a Blockie image and option to copy address.
 */
export const Address = ({ address, disableAddressLink, format, size = "base" }: AddressProps) => {
  const [ens, setEns] = useState<string | null>();
  const [ensAvatar, setEnsAvatar] = useState<string | null>();
  const checkSumAddress = address ? getAddress(address) : undefined;

  const { targetNetwork } = useTargetNetwork();

  const { data: fetchedEns } = useEnsName({
    address: checkSumAddress,
    chainId: 1,
    query: {
      enabled: isAddress(checkSumAddress ?? ""),
    },
  });
  const { data: fetchedEnsAvatar } = useEnsAvatar({
    name: fetchedEns ? normalize(fetchedEns) : undefined,
    chainId: 1,
    query: {
      enabled: Boolean(fetchedEns),
      gcTime: 30_000,
    },
  });

  // We need to apply this pattern to avoid Hydration errors.
  useEffect(() => {
    async function get() {
      let basename;
      if (isEnsName(fetchedEns)) setEns(fetchedEns);
      else {
        basename = await getBasename(address || "");
        setEns(basename);
      }
    }
    get();
  }, [address, fetchedEns]);

  useEffect(() => {
    async function get() {
      if (fetchedEnsAvatar !== undefined) {
        setEnsAvatar(fetchedEnsAvatar);
      } else {
        if (ens === undefined) return;

        const avatar = await getBasenameAvatar(ens as Basename);
        setEnsAvatar(avatar);
      }
    }
    get();
  }, [ens, fetchedEnsAvatar]);

  return (
    <AddressRaw
      chain={targetNetwork}
      address={checkSumAddress}
      ens={ens}
      ensAvatar={ensAvatar}
      disableAddressLink={disableAddressLink}
      format={format}
      size={size}
    />
  );
};

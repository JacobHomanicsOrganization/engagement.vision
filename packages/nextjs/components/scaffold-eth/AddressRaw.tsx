"use client";

import { useState } from "react";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Address as AddressType, Chain, isAddress } from "viem";
import { hardhat } from "viem/chains";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

type AddressProps = {
  address?: AddressType;
  chain?: Chain;
  ens?: string | null;
  ensAvatar?: string | null;
  disableAddressLink?: boolean;
  showIcon?: boolean;
  showAddress?: boolean;
  showCopy?: boolean;
  format?: "short" | "long";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
};

const blockieSizeMap = {
  xs: 6,
  sm: 7,
  base: 8,
  lg: 9,
  xl: 10,
  "2xl": 12,
  "3xl": 15,
};

/**
 * Displays an address (or ENS) with a Blockie image and option to copy address.
 */
export const AddressRaw = ({
  address,
  chain,
  ens,
  ensAvatar,
  disableAddressLink,
  showIcon = true,
  showAddress = true,
  showCopy = true,
  format,
  size = "base",
}: AddressProps) => {
  const [addressCopied, setAddressCopied] = useState(false);

  // Skeleton UI
  if (!address) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAddress(address)) {
    return <span className="text-error">Wrong address</span>;
  }

  const blockExplorerAddressLink = getBlockExplorerAddressLink(chain, address);
  let displayAddress = address?.slice(0, 6) + "..." + address?.slice(-4);

  if (ens) {
    displayAddress = ens;
  } else if (format === "long") {
    displayAddress = address;
  }

  return (
    <div className="flex items-center flex-shrink-0">
      {showIcon ? (
        <div className="flex-shrink-0">
          <BlockieAvatar
            address={address}
            ensImage={ensAvatar}
            size={(blockieSizeMap[size] * 24) / blockieSizeMap["base"]}
          />
        </div>
      ) : (
        <></>
      )}

      {showAddress ? (
        disableAddressLink ? (
          <span className={`ml-1.5 text-${size} font-normal`}>{displayAddress}</span>
        ) : chain?.id === hardhat.id ? (
          <span className={`ml-1.5 text-${size} font-normal`}>
            <Link href={blockExplorerAddressLink || ""}>{displayAddress}</Link>
          </span>
        ) : (
          <a
            className={`ml-1.5 text-${size} font-normal`}
            target="_blank"
            href={blockExplorerAddressLink}
            rel="noopener noreferrer"
          >
            {displayAddress}
          </a>
        )
      ) : (
        <></>
      )}

      {showCopy ? (
        addressCopied ? (
          <CheckCircleIcon
            className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer flex-shrink-0"
            aria-hidden="true"
          />
        ) : (
          <CopyToClipboard
            text={address}
            onCopy={() => {
              setAddressCopied(true);
              setTimeout(() => {
                setAddressCopied(false);
              }, 800);
            }}
          >
            <DocumentDuplicateIcon
              className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer flex-shrink-0"
              aria-hidden="true"
            />
          </CopyToClipboard>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { getChainByName } from "~~/utils/how-based-are-you/viemHelpers";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

function getProperGlasses(isDarkMode: boolean) {
  return isDarkMode ? "meeple-circle-white.png" : "meeple-circle.svg";
}

const chainObjs = {
  app: {
    logo: (isDarkMode: boolean) => {
      return getProperGlasses(isDarkMode);
    },
    link: "/",
  },
  mainnet: {
    logo: "ethereum-eth.svg",
    link: "https://ethereum.org",
  },
  base: {
    logo: "Base_Network_Logo.svg",
    link: "https://base.org",
  },
  arbitrum: {
    logo: "arbitrum-arb-logo.png",
    link: "https://arbitrum.foundation",
  },
  optimism: {
    logo: "optimism-ethereum-op-logo.png",
    link: "https://optimism.io",
  },
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  // {
  //   label: "Debug Contracts",
  //   href: "/debug",
  //   icon: <BugAntIcon className="h-4 w-4" />,
  // },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const appTheme = useGlobalState(({ appTheme }) => appTheme);
  const chainObj = chainObjs[appTheme as keyof typeof chainObjs] as any;
  const { chain } = getChainByName(appTheme || "");

  const { resolvedTheme } = useTheme();

  const isDarkMode = resolvedTheme?.includes("dark");

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>

        {chainObj?.logo ? (
          <div className="flex relative w-10 h-10">
            <Link href={chainObj?.link || ""} target="#" passHref className="gap-2 ml-4 mr-6 shrink-0">
              <Image
                alt="Logo"
                className="cursor-pointer"
                fill
                src={`/${appTheme === "app" ? chainObj?.logo(isDarkMode) : chainObj?.logo || ""}`}
              />
            </Link>
          </div>
        ) : (
          <></>
        )}

        <div className="flex flex-col">
          {chain?.name ? (
            <>
              {chainObj?.link ? (
                <span className="font-bold leading-tight">
                  <Link href={chainObj?.link || ""} target="#" passHref className="ml-4 mr-6 shrink-0">
                    {chain?.name}
                  </Link>
                </span>
              ) : (
                <span className="font-bold leading-tight">{chain?.name}</span>
              )}

              <span className="text-xs">
                <Link href="/" passHref className={`${chainObj?.logo ? "ml-4" : ""} mr-6 shrink-0`}>
                  Engagement.Vision
                </Link>
              </span>
            </>
          ) : (
            <>
              <span className="font-bold leading-tight">
                <Link href="/" passHref className={`${chainObj?.logo ? "ml-4" : ""} mr-6 shrink-0`}>
                  Engagement.Vision
                </Link>
              </span>
            </>
          )}
        </div>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end flex-grow mr-4">
        {/* <RainbowKitCustomConnectButton /> */}
        <FaucetButton />
      </div>
    </div>
  );
};

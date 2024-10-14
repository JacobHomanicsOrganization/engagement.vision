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

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

function getProperGlasses(isDarkMode: boolean) {
  return isDarkMode ? "meeple-circle-white.png" : "meeple-circle.png";
}

const communities = {
  app: {
    logo: (isDarkMode: boolean) => {
      return getProperGlasses(isDarkMode);
    },
    link: "/",
  },
  mainnet: {
    name: "Ethereum",
    logo: "ethereum-eth.svg",
    link: "https://ethereum.org",
  },
  base: {
    name: "Base",
    logo: "Base_Network_Logo.svg",
    link: "https://base.org",
  },
  arbitrum: {
    name: "Arbitrum",
    logo: "arbitrum-arb-logo.png",
    link: "https://arbitrum.foundation",
  },
  optimism: {
    name: "Optimism",
    logo: "optimism-ethereum-op-logo.png",
    link: "https://optimism.io",
  },
  nouns: {
    name: "Nouns",
    logo: "noggles.svg",
    link: "https://nouns.wtf/",
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
  const community = communities[appTheme as keyof typeof communities] as any;

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

        {community?.logo ? (
          <div className="flex relative w-10 h-10">
            <Link href={community?.link || ""} target="#" passHref className="gap-2 ml-4 mr-6 shrink-0">
              <Image
                alt="Logo"
                className="cursor-pointer"
                fill
                src={`/${appTheme === "app" ? community?.logo(isDarkMode) : community?.logo || ""}`}
              />
            </Link>
          </div>
        ) : (
          <></>
        )}

        <div className="flex flex-col">
          {community?.name ? (
            <>
              {community?.link ? (
                <span className="font-bold leading-tight">
                  <Link href={community?.link || ""} target="#" passHref className="ml-4 mr-6 shrink-0">
                    {community?.name}
                  </Link>
                </span>
              ) : (
                <span className="font-bold leading-tight">{community?.name}</span>
              )}

              <span className="text-xs">
                <Link href="/" passHref className={`${community?.logo ? "ml-4" : ""} mr-6 shrink-0`}>
                  Engagement.Vision
                </Link>
              </span>
            </>
          ) : (
            <>
              <span className="font-bold leading-tight">
                <Link href="/" passHref className={`${community?.logo ? "ml-4" : ""} mr-6 shrink-0`}>
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

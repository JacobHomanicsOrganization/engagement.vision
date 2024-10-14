"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { communitiesConfig } from "~~/engagement.config";
import { useGlobalState } from "~~/services/store/store";

export const SwitchTheme = ({ className }: { className?: string }) => {
  const appTheme = useGlobalState(({ appTheme }) => appTheme);
  const community = communitiesConfig[appTheme as keyof typeof communitiesConfig];

  console.log(community);

  const { setTheme, resolvedTheme } = useTheme();

  const isDarkMode = resolvedTheme?.includes("dark");

  useEffect(() => {
    if (community?.themes?.light === undefined || community?.themes?.dark === undefined) return;

    setTheme(isDarkMode ? community.themes?.dark : community.themes?.light);
  }, [isDarkMode, setTheme, community?.themes?.dark, community?.themes?.light]);
  const handleToggle = () => {
    setTheme(isDarkMode ? community.themes?.light || "light" : community.themes?.dark || "dark");
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;

    setMounted(true);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className={`flex space-x-2 h-8 items-center justify-center text-sm ${className}`}>
      <input
        id="theme-toggle"
        type="checkbox"
        className="toggle toggle-primary bg-primary hover:bg-primary border-primary"
        onChange={handleToggle}
        checked={isDarkMode}
      />
      <label htmlFor="theme-toggle" className={`swap swap-rotate ${!isDarkMode ? "swap-active" : ""}`}>
        <SunIcon className="swap-on h-5 w-5" />
        <MoonIcon className="swap-off h-5 w-5" />
      </label>
    </div>
  );
};

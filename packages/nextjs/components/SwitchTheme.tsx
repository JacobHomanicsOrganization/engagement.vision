"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useGlobalState } from "~~/services/store/store";

const chainObjs = {
  base: {
    light: "light",
    dark: "dark",
  },
  arbitrum: {
    light: "lightArbitrum",
    dark: "darkArbitrum",
  },
};

export const SwitchTheme = ({ className }: { className?: string }) => {
  const targetPageChain = useGlobalState(({ targetPageChain }) => targetPageChain);
  const chainObj = chainObjs[targetPageChain as keyof typeof chainObjs];

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // const [isDarkMode, setIsDarkMode] = useState(true);

  const isDarkMode = resolvedTheme?.includes("dark");

  console.log(resolvedTheme);

  // useEffect(() => {
  //   if (resolvedTheme === undefined) return;

  //   console.log(resolvedTheme);
  //   setIsDarkMode(resolvedTheme.includes("dark"));
  // }, [resolvedTheme]);

  console.log(resolvedTheme);
  console.log(isDarkMode);

  const [isThemeMounted, setIsThemeMounted] = useState(false);

  useEffect(() => {
    if (chainObj?.light === undefined || chainObj?.dark === undefined) return;

    if (isThemeMounted) return;

    setIsThemeMounted(true);

    setTheme(isDarkMode ? chainObj.dark : chainObj.light);
  }, [isThemeMounted, isDarkMode, setTheme, chainObj?.dark, chainObj?.light]);
  const handleToggle = () => {
    setTheme(isDarkMode ? chainObj.light : chainObj.dark);
  };

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

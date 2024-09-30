"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useGlobalState } from "~~/services/store/store";

const appThemes = {
  app: {
    light: "light",
    dark: "dark",
  },
  base: {
    light: "lightBase",
    dark: "darkBase",
  },
  arbitrum: {
    light: "lightArbitrum",
    dark: "darkArbitrum",
  },
  optimism: {
    light: "lightOptimism",
    dark: "darkOptimism",
  },
};

export const SwitchTheme = ({ className }: { className?: string }) => {
  const targetPageChain = useGlobalState(({ appTheme }) => appTheme);
  const chainObj = appThemes[targetPageChain as keyof typeof appThemes];

  const { setTheme, resolvedTheme } = useTheme();

  const isDarkMode = resolvedTheme?.includes("dark");

  useEffect(() => {
    if (chainObj?.light === undefined || chainObj?.dark === undefined) return;

    setTheme(isDarkMode ? chainObj.dark : chainObj.light);
  }, [isDarkMode, setTheme, chainObj?.dark, chainObj?.light]);
  const handleToggle = () => {
    setTheme(isDarkMode ? chainObj.light : chainObj.dark);
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

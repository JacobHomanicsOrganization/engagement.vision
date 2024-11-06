"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import type { NextPage } from "next";
import { useGlobalState } from "~~/services/store/store";

const Playground: NextPage = () => {
  const setAppTheme = useGlobalState(({ setAppTheme }) => setAppTheme);

  useEffect(() => {
    setAppTheme("engagement.vision");
  }, [setAppTheme]);

  useEffect(() => {
    getKarma();
  }, []);
  async function getKarma() {
    const grants = await axios.get(
      "https://gapapi.karmahq.xyz/grantees/0x5A4830885f12438E00D8f4d98e9Fe083e707698C/grants",
    );

    const projects = await axios.get(
      "https://gapapi.karmahq.xyz/grantees/0x5A4830885f12438E00D8f4d98e9Fe083e707698C/projects",
    );

    const communities = await axios.get(
      "https://gapapi.karmahq.xyz/grantees/0x5A4830885f12438E00D8f4d98e9Fe083e707698C/communities",
    );

    const communitiesAdmin = await axios.get(
      "https://gapapi.karmahq.xyz/grantees/0x23B7A53ecfd93803C63b97316D7362eae59C55B6/communities/admin",
    );

    setGapData({
      grantees: {
        grants,
        projects,
        communities,
        communitiesAdmin,
      },
    });
  }

  const [gapData, setGapData] = useState<any>();
  console.log(gapData);

  const validationChecks = [
    {
      grantee: [
        [
          { grants: { checks: [{ chainId: 10, createdAt: "12/02/1996" }] } },
          { projects: { checks: [{ chainId: 10, createdAt: "12/02/1996" }] } },
        ],
        [{ grants: { checks: [{ chainId: 10, createdAt: "12/02/1996" }] } }],
      ],
      community: [
        [
          { grants: { checks: [{ chainId: 10, createdAt: "12/02/1996" }] } },
          { projects: { checks: [{ chainId: 10, createdAt: "12/02/1996" }] } },
        ],
        [{ grants: { checks: [{ chainId: 10, createdAt: "12/02/1996" }] } }],
      ],
    },
    {
      grantee: [
        [
          {
            grants: {
              checks: [{ chainId: 10, createdAt: "12/02/1996" }],
            },
          },
        ],
      ],
    },
  ];

  async function buildKarma() {
    validationChecks.forEach((check: any) => {
      if (check.grantee) {
        if (check.grants) {
        }
      }

      if (check.community) {
      }

      console.log(check);
    });
  }

  buildKarma();

  return <></>;
};

export default Playground;

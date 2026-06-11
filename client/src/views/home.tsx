"use client";

import { useQuery } from "@tanstack/react-query";
import { HomepageCategories } from "../components/homepage-categories/homepage-categories";
import { HomePageItems } from "../components/homepage-items/homepage-items";
import { Search } from "../components/search/search";
import { DonateBloodBanner } from "../components/donate-blood-banner/donate-blood-banner";
import { searchProviders } from "../lib/api/providers";

export const HomePage = () => {
  const { data: clinics = [] } = useQuery({
    queryKey: ["providers", "home-clinics"],
    queryFn: () => searchProviders({ type: "clinic" }),
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ["providers", "home-doctors"],
    queryFn: () => searchProviders({ type: "doctor" }),
  });

  return (
    <div>
      <Search />
      <HomepageCategories />
      <HomePageItems
        title="Disa nga Spitalet dhe Klinikat"
        link={{ label: "Te gjitha klinikat", type: "clinic" }}
        items={clinics.slice(0, 4)}
      />
      <DonateBloodBanner />
      <HomePageItems
        title="Disa nga Doktoret"
        link={{ label: "Te gjithe doktoret", type: "doctor" }}
        items={doctors.slice(0, 4)}
      />
    </div>
  );
};

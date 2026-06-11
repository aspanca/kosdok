"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useServices } from "../../lib/hooks/use-services";
import { useCities } from "../../lib/hooks/use-cities";

export const SearchForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: services = [] } = useServices();
  const { data: cities = [] } = useCities();
  const [query, setQuery] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (serviceId) params.set("serviceId", String(Number(serviceId)));
    if (city) params.set("city", city);
    const qs = params.toString();
    router.push(qs ? `/results?${qs}` : "/results");
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchForm.placeholder")}
            aria-label={t("searchForm.submit")}
            className="h-12 text-base"
          />
        </div>

        {/* Category Select - from backend */}
        <div className="sm:w-48">
          <Select value={serviceId} onValueChange={setServiceId}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t("searchForm.categoryPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {services.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Select - from backend */}
        <div className="sm:w-44">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t("searchForm.locationPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-4">
        <Button
          type="submit"
          className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {t("searchForm.submit")}
        </Button>
      </div>
    </form>
  );
};

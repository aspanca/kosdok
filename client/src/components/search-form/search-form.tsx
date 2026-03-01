import { useNavigate } from "@tanstack/react-router";
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

export const SearchForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/results" });
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            placeholder={t("searchForm.placeholder")}
            aria-label={t("searchForm.submit")}
            className="h-12 text-base"
          />
        </div>

        {/* Category Select */}
        <div className="sm:w-48">
          <Select>
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t("searchForm.categoryPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cardiology">Kardiologji</SelectItem>
              <SelectItem value="orthopedics">Ortopedi</SelectItem>
              <SelectItem value="neurology">Neurologji</SelectItem>
              <SelectItem value="dermatology">Dermatologji</SelectItem>
              <SelectItem value="pediatrics">Pediatri</SelectItem>
              <SelectItem value="radiology">Radiologji</SelectItem>
              <SelectItem value="urology">Urologji</SelectItem>
              <SelectItem value="gastroenterology">Gastroenterologji</SelectItem>
              <SelectItem value="ophthalmology">Oftalmologji</SelectItem>
              <SelectItem value="gynecology">Gjinekologji</SelectItem>
              <SelectItem value="anesthesiology">Anesteziologji</SelectItem>
              <SelectItem value="oncology">Onkologji</SelectItem>
              <SelectItem value="emergency">Emergjencë</SelectItem>
              <SelectItem value="psychiatry">Psikiatri</SelectItem>
              <SelectItem value="endocrinology">Endokrinologji</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Select */}
        <div className="sm:w-44">
          <Select>
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t("searchForm.locationPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prishtina">Prishtina</SelectItem>
              <SelectItem value="prizren">Prizren</SelectItem>
              <SelectItem value="gjakova">Gjakova</SelectItem>
              <SelectItem value="peja">Peja</SelectItem>
              <SelectItem value="mitrovica">Mitrovica</SelectItem>
              <SelectItem value="ferizaj">Ferizaj</SelectItem>
              <SelectItem value="gjilan">Gjilan</SelectItem>
              <SelectItem value="podujeva">Podujeva</SelectItem>
              <SelectItem value="fushe-kosova">Fushë Kosova</SelectItem>
              <SelectItem value="vushtrria">Vushtrria</SelectItem>
              <SelectItem value="lipjan">Lipjan</SelectItem>
              <SelectItem value="malisheva">Malisheva</SelectItem>
              <SelectItem value="skenderaj">Skenderaj</SelectItem>
              <SelectItem value="dragash">Dragash</SelectItem>
              <SelectItem value="klina">Klina</SelectItem>
              <SelectItem value="suhareka">Suhareka</SelectItem>
              <SelectItem value="decani">Deçani</SelectItem>
              <SelectItem value="kamenica">Kamenica</SelectItem>
              <SelectItem value="rahovec">Rahovec</SelectItem>
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

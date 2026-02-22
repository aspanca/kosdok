import { HomepageCategories } from "../components/homepage-categories/homepage-categories";
import { HomePageItems } from "../components/homepage-items/homepage-items";
import { Search } from "../components/search/search";

import KavajaPng from "./assets/kavaja.png";
import SpitaliAmerikan from "./assets/spitali-amerikan.png";
import VitaPng from "./assets/vita.png";
import RezonancaPng from "./assets/rezonanca.png";

import EntClinicPng from "./assets/ent-clinic.png";
import AuraClinicPng from "./assets/aura.png";
import BlueLightPng from "./assets/blue-light.png";
import LaVitaPng from "./assets/la-vita.png";
import { DonateBloodBanner } from "../components/donate-blood-banner/donate-blood-banner";

export const HomePage = () => {
  return (
    <div>
      <Search />
      <HomepageCategories />
      <HomePageItems
        title="Disa nga Spitalet"
        link={{ url: "/", label: "Te gjitha spitalet" }}
        items={[
          {
            img: SpitaliAmerikan,
            name: "Spitali Amerikan",
            location: "Prishtinë",
            schedule: {
              open: false,
            },
          },
          {
            img: KavajaPng,
            name: "Spitali Kavaja",
            location: "Kavajë",
            schedule: {
              open: false,
            },
          },
          {
            img: VitaPng,
            name: "Vita Hospital",
            location: "Tiranë",
            schedule: {
              open: true,
            },
          },
          {
            img: RezonancaPng,
            name: "Rezonanca Hospital",
            location: "Prishtinë",
            schedule: {
              open: false,
            },
          },
        ]}
      />
      <HomePageItems
        title="Disa nga Klinikat"
        link={{ url: "/", label: "Te gjitha klinikat" }}
        items={[
          {
            img: EntClinicPng,
            name: "ENT Klinika",
            location: "Prishtinë",
            schedule: {
              open: false,
            },
          },
          {
            img: AuraClinicPng,
            name: "Klinika Aura",
            location: "Kavajë",
            schedule: {
              open: true,
            },
          },
          {
            img: BlueLightPng,
            name: "Blue Light Clinic",
            location: "Tiranë",
            schedule: {
              open: true,
            },
          },
          {
            img: LaVitaPng,
            name: "Klinika - La Vita",
            location: "Prishtinë",
            schedule: {
              open: false,
            },
          },
        ]}
      />
      <DonateBloodBanner />
      <HomePageItems
        title="Disa nga Doktoret"
        link={{ url: "/", label: "Te gjithe doktoret" }}
        items={[
          {
            img: "https://png.pngtree.com/png-clipart/20230918/ourmid/pngtree-photo-men-doctor-physician-chest-smiling-png-image_10132895.png",
            name: "Agim Salihu",
            location: "Prishtinë",
            occuppation: "Psikiater",
            isDoctor: true,
          },
          {
            img: "https://www.pngplay.com/wp-content/uploads/7/Doctor-Transparent-PNG.png",
            name: "Diart Mehana",
            location: "Kavajë",
            occuppation: "Kardiolog",
            isDoctor: true,
          },
          {
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX3ZYIs3jtFKmTx7W4TRpcj2fokix4mj9f-Q&s",
            name: "Rrezarta Shkurta",
            location: "Tiranë",
            occuppation: "Urolog",
            isDoctor: true,
          },
          {
            img: "https://www.transparentpng.com/thumb/doctor/male-posing-doctor-transparent-free-0avsnl.png",
            name: "Ernest Kovolli",
            location: "Vlore",
            occuppation: "Oftalmolog",
            isDoctor: true,
          },
        ]}
      />
      <HomePageItems
        title="Disa nga Barnatoret"
        link={{ url: "/", label: "Te gjitha barnatoret" }}
        items={[
          {
            img: "https://logomakercdn.truic.com/ux-flow/industry/pharmacy-meta.png",
            name: "Barnatore Pharma",
            location: "Prishtinë",
            schedule: {
              open: false,
            },
          },
          {
            img: "https://companieslogo.com/img/orig/RDC.DE-828f7317.png?t=1720244493",
            name: "Barnatore Unik",
            location: "Kavajë",
            schedule: {
              open: true,
            },
          },
          {
            img: "https://www.codester.com/static/uploads/items/000/014/14988/preview.jpg",
            name: "Dea Pharm",
            location: "Tiranë",
            schedule: {
              open: true,
            },
          },
          {
            img: "https://png.pngtree.com/png-vector/20221229/ourmid/pngtree-pharmacy-snake-medical-bowl-png-image_6534987.png",
            name: "Rexall",
            location: "Prishtinë",
            schedule: {
              open: false,
            },
          },
        ]}
      />
    </div>
  );
};

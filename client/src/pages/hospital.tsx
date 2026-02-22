import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  ArrowLeft, 
  X,
  Monitor,
  Car,
  Accessibility,
  Shield,
  Baby,
  Siren,
  CreditCard,
  Wifi,
  Check
} from "lucide-react";
import { SocialShare } from "../components/social-share/social-share";
import { Reviews } from "../components/reviews/reviews";
import { AppointmentBooking } from "../components/appointment-booking/appointment-booking";
import { StatusBadge } from "../components/status-badge/status-badge";

import SpitaliAmerikanImg from "./assets/spitali-amerikan.png";
import VitaImg from "./assets/vita.png";
import RezonancaImg from "./assets/rezonanca.png";

const clinicImages = [
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80",
  "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80",
];

const similarClinics = [
  {
    id: 1,
    name: "Spitali Amerikan",
    city: "Prishtina",
    logo: SpitaliAmerikanImg,
    isOpen: false,
  },
  {
    id: 2,
    name: "Vita Hospital",
    city: "Prishtina",
    logo: VitaImg,
    isOpen: true,
  },
  {
    id: 3,
    name: "Q.D.T. Rezonanca",
    city: "Prishtina",
    logo: RezonancaImg,
    isOpen: true,
  },
];

const servicesData = [
  {
    name: "Alergologji",
    color: "bg-[#e3f2fd]",
    iconColor: "text-[#2196f3]",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    description: `Shërbimi i Alergologjisë dhe Imunologjisë Klinike në Spitalin Amerikan, bënë diagnostikimin, trajtimin dhe menaxhimin e sëmundjeve alergjike dhe çrregullimeve të ndryshme imunologjike.

Sëmundjet alergjike janë probleme mjaftë të shpeshta, të cilat mund të shfaqen në cilëndo periudhë të jetës, janë më të shpeshta tek fëmijët dhe tek personat më histori familjare pozitive për sëmundje alergjike. Diagnostikimi dhe trajtimi sa më i hershëm i sëmundjeve alergjike është shumë i rëndësishëm, sidomos tek fëmijët, meqenëse komplikimet mund të jenë shumë të rënda tek trajtimet jo adekute.

Ju duhet t'i drejtoheni Alergo-Imunologut, nëse keni:

– Teshtima, zënie apo shkuarja të hundëve, kruarje të hundës, syve, veshëve, qiellzës.

– Episode të shpeshta të fishkëllimave, kollitjes, frymëmarrjes së vështirësuar dhe shtrëngimit të gjoksit.

– Infeksione të shpeshta të sinuseve

– Infeksione të shpeshta të veshëve, fëmijët e vegjël pritet të kenë infeksione më të shpeshta të veshëve. Është e rëndësishme të monitorohen fëmijët më infeksione shumë të shpeshta dhe të rënda.

– Alergji në ushqime – edhe sasia shumë e vogël e ushqimit në të cilin jeni alergjik mund të shkaktojë reaksion të rrezikshem për jetë. Simptomat e alergjisë ushqimore zakonisht manifestohen në lëkurë ose përfshijnë lukthin dhe zorrët: urtikarie, skuqje e lëkurës (ekzemë), kruarje, vjellije, barkqitje, dhembje barku.

-Dermatit atopik (ekzema), është alergji e lëkurës që manifestohet me skuqje, tharje, kruarje në fytyrë, duar, bërryla, gjunjë, këmbë.

-Urtikarie-shfaqja e zonave të skuqura, te ënjtura në lëkurë, të përcjellura me kruarje, të cilat mund të kenë madhësi të ndryshme dhe shfaqen kudo në trup.

-Angioedeme- ënjttje e kapakëve të syve, buzëve, gjuhës, apo pjesëve të tjera të trupit.`,
  },
  {
    name: "Anesteziologji",
    color: "bg-[#ede7f6]",
    iconColor: "text-[#673ab7]",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    description: `Shërbimi i Anesteziologjisë në Spitalin Amerikan ofron kujdes të specializuar për pacientët që i nënshtrohen procedurave kirurgjikale.

Ekipi ynë i anesteziologëve të kualifikuar siguron që çdo pacient të ketë një përvojë të sigurt dhe pa dhimbje gjatë operacioneve.

Shërbimet tona përfshijnë:

– Anestezi të përgjithshme për operacione të mëdha
– Anestezi rajonale dhe lokale
– Menaxhimi i dhimbjes pas operacionit
– Monitorimi i vazhdueshëm i pacientit
– Konsultime para-operatore`,
  },
  {
    name: "Check Up",
    color: "bg-[#fff3e0]",
    iconColor: "text-[#ff9800]",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    description: `Programet e Check Up në Spitalin Amerikan ofrojnë një vlerësim gjithëpërfshirës të shëndetit tuaj.

Kontrollet e rregullta shëndetësore janë thelbësore për parandalimin dhe zbulimin e hershëm të sëmundjeve.

Paketat tona të Check Up përfshijnë:

– Analiza gjaku të plota
– Ekzaminime kardiologjike
– Ekografi abdominale
– Kontrolle oftalmologjike
– Vlerësim i shëndetit të përgjithshëm
– Konsultime me specialistë`,
  },
  {
    name: "Emegjenc 24orë",
    color: "bg-[#ffebee]",
    iconColor: "text-[#f44336]",
    icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    description: `Shërbimi i Urgjencës 24 orë në Spitalin Amerikan është i gatshëm të ofrojë ndihmë mjekësore të menjëhershme në çdo kohë.

Ekipi ynë i mjekëve dhe infermierëve të specializuar është i trajnuar për të trajtuar të gjitha llojet e urgjencave mjekësore.

Shërbimet tona të urgjencës përfshijnë:

– Trajtim i traumave
– Urgjenca kardiake
– Urgjenca neurologjike
– Urgjenca pediatrike
– Stabilizim dhe transport të pacientëve kritikë`,
  },
  {
    name: "Endokrinologji",
    color: "bg-[#fce4ec]",
    iconColor: "text-[#e91e63]",
    icon: "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11",
    description: `Shërbimi i Endokrinologjisë në Spitalin Amerikan specializohet në diagnostikimin dhe trajtimin e çrregullimeve hormonale.

Endokrinologët tanë trajtojnë një gamë të gjerë sëmundjesh që ndikojnë sistemin endokrin.

Kushtet që trajtojmë përfshijnë:

– Diabeti dhe çrregullimet e sheqerit në gjak
– Sëmundjet e tiroides
– Çrregullimet e gjëndrave mbiveshkore
– Osteoporoza
– Çrregullimet e rritjes
– Probleme me peshën dhe metabolizmin`,
  },
  {
    name: "Gastroenterologji",
    color: "bg-[#e3f2fd]",
    iconColor: "text-[#2196f3]",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    description: `Shërbimi i Gastroenterologjisë në Spitalin Amerikan ofron diagnostikim dhe trajtim të avancuar për sëmundjet e sistemit tretës.

Gastroenterologët tanë përdorin teknologji moderne për të diagnostikuar dhe trajtuar çrregullimet e stomakut, zorrëve, mëlçisë dhe pankreasit.

Shërbimet tona përfshijnë:

– Endoskopi dhe kolonoskopi
– Trajtimi i refluksit gastroezofageal
– Sëmundjet inflamatore të zorrëve
– Hepatologji (sëmundjet e mëlçisë)
– Diagnostikimi i kancerit të sistemit tretës`,
  },
  {
    name: "Hematologji",
    color: "bg-[#f3e5f5]",
    iconColor: "text-[#9c27b0]",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    description: `Shërbimi i Hematologjisë në Spitalin Amerikan specializohet në diagnostikimin dhe trajtimin e sëmundjeve të gjakut.

Hematologët tanë trajtojnë një gamë të gjerë çrregullimesh që ndikojnë qelizat e gjakut, palcën e eshtrave dhe sistemin limfatik.

Kushtet që trajtojmë përfshijnë:

– Anemia dhe çrregullimet e hemoglobinës
– Çrregullimet e koagulimit të gjakut
– Leukemia dhe limfomat
– Tromboza dhe çrregullimet trombotike
– Transplanti i palcës së eshtrave`,
  },
  {
    name: "Imazheri e avancuar",
    color: "bg-[#fce4ec]",
    iconColor: "text-[#e91e63]",
    icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
    description: `Departamenti i Imazherisë së Avancuar në Spitalin Amerikan ofron teknologji të fundit për diagnostikim të saktë.

Ekipi ynë i radiologëve të specializuar përdor pajisje moderne për të ofruar imazhe të qarta dhe të detajuara.

Shërbimet tona përfshijnë:

– Rezonancë Magnetike (MRI)
– Tomografi e Kompjuterizuar (CT)
– Ekografi dhe Doppler
– Mamografi dixhitale
– Radiografi konvencionale
– Fluoroskopi`,
  },
  {
    name: "Fekondimi in Vitro (IVF)",
    color: "bg-[#ffebee]",
    iconColor: "text-[#f44336]",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    description: `Qendra e Fekondimit in Vitro (IVF) në Spitalin Amerikan ofron trajtim të avancuar për çiftet që përballen me vështirësi në konceptim.

Ekipi ynë i specializuar në fertilitet përdor teknologjitë më të fundit për të ndihmuar familjet të realizojnë ëndrrën e tyre.

Shërbimet tona përfshijnë:

– Fekondimi in Vitro (IVF)
– Injektimi intracitoplazmatik i spermës (ICSI)
– Ngrirja e embrioneve dhe vezëve
– Diagnostikimi gjenetik para-implantimit
– Konsultime për fertilitet`,
  },
  {
    name: "Kardiokirurgji",
    color: "bg-[#e8f5e9]",
    iconColor: "text-[#4caf50]",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    description: `Departamenti i Kardiokirurgjisë në Spitalin Amerikan është lider në trajtimin kirurgjik të sëmundjeve të zemrës.

Kardiokirurgët tanë kryejnë procedura komplekse me rezultate të shkëlqyera dhe kohë të shkurtër rikuperimi.

Procedurat që kryejmë përfshijnë:

– Bypass i arterieve koronare (CABG)
– Zëvendësimi dhe riparimi i valvulave të zemrës
– Kirurgjia e aortës
– Kirurgjia e defekteve kongjenitale të zemrës
– Implantimi i pajisjeve kardiake`,
  },
];

type TabType = "overview" | "services" | "staff" | "schedule";

type ServiceType = (typeof servicesData)[number];

export const Hospital = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === clinicImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? clinicImages.length - 1 : prev - 1
    );
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: "overview", label: "Permbledhja" },
    { key: "services", label: "Sherbimet" },
    { key: "staff", label: "Stafi Mjeksor" },
    { key: "schedule", label: "Orari" },
  ];

  return (
    <div className="max-w-[1920px] mx-auto min-h-screen">
      <div className="flex flex-col lg:flex-row">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 p-4 lg:p-6">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kthehu te lista
          </Link>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Info */}
              <div className="md:w-1/2">
                {/* Status Badge */}
                <div className="mb-4">
                  <StatusBadge isOpen={true} />
                </div>

                {/* Clinic Name */}
                <h1 className="text-[26px] font-bold tracking-wide text-[#494e60] mb-1">
                  Spitali Amerikan
                </h1>
                <p className="text-base text-[#5e6478] mb-6">
                  Prishtinë, Kosove
                </p>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#9fa4b4] mb-1">Telefoni:</p>
                    <p className="text-base font-semibold text-[#494e60]">
                      +383 49 123 456
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#9fa4b4] mb-1">Email:</p>
                    <a
                      href="mailto:spitaliamerikan@gmail.com"
                      className="text-primary hover:underline"
                    >
                      spitaliamerikan@gmail.com
                    </a>
                  </div>

                  <div>
                    <p className="text-sm text-[#9fa4b4] mb-1">Website:</p>
                    <a
                      href="https://www.spitaliamerikan.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      www.spitaliamerikan.com
                    </a>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-6">
                  <p className="text-sm text-[#9fa4b4] mb-3">Na ndiqni ne:</p>
                  <SocialShare
                    platforms={["facebook", "twitter", "linkedin", "google"]}
                    size="lg"
                  />
                </div>
              </div>

              {/* Right - Image Carousel */}
              <div className="md:w-1/2">
                <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-[4/3]">
                  {/* Logo Badge */}
                  <div className="absolute top-3 left-3 z-10 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center p-2 overflow-hidden">
                    <img
                      src={SpitaliAmerikanImg}
                      alt="Spitali Amerikan Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Main Image */}
                  <img
                    src={clinicImages[currentImageIndex]}
                    alt={`Clinic view ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-3 left-3 bg-black/50 text-white text-sm px-2 py-1 rounded">
                    {currentImageIndex + 1}/{clinicImages.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="mt-8 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 overflow-x-auto scrollbar-hide">
                  <div className="flex gap-4 sm:gap-6 min-w-max">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`pb-2 text-[13px] sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
                          activeTab === tab.key
                            ? "text-primary"
                            : "text-[#757b8c] hover:text-[#494e60]"
                        }`}
                      >
                        {tab.label}
                        {activeTab === tab.key && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="hidden sm:flex items-center gap-2 text-sm text-[#757b8c] hover:text-primary transition-colors flex-shrink-0">
                  <Share2 className="w-4 h-4" />
                  Shperndaje
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-lg font-bold text-[#494e60] mb-4">
                    Njihuni me Spitalin Amerikan
                  </h2>
                  <p className="text-sm leading-relaxed text-[#5e6478] mb-4">
                    Spitali Amerikan në Shqipëri u themelua në Dhjetor 2006 si
                    spitali i parë privat në vend.
                  </p>
                  <p className="text-sm leading-relaxed text-[#5e6478] mb-4">
                    Filloi aktivitetin e tij në Kardiologji dhe Kardiokirurgji
                    me rekrutimin e një stafi profesionistësh të huaj me
                    eksperiencë në këtë fushë dhe me qëllimin që t'ju shërbyer
                    pacientëve brenda dhe jashtë vendit. Brenda një viti
                    reduktoi në 85% fluksin e pacientëve kardiakë që linin
                    Shqipërinë për t'u kuruar jashtë.
                  </p>
                  <p className="text-sm leading-relaxed text-[#5e6478] mb-6">
                    Pas këtij suksesi Spitali Amerikan shpejt zgjeroi
                    aktivitetin duke u fokusuar në fillim në kirurgji të
                    përgjithshme, ortopedi, kirurgji e syrit e urologji deri sa
                    mberriti në kapacitetin e plotë që gëzon sot.
                  </p>

                  {/* Amenities Section */}
                  <div className="border-t border-border pt-5 mt-2">
                    <h3 className="text-[13px] font-[600] text-text-muted uppercase tracking-wider mb-3">
                      Lehtësirat
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { icon: Monitor, label: "Konsultim online" },
                        { icon: Car, label: "Parking" },
                        { icon: Accessibility, label: "Akses për invalidë" },
                        { icon: Shield, label: "Pranon sigurim" },
                        { icon: Baby, label: "Miqësor për fëmijë" },
                        { icon: Siren, label: "Shërbim urgjence" },
                        { icon: CreditCard, label: "Kartë krediti" },
                        { icon: Wifi, label: "Wi-Fi" },
                      ].map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <span
                            key={item.label}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border-light bg-white text-[13px] font-medium text-text-secondary hover:border-primary/30 hover:bg-primary-lightest transition-colors"
                          >
                            <IconComponent className="w-4 h-4 text-primary" />
                            {item.label}
                            <Check className="w-3.5 h-3.5 text-status-success" />
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "services" && (
                <div>
                  <h2 className="text-lg font-bold text-[#494e60] mb-6">
                    Shërbimet Mjekësore
                  </h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                    {servicesData.map((service) => (
                      <div
                        key={service.name}
                        onClick={() => setSelectedService(service)}
                        className="flex flex-col items-center text-center cursor-pointer group"
                      >
                        <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                          <svg
                            className={`w-7 h-7 ${service.iconColor}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
                          </svg>
                        </div>
                        <span className="text-sm text-[#494e60] leading-tight">
                          {service.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "staff" && (
                <div>
                  <h2 className="text-lg font-bold text-[#494e60] mb-6">
                    Stafi Mjeksor
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                    {[
                      { name: "Dr. Mentodije Alushaj - Rexha", specialty: "Alergolog", img: "https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg" },
                      { name: "Dr. Ismet Jusufi", specialty: "Aneztesist-Reanimator", img: "https://img.freepik.com/free-photo/medium-shot-doctor-with-crossed-arms_23-2148868679.jpg" },
                      { name: "Dr. Antigona Hasani", specialty: "Alergolog", img: "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg" },
                      { name: "Dr. Zekë Zeka Mr. Sci", specialty: "Alergolog", img: "https://img.freepik.com/free-photo/portrait-successful-mid-adult-doctor-with-crossed-arms_1262-12865.jpg" },
                      { name: "Dr. Feim Muçolli", specialty: "Aneztesist-Reanimator", img: "https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827776.jpg" },
                      { name: "Dr. Arben Krasniqi", specialty: "Kardiolog", img: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg" },
                      { name: "Dr. Besnik Hoxha", specialty: "Gastroenterolog", img: "https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg" },
                      { name: "Dr. Fitore Berisha", specialty: "Endokrinolog", img: "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg" },
                      { name: "Dr. Driton Morina", specialty: "Hematolog", img: "https://img.freepik.com/free-photo/front-view-male-doctor-medical-suit_23-2148453467.jpg" },
                      { name: "Dr. Leonora Gashi", specialty: "Neurolog", img: "https://img.freepik.com/free-photo/female-doctor-lab-coat-with-stethoscope_23-2148827769.jpg" },
                    ].map((doctor, index) => (
                      <div
                        key={index}
                        className="group cursor-pointer flex flex-col items-center text-center"
                      >
                        {/* Photo Container - Rounded */}
                        <div className="relative w-28 h-28 mb-4">
                          <div className="w-full h-full rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 ring-4 ring-white">
                            <img
                              src={doctor.img}
                              alt={doctor.name}
                              className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </div>
                        
                        {/* Info */}
                        <h3 className="text-[15px] font-semibold text-[#494e60] leading-tight mb-1 group-hover:text-primary transition-colors">
                          {doctor.name}
                        </h3>
                        <p className="text-[13px] text-[#898e9f]">
                          {doctor.specialty}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "schedule" && (
                <div>
                  <h2 className="text-lg font-bold text-[#494e60] mb-6">
                    Orari i punes
                  </h2>
                  <div className="space-y-3">
                    {[
                      { day: "Hene", hours: "08:00 - 17:00", dayIndex: 1 },
                      { day: "Marte", hours: "08:00 - 17:00", dayIndex: 2 },
                      { day: "Merkure", hours: "08:00 - 17:00", dayIndex: 3 },
                      { day: "Enjte", hours: "08:00 - 17:00", dayIndex: 4 },
                      { day: "Premte", hours: "08:00 - 17:00", dayIndex: 5 },
                      { day: "Shtune", hours: "08:00 - 17:00", dayIndex: 6 },
                      { day: "Diele", hours: "08:00 - 17:00", dayIndex: 0 },
                    ].map((schedule) => {
                      const isToday = new Date().getDay() === schedule.dayIndex;
                      return (
                        <div key={schedule.day} className="flex items-center gap-6">
                          <div
                            className={`w-28 py-2 px-4 rounded text-sm font-medium ${
                              isToday
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-[#494e60]"
                            }`}
                          >
                            {schedule.day}
                          </div>
                          <span
                            className={`text-sm ${
                              isToday ? "text-primary font-medium" : "text-[#494e60]"
                            }`}
                          >
                            {schedule.hours}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Appointment & Reviews - Side by Side on larger screens */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppointmentBooking
              entityType="hospital"
              entityName="Spitali Amerikan"
              entityImage={SpitaliAmerikanImg}
            />
            <Reviews entityType="hospital" entityName="Spitali Amerikan" />
          </div>

          {/* Similar Clinics Section */}
          <div className="mt-8">
            <h3 className="text-[26px] font-[550] leading-[1.15] tracking-[0.72px] text-[#242936] mb-4">
              Të ngjashme
            </h3>
            <div className="flex flex-wrap -mx-3">
              {similarClinics.map((clinic) => (
                <div key={clinic.id} className="p-3 w-full sm:w-1/2 lg:w-1/3">
                  <div className="border border-solid p-5 shadow-lg h-[250px] flex flex-col justify-center items-center relative cursor-pointer hover:shadow-xl transition-shadow">
                    {/* Status Badge */}
                    <div className="absolute top-1 left-1">
                      <StatusBadge isOpen={clinic.isOpen} />
                    </div>

                    {/* Logo */}
                    <img
                      src={clinic.logo}
                      alt={clinic.name}
                      className="max-w-[100%] max-h-[100%]"
                    />
                  </div>
                  <div className="py-3">
                    <h4 className="text-[14px] font-normal tracking-[0.39px] text-[#898e9f]">
                      {clinic.city}
                    </h4>
                    <h1 className="text-[20px] font-[600] tracking-[0.56px] text-[#818798]">
                      {clinic.name}
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Map */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-auto lg:min-h-screen">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.5447754789397!2d21.15694307677631!3d42.66329621292626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13549ee605110927%3A0x9365bfdf385eb95a!2sAmerican%20Hospital!5e0!3m2!1sen!2s!4v1707234567890!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Hospital Location"
            className="min-h-[400px] lg:min-h-full"
          />
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#494e60]">
                {selectedService.name}
              </h2>
              <button
                onClick={() => setSelectedService(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="prose prose-sm max-w-none">
                {selectedService.description.split("\n\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-sm leading-relaxed text-[#5e6478] mb-4"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

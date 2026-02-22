import BloodDropPng from "./assets/blood-drop.png";
import BloodDropLeftPng from "./assets/blood-drop-left.png";
import BloodDropRightPng from "./assets/blood-drop-right.png";
import { Button } from "../ui/button";

export const DonateBloodBanner = () => {
  return (
    <section
      className="relative h-[500px] bg-center bg-no-repeat bg-contain mt-10 mb-10"
      style={{
        backgroundImage: `url(${BloodDropPng})`,
        backgroundSize: "300px",
      }}
    >
      <div className="w-full h-full text-center flex justify-center flex-col items-center">
        <h1 className="text-[40px] font-[700] tracking-[1.11px] text-[#494e60]">
          Dhuro Gjak, Shpeto jete.
        </h1>
        <p className="text-[20px] font-normal leading-[1.5] tracking-[0.56px] text-center text-[#505b76]">
          Shiko te gjitha eventet e dhurimit te gjakut, dhe shfrytezoje rastin
          per tu bere hero.
        </p>
        <Button className="text-[16px] font-[600] tracking-[0.44px] bg-primary hover:bg-primary-200 mt-5 w-[150px]">
          Kerko
        </Button>
      </div>

      <img
        src={BloodDropLeftPng}
        alt="Blood Drop Left"
        className="absolute bottom-0 left-0 max-w-[40%]"
      />
      <img
        src={BloodDropRightPng}
        alt="Blood Drop Right"
        className="absolute bottom-0 right-0 max-w-[40%]"
      />
    </section>
  );
};

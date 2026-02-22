import { ReactComponent as PhoneIcon } from "./assets/phone-outgoing-alt-svgrepo-com.svg";
import { ReactComponent as EnvelopeIcon } from "./assets/envelope-closed-svgrepo-com.svg";
import { StatusBadge } from "../status-badge/status-badge";

interface ResultsItemProps {
  isDoctor: boolean;
  city: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  status: string; // Open or Closed
  imageUrl: string; // URL for the image
  occupation?: string; // URL for the image
}

export const ResultsItem = ({
  isDoctor,
  city,
  name,
  description,
  phone,
  email,
  status,
  imageUrl,
  occupation,
}: ResultsItemProps) => {
  return (
    <div className="border border-solid m-3 flex">
      <div className="w-1/4 flex items-center justify-center px-6 relative">
        <img
          src={imageUrl}
          alt={name}
          className={
            isDoctor
              ? "rounded-full w-[130px] h-[130px] object-contain shadow-lg"
              : "max-w-[70%] max-h-[70%]"
          }
        />
        {!isDoctor && (
          <div className="absolute top-1 left-1">
            <StatusBadge isOpen={status === "Open"} />
          </div>
        )}
      </div>
      <div className="px-6 py-3 w-3/4 flex flex-col justify-center border-l">
        <p className="text-[14px] font-normal tracking-[0.39px] text-[#9fa4b4]">
          {city}
        </p>
        <h1 className="text-[22px] font-bold tracking-[0.61px] text-[#494e60] mb-3">
          {name}
        </h1>
        <p className="text-[14px] font-normal leading-[1.57] tracking-[0.39px] text-[#757b8c]">
          {description}
        </p>
        <div className="my-4 flex">
          <div className="flex mr-3">
            <PhoneIcon className="size-6 text-primary" />
            <span className="text-[14px] font-normal leading-[1.57] tracking-[0.39px] text-[#8c92a3] ml-1">
              {phone}
            </span>
          </div>
          <div className="flex ml-3">
            <EnvelopeIcon className="size-6 text-primary" />
            <span className="text-[14px] font-normal leading-[1.57] tracking-[0.39px] text-[#8c92a3] ml-1">
              {email}
            </span>
          </div>
        </div>
        {isDoctor && <p className="text-[14px] font-[600] leading-[1.57] tracking-[0.39px] text-[#599eff]"
          >- {occupation}</p>}
      </div>
    </div>
  );
};

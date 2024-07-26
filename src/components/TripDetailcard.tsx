import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../lib/utils";
import { useUserContext } from "./context/userContext";

export const TripDetailcard = ({ id, date_time, status, type }: Trip) => {
  const { userType } = useUserContext();

  const getStatusClassName = (status: string) => {
    switch (status) {
      case "searching":
        return "bg-searching";
      case "booked":
        return "bg-booked";
      case "in_progress":
        return "bg-in_progress";
      case "completed":
        return "bg-completed";
      case "cancelled":
        return "bg-cancelled";
      default:
        return "";
    }
  };

  const statusClassName = getStatusClassName(status);

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/app/${userType}/trip/${id}`)}
      className="grid sm:grid-cols-[4fr,6fr] gap-x-5 p-3 w-full outline cursor-pointer outline-gray-200 transition-all duration-200 hover:bg-gray-200 px-2 rounded-lg"
    >
      <img
        src="https://via.placeholder.com/500x300"
        alt="Placeholder"
        className="rounded-lg"
      />
      <div className="flex flex-col gap-2 h-full  relative">
        <p className="text-base sm:text-xl capitalize font-bold md:mb-2">
          Pickup location
        </p>
        <p className="text-sm">{formatDateTime(date_time)}</p>
        <div className="flex items-center gap-x-2">
          <p className="capitalize text-lg">{type}</p>

          <p
            className={`text-sm p-1 w-[90px] text-center rounded-md capitalize ${statusClassName}`}
          >
            {status}
          </p>
        </div>
        <div className="flex absolute bottom-4"></div>
      </div>
    </div>
  );
};

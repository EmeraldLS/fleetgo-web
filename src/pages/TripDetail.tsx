import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../api/api_call";
import { SERVER_URL } from "../utils/constants";
import Loader from "../components/Loader";
import { formatDateTime } from "../lib/utils";
import { FaChevronLeft } from "react-icons/fa";
import DriverDetailCard from "../components/DriverDetailCard";
import { Skeleton } from "../components/ui/skeleton";

const TripDetail = () => {
  const { id } = useParams();

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["tripDetails"],
    queryFn: () => getRequest(`${SERVER_URL}/trip/${id}`),
  });

  const {
    data: driverData,
    isSuccess: isDriverSuccess,
    isLoading: isDriverLoading,
    isError: isDriverError,
  } = useQuery({
    queryKey: ["driver", data?.DATA],
    queryFn: () => getRequest(`${SERVER_URL}/driver/${data?.DATA?.driver_id}`),
    enabled: !!data?.DATA?.driver_id,
  });

  if (isDriverSuccess) {
    console.log(driverData);
  }

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

  const statusClassName = getStatusClassName(data?.DATA.status);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-auto max-w-xl mt-5 py-5 px-5 space-y-10">
          <button
            onClick={() => window.history.back()}
            className=" border p-3 rounded-full border-gray-400"
          >
            <FaChevronLeft />
          </button>

          {isError && (
            <div className="bg-red-400 text-white px-2 mx-5 sm:mx-0 py-5 text-sm rounded-md text-center">
              An error occured retrieving trip data
            </div>
          )}

          {isSuccess && (
            <div className="pb-5">
              <h1 className="text-xl sm:text-2xl font-bold mb-8">Your Trip</h1>
              <div className="flex justify-between">
                <p className="text-base sm:text-lg">
                  {formatDateTime(data?.DATA?.date_time)}
                </p>
                <p
                  className={`text-sm px-5 py-1 rounded-md lowercase ${statusClassName}`}
                >
                  {data?.DATA.status}
                </p>
              </div>
              <img
                src="https://via.placeholder.com/600x300"
                alt="placeholder"
                className="mt-5 rounded-md"
              />
              <hr className="my-5" />
              {isDriverLoading ? (
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ) : (
                <>
                  {isDriverSuccess && (
                    <div>
                      <h1 className="text-base md:text-xl font-semibold">
                        Driver assigned
                      </h1>
                      <DriverDetailCard
                        name={driverData?.DATA.full_name}
                        rating={driverData?.DATA.rating}
                        imageUrl=""
                      />
                    </div>
                  )}
                  {isDriverError && (
                    <div className="bg-red-400 text-white px-2 mx-5 sm:mx-0 py-5 text-sm rounded-md text-center">
                      An error occured retrieving driver data
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TripDetail;

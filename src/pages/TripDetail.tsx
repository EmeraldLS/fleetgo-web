import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../api/api_call";
import { SERVER_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

const TripDetail = () => {
  const { id } = useParams();

  // const { data, isSuccess } = useQuery({
  //   queryKey: ["tripDetails"],
  //   queryFn: () => getRequest(`${SERVER_URL}/trip/${id}`),
  // });

  // if (isSuccess) {
  //   console.log(data);
  // }

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <Link to="/app/:asdfa">Back to trips</Link>
          </div>
          <div className="w-full mx-auto max-w-xl py-5 space-y-10">
            <h1 className="text-xl sm:text-2xl font-bold">Your Trip</h1>
            <div>
              <p className="text-base sm:text-lg">
                5:40 PM, Tuesday February 13 2024
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TripDetail;

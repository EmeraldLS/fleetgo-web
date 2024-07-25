import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { formatDateTime } from "../lib/utils";
import { postRequest } from "../api/api_call";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Toaster } from "../components/ui/sonner";
import { SERVER_URL } from "../utils/constants";
import ProtectedRoute from "../components/Protected";
import { useAuthSore } from "../components/hooks/useAuth";
import Loader from "../components/Loader";
import { Navbar } from "../components/Navbar";
import { useUserContext } from "../components/context/userContext";
import { SearchingDriver } from "../components/SearchingDriver";

interface EventResponse {
  type: string;
  content: string;
  time: string;
  trip_id?: string;
}

type notifProps = {
  resp: EventResponse;
  setNotifCount: React.Dispatch<React.SetStateAction<number>>;
};

const Notification = ({
  resp: { type, time, trip_id, content },
  setNotifCount,
}: notifProps) => {
  const handleDecline = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Decline clicked");
  };

  const { mutate } = useMutation({
    mutationKey: ["accept-trip"],
    mutationFn: (tripID: string) =>
      postRequest(`${SERVER_URL}/accept-trip/${tripID}`, {}),
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      console.log(data);
      setNotifCount((prev) => (prev > 0 ? prev - 1 : 0));
    },
  });

  const handleAccept = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    tripID: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    mutate(tripID);
  };

  return (
    <Link to={`/trip/${trip_id}`} className="w-full">
      <div className="flex justify-between items-center">
        <h1 className=" text-lg font-semibold">{type}</h1>
        <small>{formatDateTime(time)}</small>
      </div>
      <p className=" ">{content}</p>
      {type == "TripRequest" && (
        <div className="mt-3 space-x-3">
          <Button
            className="bg-red-400 hover:bg-red-500"
            onClick={handleDecline}
          >
            {" "}
            Decline{" "}
          </Button>
          <Button
            className="bg-green-400 hover:bg-green-500"
            onClick={(e) => handleAccept(e, trip_id!)}
          >
            {" "}
            Accept{" "}
          </Button>
        </div>
      )}
    </Link>
  );
};

export default function Dashboard() {
  const [newNotif, setNewNotif] = useState<EventResponse | null>(null);
  const [notifCount, setNewNotifCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const { user_type } = useParams();
  const { setUserType } = useUserContext();
  useEffect(() => {
    switch (user_type) {
      case "user":
        setUserType("user");
        break;

      case "driver":
        setUserType("driver");
        break;

      default:
        localStorage.removeItem("user");
        window.location.reload();
    }
  }, [user_type, setUserType]);

  const { user } = useAuthSore();

  const SSE_URL = `${SERVER_URL}/notifications?token=${user?.token}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const { setTripStatus } = useUserContext();

  useEffect(() => {
    // if (!isReady) return;

    const eventSource = new EventSource(SSE_URL);
    eventSource.onmessage = (event) => {
      event = JSON.parse(event.data);
      //@ts-expect-error there's supposed to be a method event
      switch (event.event) {
        case "connected":
          break;
        case "notif":
          if (event.data != null) {
            switch (event.data.type) {
              case "TripRequest":
                setNewNotif(event.data);
                setNewNotifCount((prev) => prev + 1);
                break;
              case "TripAcceptance":
                console.log("Trip has been accepted successfully");
                setTripStatus({ status: "booked" });
                break;

              default:
                break;
            }
          }
          break;
        default:
          console.warn("Unhandled event type:", event.type);
      }
    };

    eventSource.onerror = (err) => {
      eventSource.close();
      console.error("Error with SSE connection: ", err);
    };

    eventSource.onopen = () => {
      // console.log("CONNECTION ESTABLISHED");
    };

    return () => {
      eventSource.close();
    };
  }, [isReady, SSE_URL, setTripStatus]);

  useEffect(() => {
    if (newNotif != null) {
      toast(<Notification resp={newNotif} setNotifCount={setNewNotifCount} />);
    }
  }, [newNotif]);

  useEffect(() => {
    if (notifCount > 0) {
      document.title = `Book (${notifCount}) `;
    } else {
      document.title = "Book";
    }
  }, [notifCount]);

  // const playNotificationSound = () => {
  //   const audio = new Audio("./assets/notif-sound.wav");
  //   audio.play();
  // };

  return (
    <ProtectedRoute>
      <React.Suspense fallback={<Loader />}>
        <Navbar />
        <Toaster />
        <SearchingDriver />
        <Outlet />
      </React.Suspense>
    </ProtectedRoute>
  );
}

import { Button } from "./ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

import CarImg from "../assets/car.png";
import PackageImg from "../assets/package.png";
import TruckImg from "../assets/truck.png";
import TipperImg from "../assets/tipper.png";

import { useState } from "react";
import { SkeletonLoader } from "./SkeletonLoader";
import { useMutation } from "@tanstack/react-query";
import { postRequest } from "../api/api_call";
import { useUserContext } from "./context/userContext";

interface drawerProps {
  disbabled: boolean;
  pickupCoord: { lat: string; lng: string };
  dropoffCoord: { lat: string; lng: string };
}

interface tripTypeContent {
  name: string;
  value: string;
  image: string;
  description?: string;
  alt: string;
}

export function BookTripDrawer({
  disbabled,
  pickupCoord,
  dropoffCoord,
}: drawerProps) {
  const [tripTypes, setTripTypes] = useState<tripTypeContent[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedTripType, setSelectedTripType] = useState("car");

  const onOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSelectedTripType(e.target.value);
  };

  const handleSearchClick = () => {
    setTimeout(() => {
      setTripTypes([
        {
          name: "Car",
          value: "car",
          image: CarImg,
          alt: "image of a white car",
          description: "Travel in comfort",
        },
        {
          name: "Truck",
          value: "truck",
          image: TruckImg,
          alt: "big white & red truck",
          description: "For heavy loads",
        },
        {
          name: "Package",
          value: "bike",
          image: PackageImg,
          alt: "biker with package",
          description: "Send or receive package",
        },
        {
          name: "Tipper",
          value: "tipper",
          image: TipperImg,
          alt: "tipper for sand",
          description: "For sand and stones",
        },
      ]);
      setLoading(false);
    }, 2000);
  };

  const values = {
    type: selectedTripType,
    pickup_location_coord: {
      lat: parseFloat(pickupCoord.lat),
      lng: parseFloat(pickupCoord.lng),
    },
    dropoff_location_coord: {
      lat: parseFloat(dropoffCoord.lat),
      lng: parseFloat(dropoffCoord.lng),
    },
  };

  const [open, setOpen] = useState(false);
  const { setTripRespData } = useUserContext();

  const { setTripStatus } = useUserContext();

  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["book-trip", pickupCoord, dropoffCoord],
    mutationFn: (data: object) => postRequest("/trip", data),
    onError: (err) => {
      console.error(err.message);
    },
    onSuccess: (data) => {
      setTripRespData(data.DATA);
      setTripStatus({ status: data.DATA.status });
      setOpen(false);
    },
  });

  const handleSubmit = () => {
    console.log(values);
    mutate(values);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className="w-full py-1"
          onClick={handleSearchClick}
          disabled={disbabled}
        >
          Search
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle className="text-3xl md:text-4xl">
              Choose a Ride
            </DrawerTitle>
            <DrawerDescription>
              Select from a range of vehicles, ensuring every journey meets your
              needs perfectly.
            </DrawerDescription>
          </DrawerHeader>
          {
            <div className="p-4 pb-3 z-10 max-h-[25vh] space-y-3 overflow-y-auto">
              {isError && (
                <div className="bg-red-400 text-white px-2 mx-5 sm:mx-0 py-5 text-sm rounded-md text-center">
                  An error occured creating trip
                </div>
              )}
              {loading ? (
                <SkeletonLoader />
              ) : (
                tripTypes?.map((tType, i) => (
                  <div
                    key={i}
                    className={`transition-all duration-200 ease-in rounded-md ${
                      selectedTripType !== tType.value &&
                      "hover:ring-gray-400 hover:ring-1"
                    }  ${
                      selectedTripType === tType.value && " ring-2 ring-black"
                    } `}
                  >
                    <label
                      htmlFor={tType.value}
                      className={`grid grid-cols-[5fr,5fr,2fr] sm:grid-cols-3 gap-x-3 px-5 items-center justify-around cursor-pointer`}
                    >
                      <img
                        src={tType.image}
                        alt=""
                        className="h-[50px] sm:h-[80px] "
                      />
                      <div className="flex flex-col ">
                        <h1 className="text-sm sm:text-base font-bold">
                          {tType.name}
                        </h1>
                        <p className="text-xs sm:text-sm max-w-sm">
                          {tType?.description}
                        </p>
                      </div>
                      <div className=" text-xs sm:text-sm ">
                        <h1>$200.00</h1>
                      </div>
                    </label>
                    <input
                      type="radio"
                      name="trip_type"
                      id={tType.value}
                      value={tType.value}
                      checked={selectedTripType == tType.value}
                      onChange={onOptionChange}
                      className="sr-only"
                    />
                  </div>
                ))
              )}
            </div>
          }
          <DrawerFooter>
            <Button onClick={handleSubmit} disabled={isPending}>
              Submit
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

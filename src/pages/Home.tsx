import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import "@here/maps-api-for-javascript";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { FaStopCircle } from "react-icons/fa";
import { FaCircleDot } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { BookTripDrawer } from "../components/BookTripDrawer";
import axios from "axios";

const ApiKey = process.env.REACT_APP_HERE_API_KEY;
const ipInfoApiKey = process.env.REACT_APP_IPINFO_API_KEY;

const getIpLoc = async () => {
  try {
    let response = await axios.get("https://api.ipify.org?format=json");

    response = await axios.get(
      `https://ipinfo.io/${response?.data.ip}?token=${ipInfoApiKey}`
    );
    const location = response?.data.loc.split(",");
    const latitude = location[0];
    const longitude = location[1];

    return {
      lat: latitude,
      lng: longitude,
    };
  } catch (err) {
    console.log(err);
  }
};

const Home = () => {
  const [ipLoc, setIpLoc] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  useEffect(() => {
    getIpLoc().then((data) => {
      setIpLoc(data!);
    });
  }, []);

  const [addressLocation, setAddressLocation] = useState({
    pickup: "",
    dropoff: "",
  });
  const [addressLocationFocus, setAddressLocationFocus] = useState({
    pickup: false,
    dropoff: false,
  });

  const [pickupLocations, setPickupLocations] = useState<any[]>([]);
  const [dropoffLocations, setDropoffLocations] = useState<any[]>([]);

  const [stage, setStage] = useState(0);
  const [pickupCoord, setPickupCoord] = useState({
    lat: ipLoc?.lat.toString() || "9.1150",
    lng: ipLoc?.lng.toString() || "7.5109",
  });

  const [locString, setLocString] = useState("");
  const [searching, setSearching] = useState(true);
  const [, setWatchId] = useState<number | null>(null);

  const [dropoffCoord, setDropoffCoord] = useState({ lat: "", lng: "" });
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<H.Map | null>(null);

  const pickupdropdownRef = useRef<HTMLDivElement | null>(null);
  const pickupinputRef = useRef<HTMLInputElement | null>(null);

  const dropoffdropdownRef = useRef<HTMLDivElement | null>(null);
  const dropoffinputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickupdropdownRef.current &&
        !pickupdropdownRef.current.contains(event.target) &&
        pickupinputRef.current &&
        !pickupinputRef.current.contains(event.target)
      ) {
        setAddressLocationFocus((prev) => ({
          ...prev,
          pickup: false,
          dropoff: false,
        }));
      } else if (
        dropoffdropdownRef.current &&
        !dropoffdropdownRef.current.contains(event.target) &&
        dropoffinputRef.current &&
        !dropoffinputRef.current.contains(event.target)
      ) {
        setAddressLocationFocus((prev) => ({
          ...prev,
          dropoff: false,
          pickup: false,
        }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const platform = useMemo(
    () =>
      new H.service.Platform({
        apikey: ApiKey!,
      }),
    []
  );

  const reverseGeoEncode = async (lat: number, lng: number) => {
    const resp = await fetch(
      `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat}%2C${lng}&lang=en-US&apikey=${ApiKey}`
    );
    const data = await resp.json();
    return data.items[0].title as string;
  };

  useEffect(() => {
    const user_loc = localStorage.getItem("user-location");
    if (user_loc != null) {
      const loc = JSON.parse(user_loc);

      reverseGeoEncode(loc.latitude, loc.longitude).then((data) => {
        setLocString(data);
      });
    }
  }, []);

  const getUserLocation = () => {
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: Infinity,
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        localStorage.setItem("user-location", JSON.stringify(position.coords));
        console.log(position);
        setPickupCoord({
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString(),
        });

        reverseGeoEncode(
          position.coords.latitude,
          position.coords.longitude
        ).then((data) => {
          setLocString(data);
          setAddressLocation((prev) => ({
            ...prev,
            pickup: data,
          }));

          setPickupCoord({
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
          });
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
      },
      options
    );

    setWatchId(watchId);
  };

  const parser = (text: string) => {
    text = text.replace(/,/g, "%2C");
    text = text.replace(/ /g, "+");
    return text;
  };

  useEffect(() => {
    setTimeout(async () => {
      if (addressLocation.pickup.length >= 2) {
        try {
          const resp = await fetch(
            `https://autosuggest.search.hereapi.com/v1/autosuggest?at=9.1150,7.5109&lang=en&limit=8&q=${parser(
              addressLocation.pickup
            )}&apiKey=${ApiKey}`
          );
          const data = await resp.json();
          setPickupLocations(data.items);
        } catch (err) {
          console.log(err);
        }
      }
    }, 2000);
  }, [addressLocation.pickup]);

  useEffect(() => {
    setTimeout(async () => {
      if (addressLocation.dropoff.length >= 2) {
        try {
          const resp = await fetch(
            `https://autosuggest.search.hereapi.com/v1/autosuggest?at=0,0&lang=en&limit=5&q=${parser(
              addressLocation.dropoff
            )}&apiKey=${ApiKey}`
          );
          const data = await resp.json();
          setDropoffLocations(data.items);
        } catch (err) {
          console.log(err);
        }
      }
    }, 2000);
  }, [addressLocation.dropoff]);

  const handlePickUpLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAddressLocation((prev) => ({ ...prev, pickup: e.target.value }));
  };

  const handleDropOffLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAddressLocation((prev) => ({ ...prev, dropoff: e.target.value }));
  };

  // const { mutate, isPending } = useMutation({
  //   mutationKey: ["book-trip"],
  //   mutationFn: (values: object) => {
  //     return postRequest(`${SERVER_URL}/trip`, values);
  //   },
  //   onSuccess: (data) => {
  //     console.log(data);
  //   },
  //   onError: (err) => {
  //     console.error(err);
  //   },
  // });

  const handleBookTrip = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Book trip using address");
  };

  const handleChangeStage = () => {
    setStage((prev) => (prev === 0 ? 1 : 0));
  };

  // Init the map
  useEffect(() => {
    setTimeout(() => {
      if (mapRef.current != null) {
        if (!mapInstanceRef.current) {
          const defaultLayers = platform.createDefaultLayers({
            pois: true,
          });

          mapInstanceRef.current = new H.Map(
            mapRef.current,
            // @ts-expect-error - there's suppose to be a method of .vector
            defaultLayers.vector.normal.map,
            {
              zoom: 10,
              center: {
                lat: parseFloat(pickupCoord.lat),
                lng: parseFloat(pickupCoord.lng),
              },
            }
          );

          new H.mapevents.Behavior(
            new H.mapevents.MapEvents(mapInstanceRef.current)
          );

          window.addEventListener("resize", () =>
            mapInstanceRef.current?.getViewPort().resize()
          );

          H.ui.UI.createDefault(mapInstanceRef.current, defaultLayers);
          document.querySelector("canvas")?.classList.add("rounded-lg");
        } else {
          mapInstanceRef.current.setCenter({
            lat: parseFloat(pickupCoord.lat),
            lng: parseFloat(pickupCoord.lng),
          });
        }
      }
    }, 1000);
  }, [pickupCoord.lat, pickupCoord.lng, platform]);

  // draw the map dicretion from pickup to dropoff
  useEffect(() => {
    if (
      pickupCoord.lat &&
      pickupCoord.lng &&
      dropoffCoord.lat &&
      dropoffCoord.lng
    ) {
      const routingParameters = {
        routingMode: "fast",
        transportMode: "car",
        origin: `${pickupCoord.lat},${pickupCoord.lng}`,
        destination: `${dropoffCoord.lat},${dropoffCoord.lng}`,
        return: "polyline",
      };

      // @ts-expect-error - idk the type of result
      const onResult = (result) => {
        if (result.routes.length) {
          const lineStrings: H.geo.LineString[] = [];
          // @ts-expect-error - idk the type of section
          result.routes[0].sections.forEach((section) => {
            lineStrings.push(
              H.geo.LineString.fromFlexiblePolyline(section.polyline)
            );
          });

          const multiLineString = new H.geo.MultiLineString(lineStrings);
          const routeLine = new H.map.Polyline(multiLineString, {
            data: [],
            style: {
              strokeColor: "black",
              lineWidth: 5,
            },
          });

          const startMarker = new H.map.Marker({
            lat: parseFloat(pickupCoord.lat),
            lng: parseFloat(pickupCoord.lng),
          });

          const endMarker = new H.map.Marker({
            lat: parseFloat(dropoffCoord.lat),
            lng: parseFloat(dropoffCoord.lng),
          });

          const group = new H.map.Group();
          group.addObjects([routeLine, startMarker, endMarker]);

          mapInstanceRef.current?.addObject(group);

          mapInstanceRef.current?.getViewModel().setLookAtData({
            bounds: group.getBoundingBox(),
          });

          setSearching(false);
        }
      };

      const router = platform.getRoutingService({}, 8);

      router.calculateRoute(routingParameters, onResult, (error) => {
        setSearching(false);
        console.error(error.message);
      });
    }
  }, [
    dropoffCoord.lat,
    dropoffCoord.lng,
    pickupCoord.lat,
    pickupCoord.lng,
    platform,
  ]);

  return (
    <div className="grid md:grid-cols-[4fr,8fr] lg:grid-cols-[3fr,9fr] gap-5 mx-5 sm:mx-10 md:mx-20 my-10">
      <div className="sticky">
        <Card className="min-w-[350px]">
          <CardHeader>
            <CardTitle>Book a trip</CardTitle>
            <CardDescription>
              {/* <span
                onClick={handleChangeStage}
                className="text-primary bg-transparent underline cursor-pointer"
              >
                {stage === 0 ? "Use Coordinates" : "Use Address"}
              </span> */}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stage == 0 ? (
              <form
                method="post"
                className=" space-y-5"
                onSubmit={handleBookTrip}
              >
                <div className=" space-y-2">
                  <label htmlFor="pickup_location" className="hidden">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <FaCircleDot className="absolute top-[10px] left-2 text-lg" />
                    <Input
                      id="pickup_location"
                      name="pickup_location"
                      value={addressLocation.pickup}
                      onChange={handlePickUpLocationChange}
                      placeholder="Pickup Location"
                      className="text-sm pl-10 border-none bg-gray-100 py-2 transition-all duration-200"
                      required
                      autoComplete="off"
                      onFocus={() =>
                        setAddressLocationFocus((prev) => ({
                          ...prev,
                          pickup: true,
                        }))
                      }
                      ref={pickupinputRef}
                    />

                    {addressLocationFocus.pickup && (
                      <div
                        className=" bg-white drop-shadow-xl overflow-y-auto max-h-[250px] w-full z-10 mt-1 rounded-md sm:absolute transition-all duration-150 ease-in-out"
                        ref={pickupdropdownRef}
                      >
                        <div
                          className="flex gap-x-3 items-center p-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            setAddressLocationFocus((prev) => ({
                              ...prev,
                              pickup: false,
                            }));
                            getUserLocation();
                          }}
                        >
                          <MdMyLocation className="text-lg" />
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {!locString ? "Use my location" : locString}
                            </span>
                            <span className="text-sm">
                              {locString && " Your current location"}
                            </span>
                          </div>
                        </div>
                        {pickupLocations.length > 0 &&
                          pickupLocations.map((loc, i) => {
                            return (
                              <div
                                className={`p-3 cursor-pointer z-10 hover:bg-gray-50 flex gap-x-3 items-center  text-sm ${
                                  pickupLocations.length - 1 != i
                                    ? "border"
                                    : ""
                                }`}
                                key={i}
                                onClick={() => {
                                  setAddressLocationFocus((prev) => ({
                                    ...prev,
                                    pickup: false,
                                  }));
                                  setAddressLocation((prev) => ({
                                    ...prev,
                                    pickup: loc.address?.label,
                                  }));

                                  setPickupCoord({
                                    lat: loc.position.lat,
                                    lng: loc.position.lng,
                                  });
                                }}
                              >
                                <IoLocationOutline />
                                <span>{loc.address?.label}</span>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
                <div className=" space-y-2">
                  <label htmlFor="dropoff_location" className="hidden">
                    Dropoff Location
                  </label>
                  <div className="relative">
                    <FaStopCircle className="absolute top-[10px] left-2 text-lg" />

                    <Input
                      id="dropoff_location"
                      name="dropoff_location"
                      value={addressLocation.dropoff}
                      onChange={handleDropOffLocationChange}
                      placeholder="Dropoff Location"
                      className="text-sm pl-10 border-none bg-gray-100 transition-all duration-200"
                      required
                      onFocus={() =>
                        setAddressLocationFocus((prev) => ({
                          ...prev,
                          dropoff: true,
                        }))
                      }
                      autoComplete="off"
                      autoCorrect="off"
                      // onBlur={() =>
                      //   setTimeout(() => {
                      //     setAddressLocationFocus((prev) => ({
                      //       ...prev,
                      //       dropoff: false,
                      //     }));
                      //   }, 300)
                      // }
                      ref={dropoffinputRef}
                    />
                    {addressLocationFocus.dropoff &&
                      dropoffLocations?.length > 0 && (
                        <div
                          className=" bg-white drop-shadow-xl z-10  overflow-y-auto max-h-[250px] w-full absolute mt-1 rounded-md transition-all duration-300"
                          ref={dropoffdropdownRef}
                        >
                          {dropoffLocations.map((loc, i) => {
                            return (
                              <div
                                className={`px-3 py-4 cursor-pointer hover:bg-gray-50 flex gap-x-3 items-center  text-sm ${
                                  dropoffLocations.length - 1 != i
                                    ? "border"
                                    : ""
                                }`}
                                key={i}
                                onClick={() => {
                                  setAddressLocationFocus((prev) => ({
                                    ...prev,
                                    dropoff: false,
                                  }));
                                  setAddressLocation((prev) => ({
                                    ...prev,
                                    dropoff: loc.address?.label,
                                  }));

                                  setDropoffCoord({
                                    lat: loc.position.lat,
                                    lng: loc.position.lng,
                                  });
                                }}
                              >
                                <IoLocationOutline />
                                <span>{loc.address?.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </div>
                </div>
                <BookTripDrawer
                  disbabled={searching}
                  pickupCoord={pickupCoord}
                  dropoffCoord={dropoffCoord}
                />
              </form>
            ) : (
              <form
                method="post"
                className="space-y-5"
                // onSubmit={handleBookTripWithCoord}
              >
                <div className=" space-y-2">
                  <h1>Pickup Location</h1>
                  <div className="grid sm:grid-cols-2 gap-x-3">
                    <div className="space-y-1">
                      <label htmlFor="pickup_location_lat" className=" text-sm">
                        Latitude
                      </label>
                      <Input
                        id="pickup_location_lat"
                        name="pickup_location_lat"
                        placeholder="6.5244"
                        className="text-xs focus-visible:ring-1 focus-visible:ring-primary"
                        value={pickupCoord.lat}
                        onChange={(e) =>
                          setPickupCoord((prev) => ({
                            ...prev,
                            lat: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="pickup_location_lng" className=" text-sm">
                        Longitude
                      </label>
                      <Input
                        id="pickup_location_lng"
                        name="pickup_location_lng"
                        placeholder="3.3792"
                        className="text-xs focus-visible:ring-1 focus-visible:ring-primary"
                        value={pickupCoord.lng}
                        onChange={(e) =>
                          setPickupCoord((prev) => ({
                            ...prev,
                            lng: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className=" space-y-2">
                  <h1>Dropoff Location</h1>
                  <div className="grid sm:grid-cols-2 gap-x-3">
                    <div className="space-y-1">
                      <label
                        htmlFor="dropoff_location_lat"
                        className=" text-sm"
                      >
                        Latitude
                      </label>
                      <Input
                        id="dropoff_location_lat"
                        name="dropoff_location_lat"
                        placeholder="6.5244"
                        className="text-xs  focus-visible:ring-1 focus-visible:ring-primary"
                        value={dropoffCoord.lat}
                        onChange={(e) =>
                          setDropoffCoord((prev) => ({
                            ...prev,
                            lat: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="dropoff_location_lng"
                        className=" text-sm"
                      >
                        Longitude
                      </label>
                      <Input
                        id="dropoff_location_lng"
                        name="dropoff_location_lng"
                        placeholder="3.3792"
                        className="text-xs focus-visible:ring-1 focus-visible:ring-primary"
                        value={dropoffCoord.lng}
                        onChange={(e) =>
                          setDropoffCoord((prev) => ({
                            ...prev,
                            lng: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <Button
                  disabled={
                    // addressLocation.pickup === "" ||
                    // addressLocation.dropoff === "" ||
                    searching
                  }
                  className="w-full"
                ></Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <div
        className=" h-[50svh] md:h-[80lvh] w-full mb-5 cursor-grab z-0"
        ref={mapRef}
      ></div>
    </div>
  );
};

export default Home;

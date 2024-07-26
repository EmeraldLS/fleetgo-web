import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../api/api_call";
import { SERVER_URL } from "../utils/constants";
import Loader from "../components/Loader";
import { FaChevronLeft } from "react-icons/fa";
import { TripDetailcard } from "../components/TripDetailcard";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const Trips = () => {
  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: ["tripDetails"],
    queryFn: () => getRequest(`${SERVER_URL}/trip?offset=0&limit=10`),
  });

  if (isError) {
    console.log(error);
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full px-5 sm:px-10 md:px-28 mt-5 py-5 space-y-10">
          <button
            onClick={() => window.history.back()}
            className="border p-3 rounded-full border-gray-400"
          >
            <FaChevronLeft />
          </button>

          {isError && (
            <div className="bg-red-400 text-white px-2 mx-5 sm:mx-0 py-5 text-sm rounded-md text-center">
              An error occurred retrieving trips data
            </div>
          )}

          {isSuccess && (
            <div className="grid md:grid-cols-[9fr,3fr] gap-x-5 mb-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold mb-5">
                  Past Trips
                </h1>
                <div className="flex flex-col gap-y-5">
                  {data?.DATA == null || data?.DATA.length < 1 ? (
                    <div>No Trip found</div>
                  ) : (
                    (data?.DATA as Trip[])?.map((trip, i) => (
                      <TripDetailcard key={i} {...trip} />
                    ))
                  )}
                </div>
              </div>
              <div className="hidden md:block sticky top-5 mt-12">
                {" "}
                {/* Added top:5 */}
                <Card className="w-[350px]">
                  <CardHeader>
                    <CardTitle>Create project</CardTitle>
                    <CardDescription>
                      Deploy your new project in one-click.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form>
                      <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" placeholder="Name of your project" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="framework">Framework</Label>
                          <Select>
                            <SelectTrigger id="framework">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectItem value="next">Next.js</SelectItem>
                              <SelectItem value="sveltekit">
                                SvelteKit
                              </SelectItem>
                              <SelectItem value="astro">Astro</SelectItem>
                              <SelectItem value="nuxt">Nuxt.js</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Deploy</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Trips;

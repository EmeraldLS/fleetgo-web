import { createContext, useState, ReactNode, useContext } from "react";

interface TripStatus {
  status: "searching" | "booked" | "in_progress" | "completed" | "cancelled";
}

type UserContextType = {
  userType: string | null;
  setUserType: (userType: string) => void;
  tripStatus: TripStatus | null;
  setTripStatus: (status: TripStatus) => void;

  tripResp: tripRespType | null;
  setTripRespData: (data: tripRespType) => void;
};

type tripRespType = {
  date_time: string;
  id: string;
  driver_id: number;
  status: string;
  // Other fields may be included
};

export const UserContext = createContext({} as UserContextType);

export function useUserContext() {
  return useContext(UserContext);
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState<string | null>(null);

  const [tripStatus, setTripStatus] = useState<TripStatus | null>(null);
  const [tripResp, setTripRespData] = useState<tripRespType | null>(null);

  return (
    <UserContext.Provider
      value={{
        userType,
        setUserType,
        tripStatus,
        setTripStatus,
        tripResp,
        setTripRespData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

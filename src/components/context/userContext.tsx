import { createContext, useState, ReactNode, useContext } from "react";

type UserContextType = {
  userType: string | null;
  setUserType: (userType: string) => void;
};

export const UserContext = createContext({} as UserContextType);

export function useUserContext() {
  return useContext(UserContext);
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState<string | null>(null); // State to store user type

  return (
    <UserContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserContext.Provider>
  );
};

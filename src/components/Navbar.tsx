import { Link, NavLink } from "react-router-dom";
import { FaBookmark } from "react-icons/fa";
import { useUserContext } from "./context/userContext";

export const Navbar = () => {
  const { userType } = useUserContext();
  return (
    <div className=" text-black py-4 shadow-gray-400 shadow-sm">
      <div className="container mx-auto flex items-center justify-center">
        <Link to={`/app/${userType}`} className="text-2xl">
          Navbar
        </Link>
        <div className="ml-auto">
          <NavLink
            to={`/app/${userType}/trips`}
            className="flex items-center gap-x-1"
          >
            <FaBookmark className="" />
            <span className="text-sm font-bold">My trips</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

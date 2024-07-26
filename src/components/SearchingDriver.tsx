import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useUserContext } from "./context/userContext";
import { GiCheckMark } from "react-icons/gi";

const ldsRing = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LdsRing = styled.div`
  display: inline-block;
  position: relative;
  width: 40px;
  height: 40px;
  margin-right: 10px;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 44px;
    height: 44px;

    border: 4px solid currentColor;
    border-radius: 50%;
    animation: ${ldsRing} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: currentColor transparent transparent transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }

  div:nth-child(3) {
    animation-delay: -0.15s;
  }
`;

export const SearchingDriver = () => {
  const { tripResp, userType, tripStatus } = useUserContext();
  return (
    <>
      {tripStatus == null ? (
        ""
      ) : (
        <Link
          to={`/app/${userType}/trip/${
            // Used this so that it doesnt return undefined for now.
            //TODO: Will change later

            tripResp?.id || "01J2XSEX12PR09XBH8XHFSQQ7H"
          }`}
          className="fixed top-4 right-4 z-10 bg-white shadow-md rounded-md p-4 border flex items-center border-gray-200"
        >
          {tripStatus?.status === "searching" && (
            <>
              <LdsRing>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </LdsRing>
              <p className="text-gray-700">Searching for drivers...</p>
            </>
          )}

          {tripStatus?.status === "booked" && (
            <>
              <GiCheckMark />
              <p className="text-gray-700 ml-2">Driver found for trip...</p>
            </>
          )}
        </Link>
      )}
    </>
  );
};

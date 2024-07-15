import DriverImg from "../assets/driver.svg";

const TripTypecard = () => {
  return (
    <div className=" cursor-pointer grid grid-cols-3 gap-x-2 w-full h-auto">
      <img src={DriverImg} alt="driver-svg" className="" />
      <div></div>
      <div></div>
    </div>
  );
};

export default TripTypecard;

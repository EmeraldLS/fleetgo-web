import { Card, CardHeader } from "../components/ui/card";
import Rating from "./Rating";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Driver = {
  name: string;
  rating: number;
  imageUrl: string;
};

const DriverDetailCard = ({ name, rating, imageUrl }: Driver) => {
  return (
    <Card className="w-full mt-3 cursor-pointer">
      <CardHeader className=" grid grid-cols-[4fr,8fr]">
        <Avatar className="h-[100px] w-[100px] object-cover">
          <AvatarImage src={imageUrl} alt="driver-img" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold mt-2">{name}</h2>
          <div className="flex items-center">
            <Rating value={rating} readOnly />
            <span className="ml-2 text-gray-600">{rating?.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default DriverDetailCard;

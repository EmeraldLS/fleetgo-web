import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

type RatingProps = {
  value: number;
  readOnly?: boolean;
};

const Rating = ({ value, readOnly = false }: RatingProps) => {
  // Calculate the number of full stars, half stars, and empty stars
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 !== 0;
  const emptyStars = 5 - Math.ceil(value);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)]?.map((_, index) => (
        <FaStar
          key={`full-${index}`}
          className={`text-yellow-500 ${
            readOnly ? "cursor-default" : "cursor-pointer"
          }`}
        />
      ))}
      {hasHalfStar && (
        <FaStarHalfAlt
          className={`text-yellow-500 ${
            readOnly ? "cursor-default" : "cursor-pointer"
          }`}
        />
      )}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar
          key={`empty-${index}`}
          className={`text-gray-400 ${
            readOnly ? "cursor-default" : "cursor-pointer"
          }`}
        />
      ))}
    </div>
  );
};

export default Rating;

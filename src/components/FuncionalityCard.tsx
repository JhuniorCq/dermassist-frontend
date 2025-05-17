import { JSX } from "react";
import { useNavigate } from "react-router-dom";

type FuncionalityCardProps = {
  title: string;
  description: string;
  icon: JSX.Element;
  destinationRoute: string;
};

const FuncionalityCard = ({
  title,
  description,
  icon,
  destinationRoute,
}: FuncionalityCardProps) => {
  const navigate = useNavigate();

  const redirect = () => navigate(destinationRoute);

  return (
    <span
      className="w-96 px-6 bg-white py-6 text-center rounded-md shadow-md flex flex-col items-center gap-4 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
      onClick={redirect}
    >
      {icon}
      <div>
        <h1 className="text-base font-semibold mb-1 text-primary-hard min-[500px]:text-lg">
          {title}
        </h1>
        <p className="text-sm min-[500px]:text-base">{description}</p>
      </div>
    </span>
  );
};

export default FuncionalityCard;

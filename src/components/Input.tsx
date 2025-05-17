import {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";
import { InputLocations } from "../types/input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

type InputProps<T extends FieldValues> = {
  label?: string;
  type: "text" | "password" | "email";
  placeholder: string;
  location: InputLocations;
  name: Path<T>;
  id?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
};

const inputStyles: Record<InputLocations, string> = {
  [InputLocations.registerOrLogin]:
    "w-full px-4 py-3 rounded-md bg-white/20 outline-none text-sm text-white placeholder:text-gray-300 xl:text-base",
  [InputLocations.dashboard]: "",
};

const defineInputStyles = (location: InputLocations) => inputStyles[location];

const Input = <T extends FieldValues>({
  label,
  type,
  placeholder,
  location,
  name,
  id,
  register,
  errors,
}: InputProps<T>) => {
  const [inputType, setInputType] = useState(type);

  const handleShowPassword = () => {
    setInputType((prev) => {
      if (prev === "password") return "text";
      else return "password";
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="relative flex items-center">
        <input
          type={inputType}
          id={id}
          placeholder={placeholder}
          {...register(name)}
          className={defineInputStyles(location)}
        />
        {type === "password" &&
          (inputType === "password" ? (
            <FaEye
              className="text-gray-300 text-lg absolute right-5 cursor-pointer"
              onClick={handleShowPassword}
            />
          ) : (
            <FaEyeSlash
              className="text-gray-300 text-lg absolute right-5 cursor-pointer"
              onClick={handleShowPassword}
            />
          ))}
      </div>
      {errors[name] && (
        <p className="text-red-400 text-sm">
          {errors[name]?.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default Input;

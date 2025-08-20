import React from "react";
import { Input } from "../ui/input";

const CustomInput = ({
  value,
  onChange,
  placeholder = "Enter text",
  className = "",
  ...props
}) => {
  return (
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full ${className}`}
      {...props}
    />
  );
};

export default CustomInput;

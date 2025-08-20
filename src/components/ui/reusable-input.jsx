import { Input } from "./input";
import { Label } from "./label";

export const ReusableInput = ({
  label,
  type = "text",
  name,
  placeholder,
  icon: Icon,
  onChange,
  value,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 mb-1">
      {/* <Label>{label}</Label> */}
      <div className="flex gap-2 items-center">
        <Input
          type={type}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          {...props}
        />
        {Icon && <Icon />}
      </div>
    </div>
  );
};

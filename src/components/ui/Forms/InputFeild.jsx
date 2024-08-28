import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";

const InputFeild = ({
  name,
  label,
  placeholder,
  type = "text",
  required,
  className,
  defaultValue,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className={`relative text-left w-full ${className}`}>
          {label && (
            <label
              className={`font-medium text-gray-700 text-sm
              }`}
            >
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          )}
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            required={required}
            defaultValue={defaultValue}
            className={`${
              error && "border-red-500"
            } shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default InputFeild;

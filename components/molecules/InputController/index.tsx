import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";

interface InputControllerProps {
  name?: string;
  label?: string;
  register: any;
  error?: any;
  type?:
    | "text"
    | "file"
    | "date"
    | "email"
    | "password"
    | "date"
    | "select"
    | "number";
}

const InputController = ({
  label,
  name,
  register,
  error,
  type,
}: InputControllerProps) => {
  return (
    <FormControl style={{ marginTop: "10px" }} isInvalid={error}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        type={type}
        id={name}
        placeholder={name}
        {...register(`${name}`, {
          required: `${name} is required`,
        })}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

const TextAreaController = ({
  label,
  name,
  register,
  error,
}: InputControllerProps) => {
  return (
    <FormControl style={{ marginTop: "10px" }} isInvalid={error}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Textarea
        size={"lg"}
        id={name}
        placeholder={name}
        {...register(`${name}`, {
          required: `${name} is required`,
        })}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export { InputController, TextAreaController };

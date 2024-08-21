import React, { PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { FaSpinner } from "react-icons/fa";

const SubmitButton = ({ children }: PropsWithChildren) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="md:self-start">
      {children}
      {pending && <FaSpinner className="animate-spin ml-2" />}
    </Button>
  );
};

export default SubmitButton;

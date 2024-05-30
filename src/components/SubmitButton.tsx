"use client";

import { Button, ButtonProps } from "@/components/Button";

import { useFormStatus } from "react-dom";

interface LeaveButtonProps extends React.PropsWithChildren {
  tone: ButtonProps["tone"];
}

export const SubmitButton: React.FC<LeaveButtonProps> = ({
  tone,
  children,
}) => {
  const { pending } = useFormStatus();

  return (
    <>
      <Button tone={tone} variant="solid" loading={pending} disabled={pending}>
        {children}
      </Button>
    </>
  );
};

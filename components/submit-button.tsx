'use client';

import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react';
import { experimental_useFormState as useFormState } from 'react-dom';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pendingText?: string;
}

export function SubmitButton({
  children,
  pendingText = 'Submitting...',
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} type="submit" disabled={pending}>
      {pending ? pendingText : children}
    </Button>
  );
}

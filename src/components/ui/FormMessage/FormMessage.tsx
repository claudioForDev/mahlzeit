import type { ReactNode } from 'react';
import { CircleAlert, CircleCheck } from 'lucide-react';

interface FormMessageProps {
  type: 'error' | 'info';
  children: ReactNode;
}

// Error or success message with icon; role makes screen readers announce it
export function FormMessage({ type, children }: FormMessageProps) {
  const Icon = type === 'error' ? CircleAlert : CircleCheck;

  return (
    <div
      className={`form__${type}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <Icon size={18} aria-hidden="true" className="form__icon" />
      <div>{children}</div>
    </div>
  );
}

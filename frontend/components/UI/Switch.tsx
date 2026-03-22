'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

type SwitchProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
};

export default function Switch({ checked, onChange, label, disabled, id }: SwitchProps) {
  const generatedId = React.useId();
  const switchId = id || generatedId;

  return (
    <div className="flex items-center gap-3">
      {label && (
        <label htmlFor={switchId} className="text-sm font-medium text-foreground select-none cursor-pointer">
          {label}
        </label>
      )}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          checked ? "bg-primary" : "bg-muted",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

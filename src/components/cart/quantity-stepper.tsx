"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  quantity,
  onChange,
  disabled,
}: {
  quantity: number;
  onChange: (next: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center border border-ink/20">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || quantity <= 1}
        onClick={() => onChange(quantity - 1)}
        className="flex h-8 w-8 items-center justify-center text-ink transition-colors hover:bg-ink/5 disabled:opacity-30"
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center font-body text-sm text-ink">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled}
        onClick={() => onChange(quantity + 1)}
        className="flex h-8 w-8 items-center justify-center text-ink transition-colors hover:bg-ink/5 disabled:opacity-30"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

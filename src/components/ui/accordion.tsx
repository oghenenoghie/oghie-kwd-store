"use client";

import * as RadixAccordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = RadixAccordion.Root;

export function AccordionSection({
  value,
  title,
  children,
}: {
  value: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <RadixAccordion.Item value={value} className="border-b border-ink/10">
      <RadixAccordion.Header>
        <RadixAccordion.Trigger
          className={cn(
            "group flex w-full items-center justify-between py-4 text-left font-body text-xs uppercase tracking-widest text-ink",
          )}
        >
          {title}
          <ChevronDown size={16} className="transition-transform group-data-[state=open]:rotate-180" />
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>
      <RadixAccordion.Content className="overflow-hidden font-body text-sm leading-relaxed text-stone data-[state=open]:pb-4">
        {children}
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  );
}

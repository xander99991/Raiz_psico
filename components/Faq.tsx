'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`rounded-3xl border transition ${isOpen ? 'border-turquesa/40 bg-white' : 'border-marino/10 bg-white/50'}`}>
            <button
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display font-bold text-marino-900"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              {it.q}
              <Plus className={`h-5 w-5 shrink-0 text-turquesa transition duration-300 ${isOpen ? 'rotate-45' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <p className="px-6 pb-6 leading-relaxed text-tinta/75">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
// import { useLanguage } from "@/app/utils/language/useLanguage";

export default function AccordionSection({ titleKey, children, initiallyOpen = false }) {
  const [open, setOpen] = useState(initiallyOpen);
  // const language = useLanguage();

  const toggleOpen = () => setOpen(!open);

  return (
    <div className="accordion-section border rounded-md mb-4 shadow-sm">
      {/* Section Header */}
      <div
        onClick={toggleOpen}
        className="flex justify-between items-center cursor-pointer px-4 py-3 bg-gray-100 hover:bg-gray-200"
      >
        <h2 className="text-lg font-semibold">{titleKey}</h2>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {/* Section Content */}
      {open && (
        <div className="px-4 py-4 bg-white border-t">
          {children}
        </div>
      )}
    </div>
  );
}

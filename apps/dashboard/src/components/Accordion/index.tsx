'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenItems?: string[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenItems = [],
  className = '',
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(defaultOpenItems)
  );

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems);
    
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      if (!allowMultiple) {
        newOpenItems.clear();
      }
      newOpenItems.add(itemId);
    }
    
    setOpenItems(newOpenItems);
  };

  return (
    <div className={`accordion ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const isDisabled = item.disabled;

        return (
          <div
            key={item.id}
            className="accordion-item border border-gray-200 rounded-lg mb-2 overflow-auto"
          >
            <button
              className={`accordion-header w-full px-4 py-3 text-left flex items-center justify-between transition-colors duration-200 ${
                isDisabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 text-gray-900 cursor-pointer'
              } ${isOpen ? 'border-b border-gray-200' : ''}`}
              onClick={() => !isDisabled && toggleItem(item.id)}
              disabled={isDisabled}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
            >
              <span className="accordion-title font-medium">
                {item.title}
              </span>
              <Icon
                icon="mdi:chevron-down"
                className={`accordion-icon text-xl transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                } ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}
              />
            </button>
            
            <div
              id={`accordion-content-${item.id}`}
              className={`accordion-content transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
              } overflow-auto`}
            >
              <div className="p-4 bg-gray-50 text-gray-700">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;

import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionWrapper({ children, className = '' }: SectionWrapperProps) {
  return (
    <section className={`py-12 sm:py-16 bg-white dark:bg-gray-900 ${className}`}>
      {children}
    </section>
  );
}

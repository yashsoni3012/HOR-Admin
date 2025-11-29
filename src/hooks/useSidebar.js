import { useState } from 'react';

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  return { isOpen, toggle };
};
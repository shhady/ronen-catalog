'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on non-dashboard pages
    setIsVisible(!pathname.startsWith('/dashboard'));
  }, [pathname]);

  const handleClick = () => {
    fetch('/api/analytics/whatsapp-click', { method: 'POST' });
  };

  if (!isVisible) return null;

  return (
    <a
      href="https://wa.me/972544477218" // Replace with your WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-colors z-50"
      onClick={handleClick}
    >
      <svg
        className="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20.4 3.6C18.2 1.3 15.2 0 12 0 5.4 0 0 5.4 0 12c0 2.1.5 4.2 1.4 6L0 24l6.2-1.4c1.8.9 3.8 1.4 5.8 1.4 6.6 0 12-5.4 12-12 0-3.2-1.3-6.2-3.6-8.4zM12 22c-1.8 0-3.6-.5-5.2-1.4l-.4-.2-3.8.9.9-3.8-.2-.4C2.5 15.6 2 13.8 2 12 2 6.5 6.5 2 12 2c2.6 0 5 1 6.8 2.8C20.6 6.6 21.6 9 21.6 12c0 5.5-4.5 10-9.6 10zm5.2-7.4c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.1-.2.2-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.9-2.8-1.6-4-3.6-.3-.5.3-.5.9-1.7.1-.2 0-.4-.1-.6-.1-.2-.7-1.6-1-2.2-.2-.6-.5-.5-.7-.5-.2 0-.4 0-.6 0-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4 0-.2-.2-.3-.5-.4z" />
      </svg>
    </a>
  );
} 
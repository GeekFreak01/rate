import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Button({ children, onClick, className = "" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-white text-black font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition ${className}`}
    >
      {children}
    </button>
  );
}


// contacts/layout.tsx
"use client";
import { ReactNode } from "react";
import Link from "next/link";

export default function ContactsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {children}
    </div>
  );
}
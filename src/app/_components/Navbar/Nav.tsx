"use client";
import { useState } from "react";
import Link from "next/link";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white fixed w-full z-50 top-0 left-0 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* ✅ لوجو الموقع */}
        <Link href="/" className="text-2xl font-bold text-yellow-400">
          🎬 MovieApp
        </Link>

        {/* ✅ روابط الناف بار (تظهر فقط في شاشات الكمبيوتر) */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="hover:text-yellow-400 transition font-medium">Home</Link>
          <Link href="/movies" className="hover:text-yellow-400 transition font-medium">Movies</Link>
          <Link href="/watchlist" className="hover:text-yellow-400 transition font-medium">Watchlist</Link>
          <Link href="/add" className="hover:text-yellow-400 transition font-medium">add</Link>
        </div>

        {/* ✅ زر القائمة الجانبية للموبايل */}
        <button className="md:hidden text-2xl focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* ✅ القائمة الجانبية للموبايل */}
      <div
        className={`md:hidden bg-gray-800 text-white flex flex-col items-center space-y-6 py-6 transition-all duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <Link href="/" className="hover:text-yellow-400 transition font-medium" onClick={() => setIsOpen(false)}>Home</Link>
        <Link href="/movies" className="hover:text-yellow-400 transition font-medium" onClick={() => setIsOpen(false)}>Movies</Link>
        <Link href="/watchlist" className="hover:text-yellow-400 transition font-medium" onClick={() => setIsOpen(false)}>Watchlist</Link>
      </div>
    </nav>
  );
}

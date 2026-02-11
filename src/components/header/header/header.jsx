'use client'

import React, { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import logo from "../../../assets/logo/logo2.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`
      bg-white py-4 transition-all duration-500 z-[1000] sticky top-0 right-0 left-0 w-full shadow-md
      ${isMenuOpen ? 'mobile-nav-active' : ''}
    `}>
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center h-14">
            <Link href="/" className="flex items-center no-underline gap-2.5">
              <Image 
                src={logo} 
                alt="Diamond Aligner Logo" 
                className="max-h-10 w-auto"
                width={40}
                height={40}
              />
              <span className="text-3xl font-light text-gray-700 font-['Poppins']">
                Dia<span className="text-blue-600 font-medium">mond</span>
              </span>
            </Link>
          </div>

          {/* Burger Menu Toggle for Mobile */}
          <button
            className={`
              xl:hidden flex flex-col bg-none border-none cursor-pointer p-1
              fixed top-5 right-5 z-[9999] transition-colors duration-500
              ${isMenuOpen ? 'text-gray-500' : 'text-gray-800'}
            `}
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
          >
            <span className="w-6 h-0.5 bg-current my-0.5 transition-all duration-300"></span>
            <span className="w-6 h-0.5 bg-current my-0.5 transition-all duration-300"></span>
            <span className="w-6 h-0.5 bg-current my-0.5 transition-all duration-300"></span>
          </button>

          {/* Navbar Links */}
          <nav className={`
            p-0 relative
            xl:block
            ${isMenuOpen ? 'fixed top-0 right-0' : 'fixed top-0 -right-full'}
            xl:relative xl:top-auto xl:right-auto
            w-full xl:w-auto h-screen xl:h-auto
            bg-gray-500/95 xl:bg-transparent
            transition-all duration-300 z-[9997]
            flex xl:flex-row flex-col
            pt-20 xl:pt-0
          `}>
            <ul className={`
              m-0 p-0 flex list-none items-center gap-5
              xl:flex-row flex-col xl:items-center items-start
              xl:text-left text-left w-full xl:w-auto
              xl:p-0 p-8
            `}>
              <li className="relative">
                <Link href="/about" className={`
                  flex items-center py-3.5 px-5 font-['Poppins'] text-base font-normal
                  whitespace-nowrap transition-all duration-300 relative no-underline
                  xl:text-gray-800 text-white
                  hover:text-blue-600 xl:hover:text-blue-600
                  before:content-[''] before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0
                  before:bg-blue-600 before:invisible before:transition-all before:duration-300 before:scale-x-0
                  hover:before:visible hover:before:scale-x-70
                  xl:text-lg xl:font-medium xl:p-4 xl:w-full xl:text-left
                `}>
                  À propos
                </Link>
              </li>
              <li className="relative">
                <Link href="/innovation" className={`
                  flex items-center py-3.5 px-5 font-['Poppins'] text-base font-normal
                  whitespace-nowrap transition-all duration-300 relative no-underline
                  xl:text-gray-800 text-white
                  hover:text-blue-600 xl:hover:text-blue-600
                  before:content-[''] before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0
                  before:bg-blue-600 before:invisible before:transition-all before:duration-300 before:scale-x-0
                  hover:before:visible hover:before:scale-x-70
                  xl:text-lg xl:font-medium xl:p-4 xl:w-full xl:text-left
                `}>
                  Innovation
                </Link>
              </li>
              <li className="relative">
                <Link href="/cases" className={`
                  flex items-center py-3.5 px-5 font-['Poppins'] text-base font-normal
                  whitespace-nowrap transition-all duration-300 relative no-underline
                  xl:text-gray-800 text-white
                  hover:text-blue-600 xl:hover:text-blue-600
                  before:content-[''] before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0
                  before:bg-blue-600 before:invisible before:transition-all before:duration-300 before:scale-x-0
                  hover:before:visible hover:before:scale-x-70
                  xl:text-lg xl:font-medium xl:p-4 xl:w-full xl:text-left
                `}>
                  Cas Traitables
                </Link>
              </li>
              <li className="relative">
                <Link href="/news" className={`
                  flex items-center py-3.5 px-5 font-['Poppins'] text-base font-normal
                  whitespace-nowrap transition-all duration-300 relative no-underline
                  xl:text-gray-800 text-white
                  hover:text-blue-600 xl:hover:text-blue-600
                  before:content-[''] before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0
                  before:bg-blue-600 before:invisible before:transition-all before:duration-300 before:scale-x-0
                  hover:before:visible hover:before:scale-x-70
                  xl:text-lg xl:font-medium xl:p-4 xl:w-full xl:text-left
                `}>
                  Actus & Events
                </Link>
              </li>
              <li className="relative">
                <Link href="/assistance" className={`
                  flex items-center py-3.5 px-5 font-['Poppins'] text-base font-normal
                  whitespace-nowrap transition-all duration-300 relative no-underline
                  xl:text-gray-800 text-white
                  hover:text-blue-600 xl:hover:text-blue-600
                  before:content-[''] before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0
                  before:bg-blue-600 before:invisible before:transition-all before:duration-300 before:scale-x-0
                  hover:before:visible hover:before:scale-x-70
                  xl:text-lg xl:font-medium xl:p-4 xl:w-full xl:text-left
                `}>
                  Assistance professionnelle
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4 xl:flex hidden">
            <Link href="/getstarted" className="
              bg-blue-600 text-white py-2.5 px-5 rounded-xl no-underline
              font-['Poppins'] font-medium transition-all duration-300
              hover:bg-blue-700 hover:text-white hover:-translate-y-0.5
            ">
              Get Started
            </Link>
            <Link href="/signin" className="
              text-blue-600 py-2.5 px-5 border-2 border-blue-600 rounded-xl no-underline
              font-['Poppins'] font-medium transition-all duration-300
              hover:bg-blue-600 hover:text-white
            ">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
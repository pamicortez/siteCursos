"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, User, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [categoryTimeout, setCategoryTimeout] = useState<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();
  
  const [hasUser, setHasUser] = useState(true);
  const [currentPath, setCurrentPath] = useState('/');
  const categories = ["Informática", "Português", "Ciências"];
  
  useEffect(() => {
    setCurrentPath(window.location.pathname);
    
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
    setCategoryMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuOpen && !(e.target as Element).closest('#user-menu-container')) {
        setUserMenuOpen(false);
      }
      if (categoryMenuOpen && !(e.target as Element).closest('#category-menu-container')) {
        setCategoryMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [userMenuOpen, categoryMenuOpen]);

  const handleCategoryMouseEnter = () => {
    if (categoryTimeout) {
      clearTimeout(categoryTimeout);
      setCategoryTimeout(null);
    }
    setCategoryMenuOpen(true);
  };

  const handleCategoryMouseLeave = () => {
    const timeout = setTimeout(() => {
      setCategoryMenuOpen(false);
    }, 300);
    setCategoryTimeout(timeout);
  };

  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
  };

  const handleNavigation = (path: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    window.location.href = path;
  };

  return (
    <>
      {!hasUser && (
        <div className="bg-black text-white py-2 text-center text-sm w-full fixed top-0 z-50">
          Deseja cadastrar seus cursos? Entre em contato através de{" "}
          <a href="mailto:email01@gmail.com" className="underline hover:text-gray-200">
            email01@gmail.com
          </a>
        </div>
      )}
      
      <nav
        className={cn(
          "fixed w-full z-40 transition-all duration-300 ease-in-out shadow-md",
          hasUser ? "top-0" : "top-6",
          scrolled
            ? "backdrop-blur-xl bg-gray-900/80 border-b border-gray-700 py-4" // Alterado para fundo escuro
            : "bg-gray-900 py-6" // Alterado para fundo escuro
        )}
      >
        <div className="container mx-auto px-6 md:px-8">
          <div className="flex items-center">
            {/* Logo and Categories */}
            <div className="flex items-center space-x-20 w-1/4">
              <Logo />
              
              {/* Categories Dropdown */}
              <div 
                id="category-menu-container" 
                className="hidden md:flex items-center space-x-2 relative"
                onMouseEnter={handleCategoryMouseEnter}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <span className="text-gray-200">Categorias</span> {/* Texto claro */}
                <button className="flex items-center justify-center w-9 h-9 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors cursor-pointer">
                  <ChevronDown className="w-5 h-5 text-gray-200" /> {/* Ícone claro */}
                </button>

                {/* Categories Dropdown Menu */}
                <div 
                  className={cn(
                    "absolute left-0 mt-2 w-48 top-full rounded-md bg-gray-800 py-2 shadow-lg ring-1 ring-gray-700 focus:outline-none transition-all duration-200 ease-in-out", // Fundo escuro
                    categoryMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                  )}
                >
                  {categories.map((category, index) => (
                    <a 
                      key={index}
                      href={`/category/${category.toLowerCase()}`}
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700" // Texto claro
                    >
                      {category}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex justify-center flex-1 px-4">
              <div className="relative w-full max-w-xl">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input 
                  type="search" 
                  className="block w-full p-2 pl-10 text-sm border border-gray-700 rounded-full bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-600 text-gray-200 placeholder-gray-400" // Estilo escuro
                  placeholder="Pesquise aqui"
                />
              </div>
            </div>

            {/* Desktop Navigation - User Profile */}
            {hasUser && (
            <div className="hidden md:flex items-center justify-end w-1/4">
              <div id="user-menu-container" className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center justify-center w-9 h-9 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors" // Botão escuro
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <User className="w-5 h-5 text-gray-200" /> {/* Ícone claro */}
                </button>

                <div 
                  className={cn(
                    "absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-2 shadow-lg ring-1 ring-gray-700 focus:outline-none transition-all duration-200 ease-in-out", // Fundo escuro
                    userMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                  )}
                >
                  <div className="px-4 py-2 text-sm text-gray-200 border-b border-gray-700"> {/* Texto claro */}
                    <div className="font-medium">User Account</div>
                    <div className="text-xs text-gray-400">user@example.com</div> {/* Texto mais claro */}
                  </div>
                  <a href="/profile" onClick={(e) => handleNavigation('/profile', e)} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">Your Profile</a>
                  <a href="/settings" onClick={(e) => handleNavigation('/settings', e)} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">Settings</a>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">Sign out</button>
                </div>
              </div>
            </div>)}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-200 focus:outline-none transition-all duration-200 ease-in-out ml-auto" // Ícone claro
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close Menu" : "Open Menu"}
            >
              {isOpen ? (
                <X className="w-6 h-6 transition-all duration-300 ease-in-out" />
              ) : (
                <Menu className="w-6 h-6 transition-all duration-300 ease-in-out" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "fixed inset-0 bg-gray-900 z-40 flex flex-col justify-center items-center transition-all duration-500 ease-in-out md:hidden", // Fundo escuro
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
          )}
        >
          {/* Mobile Search */}
          <div className="w-full px-6 mb-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input 
                type="search" 
                className="block w-full p-2 pl-10 text-sm border border-gray-700 rounded-full bg-gray-800 text-gray-200 placeholder-gray-400" // Estilo escuro
                placeholder="Pesquise aqui"
              />
            </div>
          </div>
          
          {/* Mobile Categories */}
          <div className="w-full px-6 mb-6">
            <div className="font-medium mb-2 text-gray-200">Categorias</div> {/* Texto claro */}
            {categories.map((category, index) => (
              <a 
                key={index}
                href={`/category/${category.toLowerCase()}`}
                className="block py-2 text-gray-400 hover:text-white" // Texto claro
                onClick={() => setIsOpen(false)}
              >
                {category}
              </a>
            ))}
          </div>

          <div className="flex flex-col space-y-6 items-center">
            <a
              href="/profile"
              className="text-xl font-medium transition-all duration-200 transform hover:scale-105 text-gray-400 hover:text-white" // Texto claro
              onClick={(e) => {
                handleNavigation('/profile', e);
                setIsOpen(false);
              }}
            >
              Profile
            </a>
            <a
              href="/settings"
              className="text-xl font-medium transition-all duration-200 transform hover:scale-105 text-gray-400 hover:text-white" // Texto claro
              onClick={(e) => {
                handleNavigation('/settings', e);
                setIsOpen(false);
              }}
            >
              Settings
            </a>
            <button 
              className="text-xl font-medium transition-all duration-200 transform hover:scale-105 text-gray-400 hover:text-white" // Texto claro
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>
      <div
        className={cn(
          "w-full",
          hasUser ? (scrolled ? "h-28" : "h-32") : (scrolled ? "h-24" : "h-32")
        )}
      ></div>
    </>
  );
};

export default Navbar;
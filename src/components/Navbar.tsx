'use client'

import { Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import { usePathname } from 'next/navigation';


export default function MainNavbar() {
  const pathname = usePathname();

  return (
    <Navbar className="bg-gray-900 border-b border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] px-6 py-4">
      <NavbarBrand>
        <span className="hidden sm:block font-semibold text-xl tracking-tight text-blue-400">
          Meme Directory
        </span>
      </NavbarBrand>

      <NavbarContent className="flex justify-center sm:justify-end sm:ml-auto w-full sm:w-auto">
        <NavbarItem isActive={pathname === '/table'}>
          <Link
            href="/table"
            className={`text-white hover:text-blue-300 px-4 py-2 rounded-lg transition-all duration-200 ${
              pathname === '/table'
                ? 'bg-blue-900 shadow-[0_0_8px_rgba(59,130,246,0.7)] border border-blue-500'
                : 'hover:bg-gray-800'
            }`}
          >
            Table View
          </Link>
        </NavbarItem>

        <NavbarItem isActive={pathname === '/list'}>
          <Link
            href="/list"
            className={`text-white hover:text-blue-300 px-4 py-2 rounded-lg transition-all duration-200 ${
              pathname === '/list'
                ? 'bg-blue-900 shadow-[0_0_8px_rgba(59,130,246,0.7)] border border-blue-500'
                : 'hover:bg-gray-800'
            }`}
          >
            List View
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

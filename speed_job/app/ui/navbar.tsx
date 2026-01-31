"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MagnifyingGlassIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import getjobeasy from "@/public/tiny.png"

export default function Navbar() {
  const [hovered, setHovered] = useState(false);
  

  return (
<header className="sticky top-0 z-50 bg-gradient-to-r from-[#072a40] via-[#072a40]/90 to-[#082A45] text-white shadow-md">

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={getjobeasy}
            alt="Vaco logo"
            width={160}
            height={160}
            className="object-contain"
          />
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex gap-6 text-sm font-semibold items-center ">
          {/* Hoverable Solutions and Services */}
          <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Link href="#" className="hover:text-orange-400 ">
              Solutions and Services
            </Link>

            {/* Dropdown */}
            {hovered && (
              <div className="absolute left-40 -translate-x-1/2 top-full mt-4 w-[960px] bg-white text-black shadow-2xl rounded-xl p-4 z-50 grid grid-cols-4 gap-6 text-sm">
                {/* Column 1 */}
                <div className="">
                  <h3 className="text-sm font-bold text-slate-900">Solutions and Services</h3>
                  <p className="mt-2 text-gray-600">
                    Our holistic approach integrates with Highspring’s broader services, spanning
                    strategy, implementation, and talent.
                  </p>

                   <Link
                    href="#"
                    className="text-orange-600 font-semibold mt-2 inline-block hover:underline"
                  >
                    Learn more ↗
                  </Link>
                </div>

                {/* Column 2 */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Talent Solutions</h4>
                  <p className="text-gray-600">
                    Recruiting and strategic staffing services to strengthen your existing team or
                    build new capabilities
                  </p>
                  <Link
                    href="#"
                    className="text-orange-600 font-semibold mt-2 inline-block hover:underline"
                  >
                    Learn more ↗
                  </Link>
                </div>

                {/* Column 3 */}
                <div>

                  <div className="">
                    <h4 className="text-sm font-semibold text-slate-900">Managed Services</h4>
                    <p className="text-gray-600">
                      Outsourcing for critical business operations so your team can focus on what
                      they do best
                    </p>
                  </div>
                   <Link
                    href="#"
                    className="text-orange-600 font-semibold mt-2 inline-block hover:underline"
                  >
                    Learn more ↗
                  </Link>
                </div>

                
              </div>
            )}
          </div>

          {/* Other nav items */}
          <Link href="#" className="hover:text-orange-400">
            Expertise
          </Link>

          <Link href="#" className="hover:text-orange-400">
            About Us
          </Link>
        </div>

        {/* Icons and CTA */}
        <div className="flex items-center gap-4">
          <MagnifyingGlassIcon className="w-5 h-5 cursor-pointer text-white" />
          <GlobeAltIcon className="w-5 h-5 cursor-pointer text-white" />
          <Link
            href="/contact"
            className="bg-orange-500 hover:bg-orange-600 transition px-4 py-2 text-sm font-semibold rounded-md text-white"
          >
            Contact Us
          </Link>
        </div>
      </nav>
    </header>
  );
}

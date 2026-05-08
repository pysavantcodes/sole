"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
// import { WiMoonWaxingCrescent5 } from "react-icons/wi";
// import { MdSunny } from "react-icons/md";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const navLinks = [
  { label: "OUR WHY", href: "/why" },
  { label: "OUR STORY", href: "/story" },
  { label: "OUR ECOSYSTEM", href: "/ecosystem" },
];

const authLinks = [
  {
    label: "LOG IN",
    href: "/login",
    className: "bg-[#151515] border border-[#151515] hover:bg-[#333333]",
  },
  {
    label: "SIGN UP",
    href: "/signup",
    className: "bg-[#111111F0] border border-white hover:bg-[#151515]",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const baseBtn =
    "px-6 py-2 rounded-full text-lg sm:text-base lg:text-xs text-center";

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 bg-[#111111F0] text-white border-b border-white/10"
    >
      {/* MAIN NAV */}
      <div className="relative flex items-center justify-between py-3 px-6 sm:px-12 lg:px-16 xl:px-24">
        {/* LOGO */}
        <Link
          href="/"
          className="relative z-10 basis-1/3"
          onClick={() => setIsOpen(false)}
        >
          <img
            src="/logo.png"
            alt="logo"
            className="w-10 sm:w-12 lg:w-14 invert"
          />
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="basis-1/3 hidden lg:flex absolute left-1/2 -translate-x-1/2 gap-x-4 ">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`${baseBtn} bg-[#151515] hover:bg-[#333333]`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className=" hidden lg:flex gap-x-4 items-center relative z-10">
          {!isAuthenticated
            ? authLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`${baseBtn} ${link.className}`}
                >
                  {link.label}
                </Link>
              ))
            : null}

          {isAuthenticated ? (
            <Link
              href="/account"
              className="hover:text-white/75 flex items-center bg-white/5 border border-white/10 gap-3 px-4 py-2 rounded-full"
            >
              <FiUser className="text-base sm:text-lg" />
              <p className="text-sm">{user?.name ?? "My Account"}</p>
            </Link>
          ) : null}

          {/* THEME */}
          {/* <div className="flex bg-[#151515] px-4 py-2 rounded-full gap-x-2">
                        <MdSunny className="text-xl" />
                        <WiMoonWaxingCrescent5 className="text-xl" />
                    </div> */}
        </div>

        {/* MOBILE */}
        <div className="flex lg:hidden items-center gap-x-3 relative z-10">
          {isAuthenticated ? (
            <Link
              href="/account"
              className="flex max-w-35 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/90 hover:bg-white/10"
            >
              <FiUser className="text-sm shrink-0" />
              <span className="text-xs truncate">
                {user?.name?.trim().split(/\s+/)[0] ?? "Account"}
              </span>
            </Link>
          ) : null}
          <button onClick={toggleMenu}>
            {isOpen ? (
              <IoClose className="text-xl sm:text-3xl" />
            ) : (
              <HiOutlineMenuAlt3 className="text-xl sm:text-3xl" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-y-3 px-6 pb-6 sm:px-12">
          {/* NAV LINKS */}
          <div className="flex flex-col gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={toggleMenu}
                className={`${baseBtn} bg-[#151515] hover:bg-[#333333]`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-white/10 my-2" />

          {/* AUTH */}
          <div className="flex flex-col gap-y-2 sm:flex-row sm:gap-x-3">
            {!isAuthenticated ? (
              authLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={toggleMenu}
                  className={`${baseBtn} flex-1 ${link.className}`}
                >
                  {link.label}
                </Link>
              ))
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(true);
                  setIsOpen(false);
                }}
                className={`${baseBtn} flex-1 bg-[#151515] border border-white/20 hover:bg-[#333333]`}
              >
                LOG OUT
              </button>
            )}
          </div>

          <div className="border-t border-white/10 my-2" />

          {/* THEME */}
          {/* <div className="flex items-center justify-center gap-x-4">
                        <button className="flex items-center gap-x-2 bg-[#151515] px-6 py-3 rounded-full">
                            <MdSunny className="text-xl" />
                            <span className="text-sm">Light</span>
                        </button>
                        <button className="flex items-center gap-x-2 bg-[#151515] px-6 py-3 rounded-full">
                            <WiMoonWaxingCrescent5 className="text-xl" />
                            <span className="text-sm">Dark</span>
                        </button>
                    </div> */}
        </div>
      </div>

      {showLogoutConfirm ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#191919] p-5">
            <h3 className="font-ClashGrotesk-Semibold text-lg uppercase">
              Confirm Logout
            </h3>
            <p className="mt-2 text-sm text-white/65">
              Are you sure you want to log out of your account?
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-full border border-white/20 py-2.5 text-sm hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setShowLogoutConfirm(false);
                  router.replace("/login");
                  router.refresh();
                }}
                className="flex-1 rounded-full bg-white py-2.5 text-sm text-black hover:bg-white/90"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;

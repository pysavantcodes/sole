"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  FiMapPin,
  FiSettings,
  FiShoppingBag,
  FiUser,
  FiPackage,
} from "react-icons/fi";
import Link from "next/link";
import AccountHeader from "./AccountHeader";
import StarField from "../../ui/StarField";
import { useAuth } from "../../../context/AuthContext";

type AccountTab = "details" | "orders" | "address" | "settings";

interface AccountLayoutProps {
  title: string;
  subtitle: string;
  activeTab: AccountTab;
  children: ReactNode;
}

const menuItems = [
  { key: "details", label: "My Details", href: "/account", icon: FiUser },
  {
    key: "address",
    label: "My Address Book",
    href: "/account/address-book",
    icon: FiMapPin,
  },
  { key: "orders", label: "My Orders", href: "/account/orders", icon: FiPackage },
  {
    key: "settings",
    label: "Account Settings",
    href: "/account/settings",
    icon: FiSettings,
  },
  { key: "shop", label: "Shop more", href: "/pod", icon: FiShoppingBag },
] as const;

const AccountLayout = ({
  title,
  subtitle,
  activeTab,
  children,
}: AccountLayoutProps) => {
  const router = useRouter();
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <StarField className="w-full">
      <div className="bg-[#121212] min-h-[80dvh] pb-20 pt-8">
        <AccountHeader title={title} subtitle={subtitle} />

        <section className="px-4 py-8 sm:px-8 lg:px-12 xl:px-20">
          <div className="grid gap-5 lg:grid-cols-[210px_1fr] xl:grid-cols-[230px_1fr]">
            <aside className="min-w-0 lg:sticky lg:top-24 lg:h-fit">
              <nav
                className="flex w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0"
                aria-label="Account navigation"
              >
                {menuItems.map((item) => {
                  const isActive = item.key === activeTab;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs sm:text-sm transition lg:shrink lg:whitespace-normal ${
                        isActive
                          ? "border-white/60 bg-[#1f1f1f] text-white"
                          : "border-white/10 bg-[#161616] text-white/60 hover:bg-white/5 hover:text-white lg:border-transparent lg:bg-transparent"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon className="text-sm" />
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="mt-3 hidden w-full rounded-full border border-white/20 bg-[#191919] px-4 py-2.5 text-xs sm:text-sm text-white/75 transition hover:bg-white/5 hover:text-white lg:block"
              >
                Logout
              </button>
            </aside>

            <div>
              {children}
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="mt-6 w-full rounded-full border border-white/20 bg-[#191919] px-4 py-3 text-sm text-white/80 transition hover:bg-white/5 hover:text-white lg:hidden"
              >
                Logout
              </button>
            </div>
          </div>
        </section>
      </div>
      {showLogoutConfirm ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
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
    </StarField>
  );
};

export default AccountLayout;

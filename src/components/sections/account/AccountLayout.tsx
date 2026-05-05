import type { ReactNode } from "react";
import { FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import AccountHeader from "./AccountHeader";
import StarField from "../../ui/StarField";

type AccountTab = "details" | "orders" | "address" | "settings";

interface AccountLayoutProps {
  title: string;
  subtitle: string;
  activeTab: AccountTab;
  children: ReactNode;
}

const menuItems = [
  { key: "details", label: "My Details", href: "/account" },
  { key: "address", label: "My Address Book", href: "/account/address-book" },
  { key: "orders", label: "My Orders", href: "/account/orders" },
  { key: "settings", label: "Account Settings", href: "/account/settings" },
  { key: "shop", label: "Shop more", href: "/pod" },
] as const;

const AccountLayout = ({
  title,
  subtitle,
  activeTab,
  children,
}: AccountLayoutProps) => {
  return (
    <StarField className="w-full">
      <div className="bg-[#121212] min-h-[80dvh] pb-20 pt-8">
        <AccountHeader title={title} subtitle={subtitle} />

        <section className="px-4 py-8 sm:px-8 lg:px-12 xl:px-20">
          <div className="grid gap-5 lg:grid-cols-[210px_1fr] xl:grid-cols-[230px_1fr]">
            <aside className="rounded-2xl border border-white/10 bg-[#191919] p-3 lg:bg-transparent lg:border-0 lg:p-0">
              <nav className="grid gap-2">
                {menuItems.map((item) => {
                  const isActive = item.key === activeTab;
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={`rounded-full px-4 py-2.5 text-xs sm:text-sm transition ${
                        isActive
                          ? "border border-white/50 bg-[#191919] text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="inline-flex items-center gap-3">
                        <FiUser className="text-sm" />
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <div>{children}</div>
          </div>
        </section>
      </div>
    </StarField>
  );
};

export default AccountLayout;

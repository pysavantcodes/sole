import { FiMail } from "react-icons/fi";
import { useMemo } from "react";
import AccountLayout from "../../components/sections/account/AccountLayout";
import { useAuth } from "../../context/AuthContext";

const MyAccount = () => {
  const { user } = useAuth();

  const { firstName, lastName } = useMemo(() => {
    const full = (user?.name ?? "").trim();
    if (!full) return { firstName: "", lastName: "" };
    const parts = full.split(/\s+/);
    return {
      firstName: parts[0] ?? "",
      lastName: parts.slice(1).join(" "),
    };
  }, [user?.name]);

  return (
    <AccountLayout
      title="MY ACCOUNT"
      subtitle="View your order history and check the delivery status for items"
      activeTab="details"
    >
      <div className="rounded-2xl bg-[#191919] p-5 sm:p-6 lg:p-7">
        <h2 className="font-ClashGrotesk-Semibold text-2xl sm:text-3xl uppercase">
          MY DETAILS
        </h2>

        <form className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs uppercase text-white/55">
                <FiMail /> First Name
              </label>
              <input
                value={firstName}
                readOnly
                className="w-full rounded-xl border border-white/15 bg-[#191919] px-4 py-2.5 text-xs sm:text-sm outline-none"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs uppercase text-white/55">
                <FiMail /> Last Name
              </label>
              <input
                value={lastName}
                readOnly
                className="w-full rounded-xl border border-white/15 bg-[#191919] px-4 py-2.5 text-xs sm:text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-xs uppercase text-white/55">
              <FiMail /> Email
            </label>
            <input
              value={user?.email ?? ""}
              readOnly
              className="w-full rounded-xl border border-white/15 bg-[#191919] px-4 py-2.5 text-xs sm:text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-xs uppercase text-white/55">
              <FiMail /> Phone
            </label>
            <input
              value={user?.phone ?? ""}
              readOnly
              className="w-full rounded-xl border border-white/15 bg-[#191919] px-4 py-2.5 text-xs sm:text-sm outline-none"
            />
          </div>

          <div className="pt-4" />
        </form>
      </div>
    </AccountLayout>
  );
};

export default MyAccount;

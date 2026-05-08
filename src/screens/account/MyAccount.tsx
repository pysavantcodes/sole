"use client";

import { FiMail } from "react-icons/fi";
import { Loader } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import AccountLayout from "../../components/sections/account/AccountLayout";
import { authAPI } from "../../api";
import { useAuth } from "../../context/AuthContext";

const MyAccount = () => {
  const { user, setAuthUser } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await authAPI.getDetails();
        const detailsUser = response.data.user;
        setName(detailsUser.name ?? "");
        setUsername(detailsUser.username ?? "");
        setPhone(detailsUser.phone ?? "");
        setEmail(detailsUser.email ?? "");
        setAuthUser(detailsUser);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load your details.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadDetails();
  }, [setAuthUser]);

  const { firstName, lastName } = useMemo(() => {
    const full = name.trim();
    if (!full) return { firstName: "", lastName: "" };
    const parts = full.split(/\s+/);
    return {
      firstName: parts[0] ?? "",
      lastName: parts.slice(1).join(" "),
    };
  }, [user?.name]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await authAPI.updateProfileDetails({
        name: name.trim(),
        username: username.trim(),
        phone: phone.trim(),
      });
      setAuthUser({
        ...(user ?? { id: 0, email }),
        name: name.trim(),
        username: username.trim(),
        phone: phone.trim(),
        email,
      });
      setSuccess("Details updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update your details.",
      );
    } finally {
      setSaving(false);
    }
  };

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

        {loading ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-white/70">
            <Loader className="h-4 w-4 animate-spin" />
            Loading details...
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs uppercase text-white/55">
                <FiMail /> Full Name
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#191919] px-4 py-2.5 text-xs sm:text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs uppercase text-white/55">
                <FiMail /> Username
              </label>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#191919] px-4 py-2.5 text-xs sm:text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs uppercase text-white/55">
                <FiMail /> Email
              </label>
              <input
                value={email}
                readOnly
                className="w-full rounded-xl border border-white/15 bg-[#191919] px-4 py-2.5 text-xs sm:text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs uppercase text-white/55">
                <FiMail /> Phone
              </label>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#191919] px-4 py-2.5 text-xs sm:text-sm outline-none"
              />
            </div>

            {error ? <p className="text-xs text-red-300">{error}</p> : null}
            {success ? (
              <p className="text-xs text-emerald-300">{success}</p>
            ) : null}

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-w-40 items-center justify-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-70"
              >
                {saving ? <Loader className="h-4 w-4 animate-spin" /> : null}
                {saving ? "Saving..." : "Save details"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AccountLayout>
  );
};

export default MyAccount;

import { PiMedalLight } from "react-icons/pi";
import AccountLayout from "../../components/sections/account/AccountLayout";

type Step = "ordered" | "confirmed" | "out_for_delivery" | "delivered";

const steps: { key: Step; label: string }[] = [
  { key: "ordered", label: "Ordered" },
  { key: "confirmed", label: "Confirmed" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

const orders = [
  {
    id: "#SLO0056",
    placedAt: "Placed on 13 Apr 2026",
    title: "SOLE POD OG",
    color: "Ivory",
    scent: "Lavender Calm",
    price: "$199.00",
    image: "/onyx.gif",
    status: "confirmed" as Step,
  },
  {
    id: "#SLO0057",
    placedAt: "Placed on 13 Apr 2026",
    title: "SOLE POD OG",
    color: "Ivory",
    scent: "Lavender Calm",
    price: "$199.00",
    image: "/onyx.gif",
    status: "delivered" as Step,
  },
];

const stepIndex = (step: Step) => steps.findIndex((s) => s.key === step);

const Orders = () => {
  return (
    <AccountLayout
      title="ORDERS"
      subtitle="View your order history and check the delivery status for items"
      activeTab="orders"
    >
      <div className="space-y-6">
        {orders.map((order) => {
          const activeStep = stepIndex(order.status);
          return (
            <article key={order.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-ClashGrotesk-Semibold text-2xl uppercase">
                  {order.id}
                </h3>
                <span className="text-xs uppercase text-white/45">
                  {order.placedAt}
                </span>
              </div>

              <div className="rounded-2xl bg-[#191919] p-4 sm:p-6">
                <div className="grid gap-5 lg:grid-cols-[170px_1fr_200px] xl:grid-cols-[190px_1fr_220px]">
                  <div className="rounded-2xl border border-white/15 bg-black p-3">
                    <img
                      src={order.image}
                      alt={order.title}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="py-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-ClashGrotesk-Semibold text-2xl uppercase">
                        {order.title}
                      </h4>
                      <PiMedalLight className="text-lg" />
                    </div>
                    <p className="mt-2 max-w-xl text-xs sm:text-sm text-white/40">
                      SoleCore Intelligent Motion & Lighting Engine. Real-time
                      coordination for motion, lighting, and security.
                    </p>
                    <p className="mt-4 text-xs sm:text-sm text-white/50">
                      COLOR:{" "}
                      <span className="text-white font-ClashGrotesk-Semibold">
                        {order.color}
                      </span>
                    </p>
                    <p className="mt-1 text-xs sm:text-sm text-white/50">
                      SCENT:{" "}
                      <span className="text-white font-ClashGrotesk-Semibold">
                        {order.scent}
                      </span>
                    </p>
                    <p className="mt-5 font-ClashGrotesk-Semibold text-3xl">
                      {order.price}
                    </p>
                  </div>

                  <div className="relative pl-7 pr-2">
                    <span className="absolute left-0.5 top-1 bottom-1 w-[3px] rounded-full bg-white/12" />
                    <span
                      className={`absolute left-0.5 top-1 w-[3px] rounded-full ${
                        order.status === "delivered" ? "bg-[#45FF66]" : "bg-white"
                      }`}
                      style={{
                        height:
                          steps.length <= 1
                            ? "0%"
                            : `${(activeStep / (steps.length - 1)) * 100}%`,
                      }}
                    />

                    <ul className="space-y-8">
                      {steps.map((s, i) => {
                        const complete = i <= activeStep;
                        const green = order.status === "delivered";
                        return (
                          <li key={s.key} className="flex items-center gap-3">
                            <span
                              className={`h-3.5 w-3.5 rounded-full ${
                                complete
                                  ? green
                                    ? "bg-[#45FF66] outline outline-[#45FF66] outline-offset-3"
                                    : "bg-white outline outline-white outline-offset-3"
                                  : "border border-white/50 bg-[#191919]"
                              }`}
                            />
                            <span
                              className={`${complete ? "text-white" : "text-white/55"} text-sm`}
                            >
                              {s.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </AccountLayout>
  );
};

export default Orders;

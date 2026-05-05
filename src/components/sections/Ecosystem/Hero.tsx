import GlowingButton from "../../ui/GlowingButton";
import { LuShare } from "react-icons/lu";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  easeOut,
} from "framer-motion";
import { useRef } from "react";

const Hero = () => {
  // ─────────────────────────────────────────────
  // SCROLL TRIGGER
  // ─────────────────────────────────────────────
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  // ─────────────────────────────────────────────
  // PARALLAX
  // ─────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  // ─────────────────────────────────────────────
  // ANIMATION VARIANTS
  // ─────────────────────────────────────────────
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  return (
    <div className="w-full pt-8">
      <motion.div
        ref={ref}
        className="flex flex-col items-center gap-8 py-6 px-4 sm:px-6 md:px-10 xl:px-20"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 border border-[#FFF3F342] bg-[#1b1b1b] py-2 px-5 rounded-full text-sm sm:text-base font-bold tracking-wider"
        >
          <span>VERIFIED SOLEMATE</span>
          <img src="/verify.png" alt="" className="h-4 w-4" />
        </motion.div>

        {/* Video + Share */}
        <motion.div
          variants={fadeUp}
          className="w-full flex flex-col lg:flex-row items-center lg:items-baseline justify-center gap-4"
        >
          <div className="w-full lg:ml-14 max-w-4xl rounded-2xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
            <motion.video
              src="/ecovid.MOV"
              autoPlay
              loop
              muted
              playsInline
              style={{ y }}
              className="w-full h-full object-cover"
            />
          </div>

          <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.1, rotate: 6 }}
            whileTap={{ scale: 0.9 }}
            className="border-2 border-[#2d2d2d] rounded-2xl p-4"
          >
            <LuShare className="text-xl sm:text-2xl" />
          </motion.div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          variants={fadeUp}
          className="w-full max-w-4xl flex flex-col gap-4 font-ClashGrotesk-Semibold"
        >
          {[
            { label: "SOLE CARD ID", value: "SC-1048" },
            { label: "SOLE MATE ID", value: "SC-1048-X2" },
            { label: "SOLE CARD SINCE", value: "16-08-26" },
            { label: "SOLE PODS OWNED", value: "8" },
            { label: "SOLE STATUS", value: "COMING SOON", muted: true },
            { label: "SOLE LOCKER", value: "COMING SOON", muted: true },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 rounded-xl bg-[#090909]"
            >
              <span className="text-sm sm:text-base">{item.label}</span>

              <div
                className={`rounded-xl px-6 py-3 text-center text-sm w-40 sm:text-base ${
                  item.muted ? "text-[#3a3a3a]" : "bg-[#181818]"
                }`}
              >
                {item.value}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Button */}
        <motion.div
          variants={fadeUp}
          className="w-full flex justify-center mt-6"
        >
          <GlowingButton className="gap-x-3 justify-center">
            <LuShare className="text-lg sm:text-xl" />
            Share State
          </GlowingButton>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;

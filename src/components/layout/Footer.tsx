import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import GlowingButton from "../ui/GlowingButton";
import { motion, useInView, easeOut } from "framer-motion";
import { useRef } from "react";

const Footer = () => {
  // ─────────────────────────────────────────────
  // SCROLL TRIGGER
  // ─────────────────────────────────────────────
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

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
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <motion.footer
      ref={ref}
      id="footer"
      className="scroll-mt-24 footer flex flex-col items-center mt-20 mb-0 gap-y-8 md:gap-y-12 text-white"
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Top section */}
      <motion.div
        variants={fadeUp}
        className="mx-4 rounded-xl border border-[#FFFFFF0F] top-footer-bg px-6 py-8 sm:mx-8 sm:px-8 md:mx-12 lg:mx-20 xl:mx-36 xl:px-12 md:min-w-185! lg:w-auto mb-10"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-start md:w-auto">
          {/* Left block */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center md:items-start md:w-auto text-center md:text-left"
          >
            <h2 className="text-center md:text-left uppercase leading-tight text-3xl lg:text-4xl">
              Be the First to Know
              <span className="font-ClashDisplay-Bold md:mr-6">
                {" "}
                OUR DEVELOPMENT PROGRESS.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-white/85 text-base">
              Stay in touch with early development updates, launch dates, and
              mystery surprises.
            </p>
          </motion.div>

          {/* Right block */}
          <motion.div
            variants={fadeUp}
            className="w-full flex flex-col items-start gap-y-4"
          >
            <div className="w-full flex flex-col gap-y-4">
              <span className="text-sm sm:text-base">
                Enter Your Email Address
              </span>

              <input
                type="email"
                className="w-full rounded-full bg-[#0D0D0D] px-6 py-4 text-base outline-none placeholder:text-white/40 sm:px-8 sm:text-lg"
                placeholder="your@email.com"
              />
            </div>

            <div className="flex w-full sm:w-auto">
              <GlowingButton href="#" className="w-dvw sm:w-auto!">
                Become A Solemate
              </GlowingButton>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom section */}
      <motion.div variants={fadeUp} className="w-full">
        <div className="footer-top-border h-4"></div>

        <div className="footer-bg px-4 py-8 sm:px-8 md:px-12 xl:px-36">
          <div className="grid grid-cols-1 gap-10 md:gap-6 text-center md:grid-cols-3 md:items-center md:text-left">
            {/* Left Section - Socials */}
            <motion.div
              variants={fadeUp}
              className="flex justify-center gap-3 md:justify-start"
            >
              {[FaInstagram, FaXTwitter, FaYoutube, FaTiktok].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -4, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="rounded-lg bg-[#1B1B1B] p-2 text-4xl text-white" />
                </motion.a>
              ))}
            </motion.div>

            {/* Center Section */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center justify-center text-center"
            >
              <span className="text-sm">SOLE CAPSULE</span>
              <span className="font-ClashGrotesk-Semibold tracking-wider text-[#979797] ">
                EVERY STEP IS PROTECTED
              </span>
            </motion.div>

            {/* Right Section */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap justify-center items-center gap-x-5 md:gap-x-3 gap-y-2 md:text-xs text-sm xl:justify-end"
            >
              <a href="/why" className="px-2 hover:text-white/55">
                OUR WHY
              </a>
              <a href="/story" className="px-2 hover:text-white/55">
                OUR STORY
              </a>
              <a href="/ecosystem" className="px-2 hover:text-white/55">
                OUR ECOSYSTEM
              </a>
            </motion.div>
          </div>

          <motion.div
            variants={fadeUp}
            className="flex justify-center py-8 md:py-12"
          >
            <img
              src="/footer-logo.png"
              alt="Footer logo"
              className="w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl"
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;

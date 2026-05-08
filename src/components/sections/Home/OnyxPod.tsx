import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import GlowingButton from "../../ui/GlowingButton";
import FlipCounter from "../../ui/FlipCounter";

interface ToggleProps {
  onChange?: (value: boolean) => void;
}

const OnyxPod = ({ onChange }: ToggleProps) => {
  const [enabled, setEnabled] = useState(false);
  const sectionRef = useRef(null);

  const toggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    onChange?.(newValue);
  };

  // Scroll-based animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <div className="w-full">
      <section
        ref={sectionRef}
        className="flex flex-col items-center justify-center
                py-6 sm:py-8
                gap-y-10 sm:gap-y-12
                px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24"
      >
        {/* LABEL */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex justify-center w-fit 
                    bg-[#151515] px-4 sm:px-5 
                    py-2 rounded-full 
                    sm:text-2xl 
                    font-ClashGrotesk-Extralight"
        >
          The <span className="font-bold mx-1">Onyx</span> Pod
        </motion.div>

        {/* HERO GIF */}
        <motion.div
          style={{ y, scale }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-xl md:max-w-2xl lg:max-w-3xl"
        >
          <img
            src="https://firebasestorage.googleapis.com/v0/b/sole-capsule-c8752.firebasestorage.app/o/web-gifs%2Fonyx.gif?alt=media&token=fac8a589-cfcb-4078-8327-afdeb1a84e07"
            alt="Onyx Pod"
            className="w-full h-auto object-contain"
          />
        </motion.div>

        {/* TOGGLE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggle}
          className={`relative 
                        w-14 h-8 sm:w-16 sm:h-9 
                        rounded-full cursor-pointer transition-all duration-300
                        ${enabled ? "bg-zinc-700" : "bg-zinc-800"}
                        shadow-inner`}
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`absolute -top-1 left-1 
                            w-9 h-9 sm:w-11 sm:h-11 
                            rounded-full transition-all duration-300
                            ${enabled ? "translate-x-6 sm:translate-x-7" : "-translate-x-2 sm:-translate-x-3"}
                            bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]`}
          />
        </motion.div>

        {/* COUNTDOWN */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <FlipCounter />
        </motion.div>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-row 
                    gap-4 sm:gap-6 
                    px-4 sm:px-6 py-4 
                    rounded-full items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.1, delay: 0.3 }}
          >
            <GlowingButton href="/pod" className="px-4 text-xs">
              Buy Now
            </GlowingButton>
          </motion.div>

          <motion.a
            href="/pod"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.1, delay: 0.2 }}
            className="border-2 border-white sm:px-8 py-3 text-xs sm:text-base rounded-full text-center w-40 sm:w-56 text-white font-semibold hover:bg-white hover:text-black transition "
          >
            Learn more
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
};

export default OnyxPod;

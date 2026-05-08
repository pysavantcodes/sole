import { MdArrowDownward } from "react-icons/md";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  easeOut,
} from "framer-motion";
import { useRef } from "react";

export const TheGap = () => {
  const scrollToNext = () => {
    const nextSection = document.getElementById("shift-section");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  // ─────────────────────────────────────────────
  // SCROLL TRIGGER
  // ─────────────────────────────────────────────
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  // ─────────────────────────────────────────────
  // PARALLAX (image moves slower)
  // ─────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

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
    <div className="w-full">
      <motion.section
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-col gap-6 py-4 sm:py-8 my-8 text-center"
      >
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center gap-3"
        >
          {/* TITLE */}
          <motion.h1
            variants={fadeUp}
            className="font-ClashGrotesk-Bold 
                        text-3xl md:text-4xl lg:text-5xl
                        tracking-wide leading-tight"
          >
            NOW THE <span className="text-[#FF4040]">GAP</span>
          </motion.h1>

          {/* TEXT */}
          <motion.p
            variants={fadeUp}
            className=" text-lg lg:text-2xl 
                        max-w-md sm:max-w-xl
                        mt-2"
          >
            Sneaker culture evolved into identity, value, and lifestyle... But
            the <span className="text-[#FF4040]">systems</span> around ownership
            never <span className="text-[#FF4040]">evolved</span> with it.
          </motion.p>

          {/* ARROW */}
          <motion.div
            variants={fadeUp}
            className="border border-white rounded-full flex items-center justify-center 
                        p-2 sm:p-3 cursor-pointer"
            onClick={scrollToNext}
            whileHover={{ y: 6 }}
            whileTap={{ scale: 0.9 }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <MdArrowDownward className="text-2xl sm:text-3xl md:text-4xl" />
          </motion.div>
        </motion.div>

        {/* IMAGE WITH PARALLAX */}
        <motion.div
          variants={fadeUp}
          className="relative w-full 
                    h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] 
                    mt-8 overflow-hidden rounded-xl"
        >
          <motion.img
            src="https://firebasestorage.googleapis.com/v0/b/sole-capsule-c8752.firebasestorage.app/o/web-gifs%2FgifX.gif?alt=media&token=933f3b1a-cf8a-40d8-b107-b4e85e1484f0"
            alt="Gap visual"
            style={{ y }}
            className="absolute inset-0 w-full h-[120%] object-cover"
          />
        </motion.div>
      </motion.section>
    </div>
  );
};

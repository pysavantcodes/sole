import { MdArrowDownward } from "react-icons/md";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  easeOut,
} from "framer-motion";
import { useRef } from "react";

const Hero = () => {
  const scrollToNext = () => {
    const nextSection = document.getElementById("problem-section");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  // ─────────────────────────────────────────────
  // SCROLL TRIGGER
  // ─────────────────────────────────────────────
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // ─────────────────────────────────────────────
  // PARALLAX EFFECT
  // ─────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // image moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // ─────────────────────────────────────────────
  // ANIMATION VARIANTS
  // ─────────────────────────────────────────────
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: easeOut },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="scroll-mt-16 w-full pt-8">
      <motion.section
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-col items-center mt-10 sm:mt-14"
      >
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center gap-4 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 text-center"
        >
          <h1
            className="font-ClashGrotesk-Bold 
                        text-3xl lg:text-4xl xl:text-5xl 
                        tracking-wide leading-tight"
          >
            WHY SOLE CAPSULE EXISTS
          </h1>

          <span
            className="bg-[#333333] border border-[#FFFFFF2E] 
                        hover:bg-[#151515] 
                        px-5 sm:px-8 md:px-10 
                        py-2 sm:py-3 
                        rounded-full 
                        text-sm md:text-base lg:text-lg 
                        text-center 
                        gradText-bg font-ClashGrotesk-Semibold"
          >
            SNEAKERS EVOLVED <span className="gradText">OWNERSHIP DIDN’T</span>
          </span>
        </motion.div>

        {/* HERO IMAGE (PARALLAX) */}
        <motion.div
          variants={fadeUp}
          className="relative w-full 
                        h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] 
                        my-10 sm:my-12 overflow-hidden"
        >
          <motion.img
            src="https://firebasestorage.googleapis.com/v0/b/sole-capsule-c8752.firebasestorage.app/o/web-gifs%2FgifX.gif?alt=media&token=933f3b1a-cf8a-40d8-b107-b4e85e1484f0"
            alt="Hero"
            style={{ y }}
            className="absolute inset-0 w-full h-[120%] object-cover"
          />
        </motion.div>

        {/* DESCRIPTION */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center sm:px-10 lg:px-16 xl:px-24 py-6 w-full"
        >
          <div
            className="p-2 sm:p-3 rounded-full 
                        sm:bg-[linear-gradient(135deg,#b4b4b466_0%,#3c3c3c26_30%,#2828280d_50%,#3c3c3c26_70%,#b4b4b466_100%)] 
                        w-full sm:max-w-200"
          >
            <div
              className=" md:text-lg lg:text-2xl md:font-bold 
                            py-3 sm:py-4 px-5 sm:px-8
                            text-center w-full
                            bg-black rounded-full leading-relaxed"
            >
              Sneaker culture has transformed how we buy, value, and talk about
              shoes. But how we own, protect, and interact with them hasn’t kept
              up
            </div>
          </div>

          {/* ARROW */}
          <motion.div
            className="border border-white rounded-full flex items-center justify-center 
                            p-2 sm:p-3 mt-6 sm:mt-8 cursor-pointer "
            onClick={scrollToNext}
            whileHover={{ y: 6 }}
            whileTap={{ scale: 0.9 }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <MdArrowDownward className="text-2xl sm:text-3xl md:text-4xl" />
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Hero;

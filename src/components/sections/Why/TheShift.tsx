import { MdArrowDownward } from "react-icons/md";
import GlowingButton from "../../ui/GlowingButton";
import ScrollingCarousel from "../../ui/ScrollingCarousel";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  easeOut,
} from "framer-motion";
import { useRef } from "react";

const TheShift = () => {
  const scrollToNext = () => {
    const nextSection = document.getElementById("footer");
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
  // PARALLAX
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
        id="shift-section"
        className="scroll-mt-16 flex flex-col items-center my-12 gap-10"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center gap-4 
                    pt-10 
                    px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 
                    text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="font-ClashGrotesk-Bold 
                        text-3xl md:text-4xl lg:text-5xl xl:text-6xl 
                        tracking-wide leading-tight"
          >
            THE <span className="text-[#2AFF1F]">SHIFT</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className=" text-lg lg:text-xl 
                        mt-4 leading-relaxed 
                        max-w-md sm:max-w-xl lg:max-w-2xl"
          >
            <span>
              Sneakers are no longer meant to sit{" "}
              <span className="text-[#2AFF1F]">still</span>...
            </span>
            <br className="block" />
            Ownership is no longer meant to exist in{" "}
            <span className="text-[#2AFF1F]">isolation</span>...
            <br className="block" />
            The future belongs to a connected footwear{" "}
            <span className="text-[#2AFF1F]">ecosystem</span>.
          </motion.p>
        </motion.div>

        {/* ARROW CAROUSEL */}
        <motion.div variants={fadeUp}>
          <ScrollingCarousel>
            <div className="flex justify-center items-center w-full py-4">
              <motion.div
                className="border border-white rounded-full flex items-center -mt-18 lg:-mt-24 justify-center cursor-pointer
                                p-2 sm:p-3"
                onClick={scrollToNext}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                whileHover={{ y: 6 }}
                whileTap={{ scale: 0.9 }}
              >
                <MdArrowDownward className="text-2xl sm:text-3xl md:text-4xl" />
              </motion.div>
            </div>
          </ScrollingCarousel>
        </motion.div>

        {/* GIF (PARALLAX) */}
        <motion.div
          variants={fadeUp}
          className="relative w-full 
                    h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] 
                    overflow-hidden"
        >
          <motion.img
            src="https://firebasestorage.googleapis.com/v0/b/sole-capsule-c8752.firebasestorage.app/o/web-gifs%2Fshift.gif?alt=media&token=04ac444d-3c10-4fc5-948a-918ea0a0d2de"
            alt="Shift visual"
            style={{ y }}
            className="absolute inset-0 w-full h-[120%] object-cover"
          />
        </motion.div>

        {/* CTA HEADER */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center 
                    pt-8 
                    px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 
                    text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="font-ClashGrotesk-Bold 
                        text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 
                        tracking-wide"
          >
            EXPLORE THE SOLE ECOSYSTEM
          </motion.h1>
        </motion.div>

        {/* CTA CAROUSEL */}
        <motion.div variants={fadeUp}>
          <ScrollingCarousel>
            <div className="flex justify-center w-full -mt-12">
              <GlowingButton href="/ecosystem" className="text-xs px-4">
                Explore Ecosystem
              </GlowingButton>
            </div>
          </ScrollingCarousel>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default TheShift;

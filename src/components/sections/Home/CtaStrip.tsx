import { useRef } from "react";
import { motion, useScroll, useTransform, easeOut } from "framer-motion";
import GlowingButton from "../../ui/GlowingButton";

const CtaStrip = () => {
  const sectionRef = useRef(null);

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Subtle background movement
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.2, 1, 0.6]);

  return (
    <div className="w-full">
      <section
        ref={sectionRef}
        className="flex flex-col items-center 
                pt-6 sm:pt-10 
                gap-y-10 sm:gap-y-12 
                px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24"
      >
        {/* HEADLINE */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: easeOut }}
          className="p-2 md:p-3 rounded-full 
                    sm:bg-[linear-gradient(135deg,#b4b4b466_0%,#3c3c3c26_30%,#2828280d_50%,#3c3c3c26_70%,#b4b4b466_100%)] 
                    inline-block"
        >
          <div
            className="uppercase 
                        text-center 
                        text-xl md:text-2xl lg:text-3xl xl:text-4xl font-ClashDisplay-Semibold
                        py-4 sm:py-5 md:py-6 
                        sm:px-8  tracking-wider
                        sm:max-w-lg md:max-w-3xl
                        font-bold bg-black rounded-full leading-6 md:leading-9"
          >
            MEET The First Smart Sneaker DISPLAY
            <span className="gradient-text-flow font-bold">
              <span className="mx-1">POD</span>
              <span className="mx-1">&amp;</span>
              <span className="mx-1">APP</span>
            </span>
          </div>
        </motion.div>

        {/* SCROLL SECTION */}
        <div className="relative w-full py-10 sm:py-12">
          {/* BACKGROUND CAROUSEL */}
          <motion.div
            style={{ y, opacity }}
            className="absolute inset-0 overflow-hidden"
          >
            {/* Left Fade */}
            <div
              className="pointer-events-none absolute left-0 top-0 h-full 
                            w-8 sm:w-12 md:w-16 
                            bg-linear-to-r from-black to-transparent z-10"
            />

            {/* Right Fade */}
            <div
              className="pointer-events-none absolute right-0 top-0 h-full 
                            w-8 sm:w-12 md:w-16 
                            bg-linear-to-l from-black to-transparent z-10"
            />

            {/* SCROLL TEXT */}
            <div className="flex whitespace-nowrap animate-scroll1 items-center">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex">
                  {[...Array(10)].map((_, j) => (
                    <span
                      key={j}
                      className="mx-2 sm:mx-4 md:mx-6 
                                                font-extrabold uppercase 
                                                font-ClashGrotesk-Medium 
                                                text-[clamp(3rem,10vw,8rem)] 
                                                text-white/4"
                    >
                      THE FUTURE IS HERE
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-20 justify-center items-center -mt-10 sm:mt-0"
          >
            <div
              className="flex flex-row 
                            gap-4 sm:gap-6 
                            py-4 
                            rounded-full items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <GlowingButton href="/pod" className=" px-4 text-xs ">
                  Explore Sole Pod
                </GlowingButton>
              </motion.div>

              <motion.a
                href="/pod"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="border-2 border-white sm:px-8 py-3 text-xs sm:text-base rounded-full text-center w-40 sm:w-58 font-semibold text-white hover:bg-white hover:text-black transition"
              >
                Discover The Sole App
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CtaStrip;

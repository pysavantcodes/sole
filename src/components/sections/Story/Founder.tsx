import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function Founder() {
  const sectionRef = useRef(null);

  // subtle parallax for video
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    <div className="w-full">
      <section
        ref={sectionRef}
        id="wfs-section"
        className="flex min-h-screen justify-center flex-col items-center gap-8"
      >
        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="uppercase font-ClashGrotesk-Bold 
                    text-center 
                    text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 
                    mt-12 sm:mt-16 md:mt-20 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 "
        >
          Watch the Founders’ Story
        </motion.h1>

        {/* VIDEO / GIF SECTION */}
        <motion.div
          style={{ y }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative w-full 
                    h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] 
                    overflow-hidden rounded-xl"
        >
          <motion.img
            src="/gifX.gif"
            alt="Founder story"
            initial={{ scale: 1.05, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
      </section>
    </div>
  );
}

export default Founder;

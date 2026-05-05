import { useEffect, useState, useRef } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  easeOut,
} from "framer-motion";

const words = ["DISPLAY", "PROTECT", "EXPERIENCE", "AUTHENTICATE"];
const DISPLAY_TIME = 2000;

const AnimatedWord = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, DISPLAY_TIME);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-10 relative overflow-hidden flex items-center min-w-45">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center md:justify-start"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const Hero = () => {
  const containerRef = useRef(null);

  // Scroll progress for parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effect (very subtle)
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <div className="w-full pt-8">
      <div ref={containerRef} className="w-full bg-black text-white">
        {/* Top Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 py-8 px-6 sm:px-12 md:px-18 xl:px-24"
        >
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-2xl font-bold"
          >
            <AnimatedWord />
          </motion.div>

          {/* Center */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className=" sm:text-lg leading-5 max-w-2xs sm:max-w-xs text-center tracking-wider"
          >
            Your <span className="font-bold">shoes</span> deserve more than{" "}
            <span className="font-semibold gradText ">Storage</span>, it
            deserves a <span className="font-bold">Stage</span>.
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden md:block text-2xl font-bold"
          >
            <AnimatedWord />
          </motion.div>
        </motion.div>

        {/* Hero Image Section */}
        <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden">
          <motion.img
            src="/hero.gif"
            alt="Hero"
            style={{ y, scale }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;

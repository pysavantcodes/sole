"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import GlowingButton from "../components/ui/GlowingButton";

const NotFound = () => {
  const router = useRouter();

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const stagger: Variants = {
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
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-8"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={fadeUp}
          className="text-6xl sm:text-7xl md:text-8xl font-ClashGrotesk-Bold tracking-widest"
        >
          404
        </motion.h1>

        <motion.h2
          variants={fadeUp}
          className="text-xl sm:text-2xl md:text-3xl font-ClashGrotesk-Bold"
        >
          THIS PAGE DOESN’T EXIST
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-white/60 max-w-md text-sm sm:text-base md:text-lg leading-relaxed"
        >
          The page you’re looking for might have been moved, removed, or never
          existed inside the Sole ecosystem.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="w-24 h-0.5 bg-linear-to-r from-transparent via-white/40 to-transparent"
        />

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4"
        >
          <GlowingButton onClick={() => router.push("/")}>Go Home</GlowingButton>

          <GlowingButton
            onClick={() => router.push("/ecosystem")}
            className="bg-[#111]"
          >
            Explore Ecosystem
          </GlowingButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 text-xs tracking-widest text-white/20"
        >
          LOST IN THE SYSTEM
        </motion.div>
      </motion.section>
    </div>
  );
};

export default NotFound;

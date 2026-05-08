import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MdArrowDownward } from "react-icons/md";

const Hero = () => {
  const sectionRef = useRef(null);

  const scrollToNext = () => {
    const nextSection = document.getElementById("card1-section");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  // VERY subtle parallax (almost imperceptible)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    <div className="w-full pt-8">
      <section
        ref={sectionRef}
        className="flex flex-col justify-between items-center 
                min-h-screen overflow-hidden 
                px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 
                py-6 gap-8"
      >
        {/* TOP ROW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center w-full"
        >
          {/* Badge */}
          <div
            className="p-0.5 md:p-2 rounded-full 
                        bg-[linear-gradient(135deg,#b4b4b466_0%,#3c3c3c26_30%,#2828280d_50%,#3c3c3c26_70%,#b4b4b466_100%)]"
          >
            <div
              className="uppercase 
                            text-xs sm:text-sm md:text-lg lg:text-xl 
                            py-2 sm:py-3 px-4 sm:px-6 md:px-8 
                            text-center tracking-wider 
                            font-ClashGrotesk-Bold 
                            bg-black rounded-full"
            >
              From a Dorm Room Dream
            </div>
          </div>

          {/* Arrow */}
          <div
            onClick={scrollToNext}
            className="border border-white rounded-full flex items-center justify-center 
                        p-2 sm:p-3 cursor-pointer"
          >
            <MdArrowDownward className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl" />
          </div>
        </motion.div>

        {/* MAIN CONTENT */}
        <motion.div
          style={{ y }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row 
                    gap-10 w-full flex-1 
                    items-center justify-between"
        >
          {/* LEFT */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <img
              src="/story-hero.png"
              alt="Story"
              className="w-fit max-h-[40vh] sm:max-h-[50vh] object-contain"
            />

            <p
              className="text-sm sm:text-base md:text-lg lg:text-xl 
                            max-w-md sm:max-w-lg 
                            font-ClashGrotesk-Light leading-relaxed"
            >
              From the first pair we saved up to buy, to the grails that felt
              like trophies—every sneaker meant something to us.
            </p>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-1/2 flex flex-col items-center gap-8 h-full mb-4">
            {/* GIF */}
            <div className="w-full flex justify-center">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/sole-capsule-c8752.firebasestorage.app/o/web-gifs%2Fonyx.gif?alt=media&token=fac8a589-cfcb-4078-8327-afdeb1a84e07"
                alt="Hero"
                className="w-full max-h-[40vh] sm:max-h-[50vh] object-contain"
              />
            </div>

            {/* Bottom Badge */}
            <div
              className="p-0.5 md:p-2 rounded-full 
                            bg-[linear-gradient(135deg,#b4b4b466_0%,#3c3c3c26_30%,#2828280d_50%,#3c3c3c26_70%,#b4b4b466_100%)]"
            >
              <div
                className="uppercase 
                                text-xs sm:text-sm md:text-lg lg:text-xl 
                                py-2 sm:py-3 px-4 sm:px-6 md:px-8 
                                text-center tracking-wider 
                                font-ClashGrotesk-Bold 
                                bg-black rounded-full"
              >
                To a Display Revolution
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Hero;

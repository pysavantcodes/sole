import { useRef } from "react";
import { MdArrowDownward } from "react-icons/md";
import { motion, useScroll, useTransform } from "framer-motion";

const DidYouKnow = () => {
  const sectionRef = useRef(null);

  // 9 flag images with positions
  const decorativeImages = [
    { src: "/flags/Flag_of_Tunisia.webp", top: "2%", left: "20%" },
    { src: "/flags/Flag_of_Nigeria.jpg", top: "1%", left: "50%" },
    { src: "/flags/Flag_of_China.webp", top: "2%", right: "18%" },
    { src: "/flags/Flag_of_Vietnam.png", top: "15%", left: "8%" },
    { src: "/flags/Flag_of_Pakistan.png", top: "18%", right: "5%" },
    { src: "/flags/Flag_of_the_United_States.svg", top: "60%", left: "12%" },
    { src: "/flags/Flag_of_India.svg", top: "65%", right: "10%" },
    { src: "/flags/Flag_of_Nigeria.jpg", top: "80%", right: "30%" },
    { src: "/flags/Flag_of_Canada.svg", top: "80%", left: "30%" },
  ];

  const scrollToWFS = () => {
    const nextSection = document.getElementById("wfs-section");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.2, 1, 0.6]);

  return (
    <div className="w-full">
      <section
        ref={sectionRef}
        id="dyk-section"
        className="scroll-mt-18 flex flex-col items-center overflow-hidden relative
                px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24
                pt-16 lg:pt-32"
      >
        {/* Decorative Flag Images */}
        {decorativeImages.map((pos, idx) => (
          <motion.div
            key={idx}
            className="absolute lg:block -z-20 "
            style={{ top: pos.top, left: pos.left, right: pos.right }}
            initial={{ opacity: 0.6, y: 20 }}
            viewport={{ once: true }}
            animate={{
              y: [0, -12, 0],
              x: [0, 6, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 5 + idx * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div
              className="
                                w-[clamp(40px,6vw,90px)]
                                h-[clamp(40px,6vw,90px)]
                            "
            >
              <img
                src={pos.src}
                alt="flag"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        ))}

        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-6 text-center max-w-4xl"
        >
          <h1
            className="uppercase font-ClashGrotesk-Bold 
                        text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
          >
            DID YOU KNOW ?
          </h1>

          <p
            className="font-ClashGrotesk-Light 
                        text-sm sm:text-base md:text-lg lg:text-xl 
                        leading-relaxed w-[80%] lg:w-full"
          >
            Over{" "}
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-ClashGrotesk-Bold">
              75%
            </span>{" "}
            of Sole Capsule was built virtually, with contributors collaborating
            across three continents. From design to engineering, the entire
            project came together without borders—driven by shared vision, not
            shared location.
          </p>
        </motion.div>

        {/* ARROW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border border-white rounded-full flex items-center justify-center 
                    p-2 sm:p-3 mt-12 sm:mt-16 cursor-pointer"
          onClick={scrollToWFS}
        >
          <MdArrowDownward className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl" />
        </motion.div>

        {/* SCROLLING TEXT */}
        <motion.div
          style={{ y, opacity }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative w-full overflow-hidden"
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

          {/* Scrolling Text */}
          <div className="flex whitespace-nowrap animate-scroll items-center">
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
      </section>
    </div>
  );
};

export default DidYouKnow;

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MdArrowDownward } from "react-icons/md";

interface CardSectionProps {
  id?: string;
  title: string;
  text: string;
  img: string;
  reverse?: boolean;
  nextId?: string;
}

const scrollTo = (id: string) => {
  const section = document.getElementById(id);
  section?.scrollIntoView({ behavior: "smooth" });
};

const CardSection = ({
  id,
  title,
  text,
  img,
  reverse = false,
  nextId,
}: CardSectionProps) => {
  const ref = useRef(null);

  // very subtle parallax (consistent across all cards)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <div className="w-full">
      <section
        ref={ref}
        id={id}
        className={`scroll-mt-8 lg:scroll-mt-16 h-screen flex flex-col lg:flex-row 
                items-center justify-center lg:justify-between gap-10`}
      >
        {/* IMAGE */}
        <motion.div
          style={{ y }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={`w-full flex justify-center lg:w-1/2 ${
            reverse ? "order-1 lg:order-2 flex lg:justify-end" : ""
          }`}
        >
          <img
            src={img}
            alt=""
            className="sm:w-xl lg:w-full max-h-[40vh] lg:max-h-[70vh] object-cover rounded-xl"
          />
        </motion.div>

        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className={`w-full lg:w-1/2 flex flex-col 
                    gap-6 sm:gap-8 
                    max-w-md sm:max-w-lg lg:max-w-xl
                    ${reverse ? "order-2 lg:order-1" : ""}`}
        >
          <h1
            className="uppercase font-ClashGrotesk-Bold 
                        text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 
                        leading-tight"
          >
            {title}
          </h1>

          <p
            className="text-sm sm:text-base md:text-lg lg:text-xl 
                        font-ClashGrotesk-Light leading-relaxed"
          >
            {text}
          </p>

          {nextId && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="border border-white rounded-full flex items-center justify-center w-fit 
                            p-2 sm:p-3 mt-2 cursor-pointer"
              onClick={() => scrollTo(nextId)}
            >
              <MdArrowDownward className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl" />
            </motion.div>
          )}
        </motion.div>
      </section>
    </div>
  );
};

const Cards = () => {
  const cards = [
    {
      id: "card1-section",
      title:
        "We were two college sneakerheads, flipping pairs on the side just to get by.",
      text: "Somewhere between the late-night trades and unboxing days, we realized something—there was no way to display our shoes that truly matched what they meant to us.",
      img: "/story-card-img.png",
      nextId: "card2-section",
    },
    {
      id: "card2-section",
      title: "So the journey began.",
      text: "From the thrill of every new drop, to the sting of a fake, and finally to the hunt for the ultimate display experience, Sole Capsule was born.",
      img: "/story-card-img2.png",
      reverse: true,
      nextId: "dyk-section",
    },
  ];

  return (
    <section
      className="scroll-mt-6 flex flex-col lg:gap-20 
            py-6 sm:py-8 
            px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24"
    >
      {cards.map((card, index) => (
        <CardSection key={index} {...card} />
      ))}
    </section>
  );
};

export default Cards;

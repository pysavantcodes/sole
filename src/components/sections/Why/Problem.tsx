import ProblemSection from "./ProblemSection";

const problems = [
  {
    number: "01",
    title: (
      <>
        DISPLAY IS STILL <span className="text-[#FF4040]">STATIC</span>
      </>
    ),
    beforeText: "sneakers are still",
    btnText1: "stored",
    midText: "not",
    btnText2: "experienced",
  },
  {
    number: "02",
    title: (
      <>
        OWNERSHIP LACKS <span className="text-[#FF4040]">IDENTITY</span>
      </>
    ),
    beforeText: "sneaker",
    btnText1: "ownership",
    midText: "exists",
    btnText2: "identity",
    afterText: "doesn't",
  },
  {
    number: "03",
    title: (
      <>
        EXPERIENCE IS <span className="text-[#FF4040]">FRAGMENTED</span>
      </>
    ),
    beforeText: "sneaker culture is",
    btnText1: "thriving",
    midText: "but nothing",
    btnText2: "connects",
    afterText: "the lifestyle",
  },
  {
    number: "04",
    title: (
      <>
        FOOTWARE CARE IS <span className="text-[#FF4040]">REACTIVE</span>
      </>
    ),
    beforeText: "sneaker",
    btnText1: "protection",
    midText: "usually begins after",
    btnText2: "damage",
  },
];

const Problem = () => {
  return (
    <section id="problem-section">
      <div className="w-full">
        {problems.map((problem) => (
          <ProblemSection key={problem.number} {...problem}>
            {[1, 2, 3].map((_, i) => (
              <img
                key={i}
                src="/shoebox.png"
                className="h-[40vh] md:h-[50vh] object-contain"
              />
            ))}
          </ProblemSection>
        ))}
      </div>
    </section>
  );
};

export default Problem;

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import {
    motion,
    useAnimation,
    AnimatePresence,
    useInView,
    useScroll,
    useTransform,
    easeOut
} from "framer-motion";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

// ─── Modal descriptions keyed by problem number ──────────────────────────────
const DESCRIPTIONS: Record<string, ReactNode> = { 
    "01": ( 
        <> 
            <span className="mb-4 block">Sneaker culture has evolved into a global expression of identity, creativity, and status.</span>

            <span className="mb-4 block">Yet the way collectors store their footwear has remained largely unchanged. Most shoes still live inside boxes, shelves, or static display cases designed only for protection. These environments preserve condition but fail to express meaning, movement, or emotional connection.</span>

            <span className="mb-4 block">In a world where homes are becoming smarter and more experiential, sneaker display has not kept pace. Collectors are left with storage solutions that protect value but do not elevate the experience of ownership.</span>
         </> ), 
    "02": ( 
        <> 
            <span className="mb-4 block">Collectors today own pieces that carry cultural relevance, financial value, and personal history. </span> 
            <span className="mb-4 block">However, there is no unified way to represent that ownership beyond receipts, resale listings, or fragmented digital records. Physical possession rarely translates into a recognized identity within the broader sneaker ecosystem.</span>

            <span className="mb-4 block">Without a structured ownership layer, collections remain isolated assets rather than connected expressions of the collector. The absence of a digital identity tied to footwear limits how ownership can be verified, transferred, showcased, or experienced in modern connected environments.</span>
         </> ), 
    "03": ( 
        <> 
            <span className="mb-4 block">The sneaker journey today spans multiple disconnected touchpoints.</span>

            <span className="mb-4 block">Collectors rely on separate platforms for storage, authentication, pricing insights, care guidance, resale activity, and community interaction. While the culture continues to grow globally, the tools that support it remain scattered and uncoordinated.</span>

            <span className="mb-4 block">This fragmentation creates friction and reduces the overall enjoyment of collecting. Instead of engaging with a seamless lifestyle experience, sneaker enthusiasts must navigate isolated solutions that fail to communicate with one another or build long-term value across the collector’s journey.</span>
         </> ), 
    "04": ( 
        <> 
            <span className="mb-4 block">For many collectors, care routines begin only when visible wear, odor, or deterioration becomes noticeable. </span> 
            <span className="mb-4 block">Traditional footwear maintenance is largely reactive, relying on manual cleaning products or occasional interventions rather than continuous, preventive protection.</span>

            <span className="mb-4 block">As sneaker collections grow in size and value, the lack of proactive care systems increases the risk of long-term degradation. Collectors are left managing preservation through effort and vigilance instead of benefiting from intelligent environments designed to support the longevity of their footwear.</span>
         </> ), };

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ProblemModalProps {
    isOpen: boolean;
    onClose: () => void;
    number: string;
    title: ReactNode;
}

const ProblemModal = ({ isOpen, onClose, number, title }: ProblemModalProps) => {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        key="backdrop"
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={onClose}
                    />

                    <motion.div
                        key="panel"
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 pointer-events-none"
                    >
                        <motion.div
                            className="pointer-events-auto relative w-full max-w-6xl bg-black rounded-2xl overflow-hidden border border-[#2a2a2a] shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col md:flex-row"
                            initial={{ opacity: 0, scale: 0.94, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 24 }}
                        >
                            <div className="relative md:w-1/2 bg-black hidden sm:flex items-center justify-center min-h-55 md:min-h- overflow-hidden">
                                <div>
                                    <img src="/onyx.gif" alt="" />
                                </div>
                            </div>

                            <div className="md:w-1/2 flex flex-col justify-between p-8 gap-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-x-2 items-center grad-black-btn border border-[#FFFFFF2E] hover:bg-[#151515] px-6 rounded-full py-2 text-center font-ClashGrotesk-Semibold w-fit">
                                        <img src="/caution.png" className="h-6 w-6" alt="" />
                                        <span className="gradText">PROBLEM {number}</span>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-ClashGrotesk-Bold leading-tight">
                                        {title}
                                    </h2>

                                    <p className="text-white/60 text-sm sm:text-base leading-relaxed font-ClashGrotesk-Extralight">
                                        {DESCRIPTIONS[number]}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button onClick={onClose} className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-sm font-ClashGrotesk-Semibold text-white/70 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all duration-200">
                                        See Less
                                    </button>
                                </div>
                            </div>

                            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all duration-200 z-20">
                                <IoClose className="text-sm" />
                            </button>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// ─── ProblemSection ───────────────────────────────────────────────────────────
interface ProblemSectionProps {
    number: string;
    beforeText: string;
    btnText1: string;
    midText: string;
    btnText2: string;
    afterText?: string;
    title: ReactNode;
    children: ReactNode;
}

const ProblemSection = ({
    number, title, beforeText, afterText, midText,
    btnText1, btnText2, children
}: ProblemSectionProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const controls = useAnimation();
    const containerRef = useRef<HTMLDivElement>(null);

    // ✅ Scroll trigger
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    // ✅ Parallax
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

    useEffect(() => {
        const startAnimation = async () => {
            while (true) {
                await controls.start({
                    x: "-50%",
                    transition: { duration: 20, ease: "linear" },
                });
                controls.set({ x: 0 });
            }
        };
        startAnimation();
    }, [controls]);

    // ✅ animation variants
    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: easeOut }
        }
    };

    return (
        <>
            <ProblemModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                number={number}
                title={title}
            />

            <motion.section
                ref={containerRef}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
                className="flex flex-col justify-center items-center gap-2 h-screen overflow-hidden"
            >
                <motion.div variants={fadeUp} className="flex flex-col justify-center w-full">

                    <motion.div variants={fadeUp} className="py-2 px-6 sm:px-12 md:px-12 xl:px-24">
                        <div className="flex gap-x-2 items-center grad-black-btn border border-[#FFFFFF2E] hover:bg-[#151515] px-6 rounded-full py-2 text-center font-ClashGrotesk-Semibold w-fit gradText-bg">
                            <img src="/caution.png" className="h-6 w-6" alt="" />
                            <span className="gradText">PROBLEM {number}</span>
                        </div>

                        <h1 className="my-2 text-3xl sm:text-4xl md:text-3xl font-ClashGrotesk-Bold">
                            {title}
                        </h1>
                    </motion.div>

                    {/* ✅ PARALLAX APPLIED HERE */}
                    <motion.div style={{ y }} ref={containerRef} className="overflow-hidden cursor-grab active:cursor-grabbing mt-3">
                        <motion.div
                            className="flex gap-8 w-max"
                            drag="x"
                            dragConstraints={containerRef}
                            animate={controls}
                            onMouseEnter={() => controls.stop()}
                            onMouseLeave={() => controls.start({
                                x: "-50%",
                                transition: { duration: 8, ease: "linear" }
                            })}
                        >
                            <div className="flex gap-8">{children}</div>
                            <div className="flex gap-8">{children}</div>
                        </motion.div>
                    </motion.div>

                    <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:justify-between mt-10 sm:mt-14 items-start md:items-center gap-4 px-6 sm:px-12 md:px-12 xl:px-24">
                        <div className="flex flex-wrap items-center lg:text-xl font-bold lg:text-left uppercase">
                            <span className="mb-2 sm:mb-0">{beforeText}{" "}</span>
                            <button className="uppercase mb-2 sm:mb-0 py-1 px-4 mx-1 rounded-full gradTextBtn1">
                                <span className="gradText1">{btnText1}</span>
                            </button>{" "}
                            <span className="mb-2 sm:mb-0">{midText}{" "}</span>
                            <button className="uppercase mb-2 sm:mb-0 py-1 px-4 mx-1 rounded-full gradTextBtn2">
                                <span className="gradText2">{btnText2}</span>
                            </button>
                            <span className="mb-2 sm:mb-0">{afterText}</span>
                        </div>

                        <div className="flex w-full basis-3/7 md:justify-end">
                            <div className="p-0.5 w-full sm:w-fit rounded-full bg-[linear-gradient(135deg,#b4b4b466_0%,#3c3c3c26_30%,#2828280d_50%,#3c3c3c26_70%,#b4b4b466_100%)]">
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="flex justify-between items-center lg:text-lg py-3 px-6 text-center bg-black rounded-full w-full gap-4 hover:bg-[#111] transition-colors duration-200"
                                >
                                    <span className="w-full">Read More</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </motion.section>
        </>
    );
};

export default ProblemSection;
import type { ReactNode } from "react";

interface ScrollingCarouselProps {
    children: ReactNode;
    text?: string;
}

const ScrollingCarousel = ({
    children,
    text = "THE FUTURE IS HERE",
}: ScrollingCarouselProps) => {
    return (
        <div className="relative w-full py-12">

            {/* Background Carousel */}
            <div className="absolute inset-0 overflow-hidden">
                
                {/* Left Fade */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-linear-to-r from-black to-transparent z-10" />

                {/* Right Fade */}
                <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-linear-to-l from-black to-transparent z-10" />

                {/* Scrolling Text */}
                <div className="flex whitespace-nowrap animate-scroll1 h-full items-center">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex">
                            {[...Array(10)].map((_, j) => (
                                <span
                                    key={j}
                                    className="mx-2 font-extrabold text-white/4 text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-ClashGrotesk-Medium uppercase"
                                >
                                    {text}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Overlay Content (Children) */}
            <div className="relative z-20 flex justify-center items-center">
                {children}
            </div>

        </div>
    );
};

export default ScrollingCarousel;
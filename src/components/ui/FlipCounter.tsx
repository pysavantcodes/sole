import { useState, useEffect, useRef, useLayoutEffect } from "react";

interface DrumDigitProps {
    value: number;
    color?: "white" | "red";
    size?: "normal" | "large";
}

function DrumDigit({ value, color = "white", size = "normal" }: DrumDigitProps) {
    const isLarge = size === "large";

    // Responsive sizes (only styling change)
    const w = isLarge ? "clamp(40px, 6vw, 52px)" : "clamp(40px, 6vw, 52px)";
    const h = isLarge ? "clamp(56px, 8vw, 64px)" : "clamp(56px, 8vw, 64px)";
    const fs = isLarge ? "clamp(28px, 5vw, 48px)" : "clamp(28px, 5vw, 48px)";
    const digitH = 72; // keep logic consistent

    const getTranslate = (d: number) => -((9 - d) * digitH);

    const [translate, setTranslate] = useState(getTranslate(value));
    const [animated, setAnimated] = useState(false);
    const prevValue = useRef(value);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useLayoutEffect(() => {
        // Clear any pending timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (value !== prevValue.current) {
            // Use requestAnimationFrame to batch state updates
            requestAnimationFrame(() => {
                setAnimated(true);
                setTranslate(getTranslate(value));
            });
            
            prevValue.current = value;
            
            timeoutRef.current = setTimeout(() => {
                setAnimated(false);
            }, 450);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [value]);

    const textColor = color === "red" ? "#e8453c" : "#ffffff";
    const textShadow = color === "red" ? "0 0 18px rgba(232,69,60,0.45)" : "none";

    return (
        <div
            className="font-ClashGrotesk-Semibold!"
            style={{
                position: "relative",
                width: w,
                height: h,
                background: "linear-gradient(180deg, #101010 0%, #1F1F1F 100%)",
                borderRadius: 10,
                overflow: "hidden",
                userSelect: "none",
                flexShrink: 0,
                boxShadow: "0px 3.35px 6.7px 0px #00000040 inset",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    transform: `translateY(${translate}px)`,
                    transition: animated
                        ? "transform 0.4s cubic-bezier(0.25, 0.8, 0.35, 1.0)"
                        : "none",
                    willChange: "transform",
                }}
            >
                {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((d) => (
                    <div
                        key={d}
                        style={{
                            height: digitH,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <span
                            style={{
                                fontSize: fs,
                                fontWeight: 700,
                                color: textColor,
                                textShadow,
                                lineHeight: 1,
                            }}
                        >
                            {d}
                        </span>
                    </div>
                ))}
            </div>

            <div
                style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: "36%",
                    pointerEvents: "none",
                    zIndex: 3,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: 0, left: 0, right: 0,
                    height: "36%",
                    pointerEvents: "none",
                    zIndex: 3,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    zIndex: 5,
                }}
            />
        </div>
    );
}

export default function StockCounter() {
    const [count, setCount] = useState(250);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCount((prev) => {
                if (prev <= 0) { 
                    if (intervalRef.current) clearInterval(intervalRef.current); 
                    return 0; 
                }
                return prev - 1;
            });
        }, 16000);
        
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const s = Math.max(0, count).toString().padStart(3, "0");
    const [d0, d1, d2] = [parseInt(s[0]), parseInt(s[1]), parseInt(s[2])];

    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                background: "linear-gradient(180deg, #1a1a1a 0%, #111 100%)",
                borderRadius: 20,
                padding: "clamp(10px, 3vw, 18px) clamp(14px, 4vw, 28px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
                gap: "clamp(10px, 3vw, 20px)"
            }}
        >
            <span
                style={{
                    fontSize: "clamp(24px, 4vw, 42px)",
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "2.5px"
                }}
            >
                Only
            </span>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    background: "linear-gradient(180deg, #0F0F0F 6.86%, #1C1C1C 58.36%, #373737 100%)",
                    gap: "clamp(3px, 1vw, 6px)",
                    borderRadius: 14,
                    padding: "clamp(4px, 1.5vw, 8px) clamp(6px, 2vw, 10px) clamp(10px, 2.5vw, 20px) clamp(6px, 2vw, 8px)",
                    boxShadow: "0px -5.57px 10.86px 0px #0000009C"
                }}
            >
                <DrumDigit value={d0} color="white" size="normal" />
                <DrumDigit value={d1} color="white" size="normal" />
                <DrumDigit value={d2} color="red" size="normal" />
            </div>

            <span
                style={{
                    fontSize: "clamp(24px, 4vw, 42px)",
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "2.5px"
                }}
            >
                Left
            </span>
        </div>
    );
}
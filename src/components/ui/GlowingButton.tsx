import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonLikeProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  containerClassName?: string;
  orbitDuration?: number;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

const GlowingButton = ({
  children,
  href,
  className = "",
  orbitDuration = 3000,
  containerClassName = "",
  ...rest
}: ButtonLikeProps) => {
  const isLink = Boolean(href);

  return (
    <>
      <style>{`
                @property --orbit-angle {
                    syntax: '<angle>';
                    initial-value: 0deg;
                    inherits: false;
                }

                @keyframes orbitLight {
                    0%   { --orbit-angle: 0deg; }
                    100% { --orbit-angle: 360deg; }
                }

                .glow-wrap {
                    position: relative;
                    display: inline-flex;
                    border-radius: 9999px;
                    padding: 4px;
                    overflow: hidden;

                    background: conic-gradient(
                        from var(--orbit-angle),
                        #1a1a1a   0deg,
                        #1a1a1a  108deg,
                        #555     122deg,
                        #aaa     133deg,
                        #ffffff  142deg,
                        #aaa     151deg,
                        #555     162deg,
                        #1a1a1a  175deg,
                        #1a1a1a  288deg,
                        #555     302deg,
                        #aaa     313deg,
                        #ffffff  322deg,
                        #aaa     331deg,
                        #555     342deg,
                        #1a1a1a  355deg,
                        #1a1a1a  360deg
                    );

                    animation: orbitLight ${orbitDuration}ms linear infinite;
                    box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
                }

                .glow-inner {
                    position: relative;
                    z-index: 1;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 9999px;
                    background: #ffffff;
                    transition: all 0.15s ease;
                }

                .glow-inner:hover {
                    background: #f5f5f5;
                }

                .glow-inner:active {
                    background: #ebebeb;
                    transform: scale(0.985);
                }
            `}</style>

      <div className={`glow-wrap ${containerClassName}`}>
        {isLink ? (
          <a
            href={href}
            className={`glow-inner cursor-pointer sm:px-8 py-3 w-40 sm:w-56 text-black font-semibold sm:text-base ${className}`}
            {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
          </a>
        ) : (
          <button
            className={`glow-inner cursor-pointer sm:px-8 py-3 w-40 sm:w-56 text-black font-semibold sm:text-base ${className}`}
            {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
          >
            {children}
          </button>
        )}
      </div>
    </>
  );
};

export default GlowingButton;

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import GridPatternSVG from "./GridPatternSVG";
import CursorReveal from "./CursorReveal";

export default function Hero() {
    return (
        <section className="relative min-h-[100svh] w-full overflow-hidden bg-black flex items-center justify-center">
            {/* Pulsing radial gradient orb */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-[var(--accent)]/20 blur-[120px] animate-pulse-orb" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[200px] md:w-[400px] h-[200px] md:h-[400px] rounded-full bg-[#C084FC]/15 blur-[100px] animate-pulse-orb-2" />
            </div>

            {/* Background Image — inset like reference */}
            <div className="absolute inset-0 z-[1] mt-20 mx-6 mb-24 sm:m-8 md:m-16 lg:m-24 pointer-events-none">
                <div className="relative h-full w-full rounded-2xl outline outline-1 outline-white/20 overflow-hidden">
                    <Image
                        src="/rivalhero.jpg"
                        alt="Background"
                        fill
                        className="object-cover opacity-25"
                        priority
                    />
                    {/* Cursor reveal grain effect — same bounds as image */}
                    <CursorReveal className="absolute inset-0 z-10 pointer-events-auto hidden md:block" />
                </div>
            </div>

            {/* Grid pattern overlay */}
            <GridPatternSVG />

            {/* Content */}
            <div className="relative z-20 max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28 md:py-32 text-center pointer-events-none">
                <motion.div
                    className="space-y-5 sm:space-y-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >


                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white">
                        Master {" "}
                        <span className="font-display italic bg-gradient-to-r from-[var(--accent)] via-[#C084FC] to-[var(--accent-hover)] bg-clip-text text-transparent">
                            anything
                        </span>

                    </h1>

                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/50 font-light max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
                        SideQuest distills any hobby into the{" "}
                        <span className="text-white font-medium">5–8 techniques</span>{" "}
                        that matter most, then guides you to full mastery.
                    </p>

                    <motion.div
                        className="flex flex-row gap-2 sm:gap-4 items-center justify-center pt-4 pointer-events-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                    >
                        <Link href="/">
                            <button className="text-xs sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-white text-black rounded-lg hover:bg-white/90 transition-all hover:scale-105 font-semibold flex items-center gap-1.5 sm:gap-2 active:scale-100">
                                Start Learning <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                        </Link>
                        <a href="https://www.youtube.com/watch?v=fR21z4WDIww" target="_blank" rel="noopener noreferrer">
                            <button className="text-xs sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 border-2 border-white/20 text-white/80 rounded-lg bg-transparent hover:bg-white/5 transition-all hover:scale-105 font-medium">
                                Demo Video
                            </button>
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
            >
                <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
                </div>
            </motion.div>

            {/* Bottom gradient line */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </section>
    );
}

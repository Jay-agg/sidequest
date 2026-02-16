"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTA() {
    return (
        <section className="relative min-h-[70vh] sm:min-h-screen w-full overflow-hidden bg-black flex items-center justify-center">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

                    {/* Left — text */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8 text-center lg:text-left"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                            is this the{" "}
                            <span className="font-display italic">
                                life
                            </span>
                            <br />
                            you really want?
                        </h2>

                        <p className="text-lg md:text-xl text-white/50 max-w-lg">
                            Every hobby is a side quest waiting to be conquered. Pick yours and start the journey.
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="pt-2"
                        >
                            <Link href="/">
                                <button className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-black rounded-lg hover:bg-white/90 transition-all hover:scale-105 font-semibold flex items-center gap-2 active:scale-100 mx-auto lg:mx-0">
                                    Begin Your Quest <ArrowRight className="h-5 w-5" />
                                </button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right — image */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative h-[350px] sm:h-[500px] lg:h-[600px] pointer-events-none"
                    >
                        <div className="relative h-full w-full rounded-2xl overflow-hidden">
                            <Image
                                src="/footermotivation2.jpg"
                                alt="Start your side quest"
                                fill
                                className="object-cover opacity-60"
                            />
                            {/* Radial vignette */}
                            <div
                                className="absolute inset-0"
                                style={{ background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.7) 70%, black 100%)" }}
                            />
                            {/* Edge fading */}
                            <div className="absolute top-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-b from-black to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-black to-transparent" />
                            <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-black to-transparent" />
                            <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-black to-transparent" />
                        </div>
                    </motion.div>

                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </section>
    );
}

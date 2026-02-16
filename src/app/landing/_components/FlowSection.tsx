"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain,
    Target,
    Mic,
    Play,
    CheckCircle2,
    Layers,
} from "lucide-react";
import { FlickeringGrid } from "@/components/ui";
import { cn } from "@/lib/utils";

const flow = [
    { label: "Learn", icon: Play, desc: "Watch curated YouTube tutorials" },
    { label: "Quiz", icon: Brain, desc: "Test your knowledge with AI quizzes" },
    { label: "Flashcards", icon: Layers, desc: "Reinforce concepts with repetition" },
    { label: "Practice", icon: Target, desc: "Track real-world practice sessions" },
    { label: "Teach Back", icon: Mic, desc: "Explain it back to AI for feedback" },
];

export default function FlowSection() {
    const [activeFlow, setActiveFlow] = useState(0);

    useEffect(() => {
        const iv = setInterval(() => setActiveFlow((p) => (p + 1) % flow.length), 2500);
        return () => clearInterval(iv);
    }, []);

    return (
        <section id="flow" className="relative py-16 sm:py-24 md:py-32 bg-black border-t border-white/5">
            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative p-6 sm:p-10 md:p-16 bg-white/5 border border-white/10 overflow-hidden"
                >
                    {/* FlickeringGrid behind */}
                    <div className="absolute inset-0 z-0">
                        <FlickeringGrid
                            squareSize={6}
                            gridGap={8}
                            color="rgb(139, 127, 212)"
                            maxOpacity={0.12}
                            flickerChance={0.08}
                        />
                    </div>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-1.5 h-16 bg-gradient-to-b from-[var(--accent)] to-transparent" />
                    <div className="absolute top-0 right-0 w-1.5 h-16 bg-gradient-to-b from-[#C084FC] to-transparent" />
                    <div className="absolute bottom-0 left-0 w-1.5 h-16 bg-gradient-to-t from-[var(--peach-dark)] to-transparent" />
                    <div className="absolute bottom-0 right-0 w-1.5 h-16 bg-gradient-to-t from-[var(--mint-dark)] to-transparent" />
                    <div className="absolute top-0 left-20 right-20 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="relative z-10 space-y-10 text-center">
                        <span className="text-sm uppercase tracking-widest text-white/40 font-semibold">
                            The Learning Flow
                        </span>

                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white font-display leading-tight">
                            Five stages per{" "}
                            <span className="bg-gradient-to-r from-[var(--accent)] to-[#C084FC] bg-clip-text text-transparent">
                                technique
                            </span>
                        </h2>

                        {/* Flow steps */}
                        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto pt-4">
                            {flow.map((s, i) => {
                                const Icon = s.icon;
                                const isActive = i === activeFlow;
                                const isDone = i < activeFlow;
                                return (
                                    <button
                                        key={s.label}
                                        onClick={() => setActiveFlow(i)}
                                        className="flex flex-col items-center gap-2 basis-[28%] sm:basis-auto"
                                    >
                                        <motion.div
                                            animate={{ scale: isActive ? 1.15 : 1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                            className={cn(
                                                "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300",
                                                isActive
                                                    ? "border-[var(--accent)] bg-[var(--accent)]/20 shadow-lg shadow-[var(--accent)]/20"
                                                    : isDone
                                                        ? "border-green-500/40 bg-green-500/10"
                                                        : "border-white/10 bg-white/5"
                                            )}
                                        >
                                            {isDone ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-400" />
                                            ) : (
                                                <Icon className={cn("h-5 w-5", isActive ? "text-[var(--accent)]" : "text-white/40")} />
                                            )}
                                        </motion.div>
                                        <span className={cn("text-xs font-medium", isActive ? "text-white" : "text-white/40")}>
                                            {s.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Active detail */}
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={activeFlow}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="text-base sm:text-lg md:text-xl text-white/60 max-w-xl mx-auto"
                            >
                                {flow[activeFlow].desc}
                            </motion.p>
                        </AnimatePresence>

                        <div className="h-px w-24 bg-white/20 mx-auto" />

                        <p className="text-sm sm:text-base md:text-lg text-white/40">
                            Each technique follows a proven pedagogical flow — from first exposure to confident mastery.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Subtle background orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#C084FC]/5 rounded-full blur-3xl" />
            </div>
        </section>
    );
}

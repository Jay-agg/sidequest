"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Brain,
    BookOpen,
    Target,
    Mic,
    RotateCcw,
    Palette,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LampSection from "./LampSection";

/* ── animated inner content for bento cards ── */

const learningStages = [
    { label: "Learn", progress: 100, color: "#8B7FD4" },
    { label: "Quiz", progress: 85, color: "#C084FC" },
    { label: "Flashcards", progress: 60, color: "#E8956B" },
    { label: "Practice", progress: 35, color: "#5DB895" },
    { label: "Teach Back", progress: 10, color: "#6BADE8" },
];

function LearningStagesCard() {
    return (
        <div className="absolute inset-0 flex items-start justify-center px-4 sm:px-8 py-8 sm:py-14 pb-24 sm:pb-32">
            <div className="w-full max-w-sm space-y-2.5">
                {learningStages.map((stage, idx) => (
                    <motion.div
                        key={stage.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.12, duration: 0.5 }}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        <span className="text-[10px] sm:text-xs font-medium text-white/60 w-16 sm:w-20 shrink-0">{stage.label}</span>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stage.progress}%` }}
                                transition={{ delay: idx * 0.12 + 0.3, duration: 0.8 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: stage.color }}
                            />
                        </div>
                        <span className="text-xs font-mono text-white/40 w-8 text-right">{stage.progress}%</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

const techniqueSamples = [
    { name: "Fingerpicking Basics", status: "Mastered", xp: "+120 XP" },
    { name: "Chord Transitions", status: "In Progress", xp: "+80 XP" },
    { name: "Strumming Patterns", status: "Locked", xp: "+60 XP" },
    { name: "Barre Chords", status: "Locked", xp: "+100 XP" },
];

function TechniqueListCard() {
    return (
        <div className="absolute inset-0 flex items-start justify-center px-4 sm:px-10 py-8 sm:py-14 pb-24 sm:pb-32">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-[320px]">
                {techniqueSamples.map((t, idx) => (
                    <motion.div
                        key={t.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                        <span className="text-xs font-bold text-white truncate w-full text-center">{t.name}</span>
                        <span className={cn(
                            "text-[10px] mt-1 font-medium",
                            t.status === "Mastered" ? "text-green-400" :
                                t.status === "In Progress" ? "text-[var(--accent)]" : "text-white/30"
                        )}>{t.status}</span>
                        <span className="text-[10px] text-white/40 mt-0.5">{t.xp}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function VoiceWaveCard() {
    return (
        <div className="absolute inset-0 flex items-center justify-center px-8">
            <div className="flex items-end gap-1 h-20">
                {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-1.5 rounded-full bg-gradient-to-t from-[#6BADE8] to-[#C084FC]"
                        animate={{
                            height: [8, Math.random() * 60 + 10, 8],
                        }}
                        transition={{
                            duration: 1 + Math.random() * 0.5,
                            repeat: Infinity,
                            delay: i * 0.05,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

function DecomposeTreeCard() {
    return (
        <div className="absolute inset-0 flex items-start justify-center px-4 sm:px-10 py-8 sm:py-14 pb-24 sm:pb-32">
            <div className="w-full max-w-[280px] space-y-2">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-2.5 rounded-lg bg-[#D4A843]/15 border border-[#D4A843]/30 text-center"
                >
                    <span className="text-xs font-bold text-[#D4A843]">Barre Chords</span>
                </motion.div>
                <div className="flex justify-center">
                    <div className="w-px h-4 bg-white/20" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {["Finger Pressure", "Thumb Placement", "Chord Shapes"].map((sub, i) => (
                        <motion.div
                            key={sub}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.12 }}
                            className="p-2 rounded-md bg-white/5 border border-white/10 text-center"
                        >
                            <span className="text-[9px] text-white/60 leading-tight block">{sub}</span>
                        </motion.div>
                    ))}
                </div>
                <div className="flex justify-center">
                    <div className="w-px h-3 bg-white/10" />
                </div>
                <div className="grid grid-cols-2 gap-2 px-4">
                    {["Index Stretch", "Wrist Angle"].map((sub, i) => (
                        <motion.div
                            key={sub}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + i * 0.12 }}
                            className="p-2 rounded-md bg-white/5 border border-white/10 text-center"
                        >
                            <span className="text-[9px] text-white/40">{sub}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function HobbyCarouselCard() {
    const hobbies = ["🎸 Guitar", "🎨 Watercolor", "📷 Photography", "🍳 Cooking", "♟️ Chess", "✍️ Calligraphy"];
    return (
        <div className="absolute inset-0 flex items-start justify-center overflow-hidden pt-[30%]">
            <div className="flex gap-3 animate-marquee-slow">
                {[...hobbies, ...hobbies].map((h, i) => (
                    <div key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 whitespace-nowrap shrink-0">
                        {h}
                    </div>
                ))}
            </div>
        </div>
    );
}

const features: {
    icon: React.ElementType;
    name: string;
    description: string;
    className: string;
    color: string;
    background: React.ReactNode;
}[] = [
        {
            icon: Brain,
            name: "AI-Generated Plans",
            description: "Get a curated set of techniques tailored to your hobby, goal, and available time.",
            className: "sm:col-span-1 lg:col-span-1",
            color: "var(--accent)",
            background: <TechniqueListCard />,
        },
        {
            icon: BookOpen,
            name: "Structured Learning",
            description: "YouTube tutorials, quizzes, flashcards, and practice — all in one focused flow.",
            className: "sm:col-span-2 lg:col-span-2",
            color: "#E8956B",
            background: <LearningStagesCard />,
        },
        {
            icon: Target,
            name: "Progressive Mastery",
            description: "Techniques unlock progressively so you never feel overwhelmed. Build skills layer by layer.",
            className: "sm:col-span-2 lg:col-span-2",
            color: "#5DB895",
            background: (
                <div className="absolute inset-0 flex items-start justify-center px-4 sm:px-12 py-8 sm:py-14 pb-24 sm:pb-32">
                    <div className="w-full max-w-md space-y-2.5">
                        {["Basics", "Intermediate", "Advanced", "Expert", "Master"].map((level, idx) => (
                            <motion.div
                                key={level}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 hover:scale-[1.02]",
                                    idx <= 1
                                        ? "bg-[#5DB895]/10 border-[#5DB895]/30 shadow-lg shadow-[#5DB895]/10"
                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                )}
                            >
                                <div className={cn(
                                    "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold",
                                    idx === 0 ? "bg-green-500/20 text-green-400 border-2 border-green-500/50" :
                                        idx === 1 ? "bg-[#5DB895]/20 text-[#5DB895] border-2 border-[#5DB895]/50" :
                                            "bg-white/10 text-white/30"
                                )}>
                                    {idx <= 1 ? <CheckCircle2 className="w-4 h-4" /> : <span>{idx + 1}</span>}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-white">{level}</div>
                                    <div className="text-xs text-white/40">{idx <= 1 ? "Completed" : "Locked"}</div>
                                </div>
                                {idx <= 1 && <span className="text-xs text-green-400 font-mono">✓</span>}
                            </motion.div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            icon: Mic,
            name: "Teach Back",
            description: "Voice-powered explanations with real-time AI feedback to cement your understanding.",
            className: "sm:col-span-1 lg:col-span-1",
            color: "#6BADE8",
            background: <VoiceWaveCard />,
        },
        {
            icon: RotateCcw,
            name: "Break It Down",
            description: "Stuck on something? Decompose any technique into smaller, manageable sub-techniques.",
            className: "sm:col-span-1 lg:col-span-1",
            color: "#D4A843",
            background: <DecomposeTreeCard />,
        },
        {
            icon: Palette,
            name: "Multi-Hobby Support",
            description: "Track multiple hobbies simultaneously and switch between them seamlessly.",
            className: "sm:col-span-1 lg:col-span-1",
            color: "var(--accent)",
            background: <HobbyCarouselCard />,
        },
    ];

export default function BentoFeatures() {
    return (
        <section id="features" className="relative bg-black overflow-hidden">
            {/* Lamp header */}
            <LampSection>
                <motion.h2
                    className="text-2xl sm:text-3xl md:text-5xl font-bold text-white text-center mb-4 font-display"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Everything You Need
                </motion.h2>
                <motion.p
                    className="text-base sm:text-lg md:text-xl text-white/50 max-w-2xl text-center px-2 sm:px-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    No information overload. Just the right techniques, in the right order, with the right tools.
                </motion.p>
            </LampSection>

            {/* Bento grid */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-16 sm:pb-32 -mt-24 sm:-mt-48 md:-mt-64 relative z-50">
                <div className="relative overflow-visible">
                    {/* Extended border lines */}
                    <div className="hidden sm:block absolute -top-4 inset-x-0 h-4 border-l-2 border-r-2 border-white/20 pointer-events-none z-10" />
                    <div className="hidden sm:block absolute -bottom-4 inset-x-0 h-4 border-l-2 border-r-2 border-white/20 pointer-events-none z-10" />
                    <div className="hidden sm:block absolute inset-y-0 -left-4 w-4 border-t-2 border-b-2 border-white/20 pointer-events-none z-10" />
                    <div className="hidden sm:block absolute inset-y-0 -right-4 w-4 border-t-2 border-b-2 border-white/20 pointer-events-none z-10" />

                    <div className="grid w-full auto-rows-[18rem] sm:auto-rows-[22rem] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-0 border-0 sm:border sm:border-white/10">
                        {features.map((feat, idx) => {
                            const Icon = feat.icon;
                            return (
                                <motion.div
                                    key={feat.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                                    className={cn(
                                        "group relative col-span-1 flex flex-col justify-between overflow-hidden",
                                        "bg-black border border-white/10 rounded-xl sm:rounded-none transition-all duration-300",
                                        "hover:border-white/30 hover:bg-white/5",
                                        feat.className
                                    )}
                                >
                                    {/* Animated inner content */}
                                    <div>{feat.background}</div>

                                    {/* Bottom gradient for text readability */}
                                    <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none" />

                                    <div className="relative p-4 sm:p-6 z-10">
                                        <div className="pointer-events-none flex flex-col gap-1 transition-all duration-300 group-hover:-translate-y-2">
                                            <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-neutral-300 transition-colors duration-300 group-hover:text-white mb-1" />
                                            <h3 className="text-base sm:text-xl font-semibold text-white font-display">
                                                {feat.name}
                                            </h3>
                                            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-lg">
                                                {feat.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-white/5" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

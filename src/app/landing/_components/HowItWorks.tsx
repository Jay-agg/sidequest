"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Trophy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const hiw_steps = [
    {
        number: "01",
        title: "Pick Your Hobby",
        description: "Tell SideQuest what you want to learn, your goal, and how much time you have per week.",
        details: [
            "Choose from any hobby or skill",
            "Set your mastery goal",
            "Define your time commitment",
            "AI tailors everything to you",
        ],
        icon: Sparkles,
        color: "from-[var(--accent)] to-[#C084FC]",
        colorRgb: [139, 127, 212] as [number, number, number],
    },
    {
        number: "02",
        title: "Get Your Plan",
        description: "AI generates a focused plan with only the 5–8 techniques that truly matter for your goal.",
        details: [
            "Curated technique selection",
            "Progressive difficulty ordering",
            "AI reasoning for every choice",
            "Fully customisable plan",
        ],
        icon: Zap,
        color: "from-[#E8956B] to-[#F5C46D]",
        colorRgb: [232, 149, 107] as [number, number, number],
    },
    {
        number: "03",
        title: "Learn & Master",
        description: "Work through each technique with tutorials, quizzes, flashcards, practice, and teach-back.",
        details: [
            "YouTube-powered tutorials",
            "Knowledge-testing quizzes",
            "Spaced-repetition flashcards",
            "Voice-based teach-back with AI",
        ],
        icon: Trophy,
        color: "from-[#5DB895] to-[#7BC9A8]",
        colorRgb: [93, 184, 149] as [number, number, number],
    },
];

function StepTexture({
    colorRgb,
    isActive,
}: {
    colorRgb: [number, number, number];
    isActive: boolean;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!isActive) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let noiseCanvas: HTMLCanvasElement | null = null;

        const generateNoise = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            noiseCanvas = document.createElement("canvas");
            noiseCanvas.width = canvas.width;
            noiseCanvas.height = canvas.height;
            const nCtx = noiseCanvas.getContext("2d");
            if (!nCtx) return;
            const img = nCtx.createImageData(canvas.width, canvas.height);
            for (let i = 0; i < img.data.length; i += 4) {
                const n = Math.random();
                img.data[i] = colorRgb[0] * n;
                img.data[i + 1] = colorRgb[1] * n;
                img.data[i + 2] = colorRgb[2] * n;
                img.data[i + 3] = 255 * n * 0.5;
            }
            nCtx.putImageData(img, 0, 0);
        };

        generateNoise();
        const maxR = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
        const startTime = performance.now();
        let raf: number;

        const draw = (now: number) => {
            const t = Math.min((now - startTime) / 800, 1);
            const r = Math.max(1, (1 - (1 - t) ** 3) * maxR);
            if (!noiseCanvas || canvas.width === 0) {
                raf = requestAnimationFrame(draw);
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(noiseCanvas, 0, 0);
            ctx.globalCompositeOperation = "destination-in";
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            grad.addColorStop(0, "rgba(255,255,255,1)");
            grad.addColorStop(0.8, "rgba(255,255,255,0.8)");
            grad.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "source-over";
            if (t < 1) raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(raf);
    }, [isActive, colorRgb]);

    if (!isActive) return null;
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ mixBlendMode: "lighten", opacity: 0.8 }}
            />
        </div>
    );
}

export default function HowItWorks() {
    const [active, setActive] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setActive((c) => (c + 1) % hiw_steps.length);
        }, 5000);
        return () => clearTimeout(timer);
    }, [active]);

    useEffect(() => {
        setProgress(0);
        const iv = setInterval(() => setProgress((p) => Math.min(p + 2, 100)), 100);
        return () => clearInterval(iv);
    }, [active]);

    return (
        <section id="how-it-works" className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-black">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-10 sm:mb-16 md:mb-20 space-y-3 sm:space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white font-display">
                        How It Works
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-white/50 max-w-2xl mx-auto">
                        Three simple steps from beginner to master
                    </p>
                </motion.div>

                {/* Grid layout with extended borders */}
                <div className="relative overflow-visible">
                    <div className="hidden sm:block absolute -top-4 inset-x-0 h-4 border-l-2 border-r-2 border-white/20 pointer-events-none z-10" />
                    <div className="hidden sm:block absolute -bottom-4 inset-x-0 h-4 border-l-2 border-r-2 border-white/20 pointer-events-none z-10" />
                    <div className="hidden sm:block absolute inset-y-0 -left-4 w-4 border-t-2 border-b-2 border-white/20 pointer-events-none z-10" />
                    <div className="hidden sm:block absolute inset-y-0 -right-4 w-4 border-t-2 border-b-2 border-white/20 pointer-events-none z-10" />

                    <div className="flex flex-col lg:flex-row border border-white/10">
                        {/* Left — steps list */}
                        <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 lg:w-1/2">
                            {hiw_steps.map((step, i) => {
                                const Icon = step.icon;
                                const isActive = active === i;
                                const isPast = i < active;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        onClick={() => setActive(i)}
                                        className={cn(
                                            "relative p-4 sm:p-6 cursor-pointer transition-colors duration-300 overflow-hidden border-b border-white/10 last:border-b-0 flex-1",
                                            isActive
                                                ? "bg-white/10 hover:bg-white/[0.12]"
                                                : "bg-black hover:bg-white/5"
                                        )}
                                    >
                                        <StepTexture colorRgb={step.colorRgb} isActive={isActive} />
                                        <div className="flex items-center gap-4 relative z-10 h-full">
                                            <div
                                                className={cn(
                                                    "flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors",
                                                    isPast
                                                        ? "bg-green-500/20 border-2 border-green-500/50"
                                                        : isActive
                                                            ? `bg-gradient-to-br ${step.color}`
                                                            : "bg-white/5 border-2 border-white/20"
                                                )}
                                            >
                                                {isPast ? (
                                                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                                                ) : (
                                                    <Icon className={cn("w-6 h-6", isActive ? "text-white" : "text-white/60")} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn("text-sm font-mono", isActive ? "text-white" : "text-white/40")}>
                                                        {step.number}
                                                    </span>
                                                    <h3 className={cn("text-base sm:text-xl font-semibold font-display", isActive ? "text-white" : "text-white/70")}>
                                                        {step.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Right — active step detail */}
                        <div className="lg:w-1/2 flex items-stretch">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={active}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative p-5 sm:p-8 bg-black hover:bg-white/5 transition-all duration-300 overflow-hidden w-full flex flex-col justify-center"
                                >
                                    {/* Timer circle */}
                                    <div className="absolute top-6 right-6 z-20">
                                        <svg className="w-12 h-12 -rotate-90">
                                            <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
                                            <circle
                                                cx="24"
                                                cy="24"
                                                r="20"
                                                stroke="url(#sqGradient)"
                                                strokeWidth="3"
                                                fill="none"
                                                strokeDasharray={`${2 * Math.PI * 20}`}
                                                strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                                                strokeLinecap="round"
                                                className="transition-all duration-100"
                                            />
                                            <defs>
                                                <linearGradient id="sqGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="var(--accent)" />
                                                    <stop offset="100%" stopColor="#C084FC" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white/60">
                                            {hiw_steps[active].number}
                                        </span>
                                    </div>

                                    {/* Gradient glow */}
                                    <div className={cn("absolute top-0 right-0 w-64 h-64 bg-gradient-to-br opacity-15 blur-3xl", hiw_steps[active].color)} />

                                    <div className="relative z-10 space-y-4 sm:space-y-6">
                                        <div
                                            className={cn(
                                                "w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-lg",
                                                hiw_steps[active].color
                                            )}
                                        >
                                            {(() => { const I = hiw_steps[active].icon; return <I className="w-6 h-6 sm:w-8 sm:h-8 text-white" />; })()}
                                        </div>

                                        <div>
                                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 font-display">
                                                {hiw_steps[active].title}
                                            </h3>
                                            <p className="text-sm sm:text-base md:text-lg text-white/60 leading-relaxed">
                                                {hiw_steps[active].description}
                                            </p>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-white/10">
                                            {hiw_steps[active].details.map((d, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[var(--accent)] to-[#C084FC]" />
                                                    <p className="text-white/70">{d}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

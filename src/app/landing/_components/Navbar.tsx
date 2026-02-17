"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navItems = [
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Flow", href: "#flow" },
    ];

    return (
        <motion.nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-black/80 backdrop-blur-md border-b border-white/10"
                    : "bg-transparent"
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    <Link href="/landing" className="flex items-center gap-2.5 group">

                        <span className="text-xl font-bold text-white font-display">
                            SideQuest
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="text-white/60 hover:text-white transition-colors text-sm font-medium"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/"
                            className="px-5 py-2 text-sm font-semibold text-black bg-white rounded-lg hover:bg-white/90 transition-all hover:scale-105 active:scale-100 flex items-center gap-2"
                        >
                            Open App <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                <AnimatePresence>
                    {mobileOpen && (
                        <>
                            <motion.div
                                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setMobileOpen(false)}
                            />

                            <motion.div
                                className="fixed inset-x-0 top-0 z-50 md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10"
                                initial={{ y: "-100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "-100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            >
                                <div className="flex items-center justify-between px-4 py-3">
                                    <Link
                                        href="/landing"
                                        className="text-xl font-bold text-white font-display"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        SideQuest
                                    </Link>
                                    <button
                                        className="text-white p-2"
                                        onClick={() => setMobileOpen(false)}
                                        aria-label="Close menu"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="flex flex-col px-6 pb-8 pt-4">
                                    {navItems.map((item, i) => (
                                        <motion.a
                                            key={item.href}
                                            href={item.href}
                                            className="text-white/80 hover:text-white text-2xl font-semibold py-4 border-b border-white/5 transition-colors"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: i * 0.08, duration: 0.3 }}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {item.label}
                                        </motion.a>
                                    ))}

                                    <motion.div
                                        className="pt-8"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ delay: 0.25, duration: 0.3 }}
                                    >
                                        <Link
                                            href="/"
                                            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-white text-black font-semibold rounded-xl text-lg hover:bg-white/90 transition-all active:scale-95"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            Open App <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}

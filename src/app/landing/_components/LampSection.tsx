"use client";

import { motion } from "framer-motion";

export default function LampSection({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-[50vh] md:min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-black w-full z-0">
            <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
                <motion.div
                    initial={{ opacity: 0.5, width: "15rem" }}
                    whileInView={{ opacity: 1, width: "min(30rem, 90vw)" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                    style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
                    className="absolute inset-auto right-1/2 h-40 sm:h-56 overflow-visible w-[90vw] sm:w-[30rem] bg-gradient-conic from-[var(--accent)] via-[#C084FC] to-transparent text-white [--conic-position:from_70deg_at_center_top]"
                >
                    <div className="absolute w-full left-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
                    <div className="absolute w-40 h-full left-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0.5, width: "15rem" }}
                    whileInView={{ opacity: 1, width: "min(30rem, 90vw)" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                    style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
                    className="absolute inset-auto left-1/2 h-40 sm:h-56 w-[90vw] sm:w-[30rem] bg-gradient-conic from-transparent via-[var(--peach-dark)] to-[var(--accent)] text-white [--conic-position:from_290deg_at_center_top]"
                >
                    <div className="absolute w-40 h-full right-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
                    <div className="absolute w-full right-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
                </motion.div>
                <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-black blur-2xl" />
                <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
                <div className="absolute inset-auto z-50 h-24 sm:h-36 w-[80vw] sm:w-[28rem] -translate-y-1/2 rounded-full bg-gradient-to-r from-[var(--accent)] via-[#C084FC] to-[var(--peach-dark)] opacity-50 blur-3xl" />
                <motion.div
                    initial={{ width: "8rem" }}
                    whileInView={{ width: "16rem" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-gradient-to-r from-[var(--accent)] to-[#C084FC] blur-2xl"
                />
                <motion.div
                    initial={{ width: "15rem" }}
                    whileInView={{ width: "30rem" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-auto z-50 h-0.5 w-[80vw] sm:w-[30rem] -translate-y-[7rem] bg-gradient-to-r from-[var(--accent)] via-[#C084FC] to-[var(--peach-dark)]"
                />
                <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-black" />
            </div>
            <div className="relative z-50 flex -translate-y-32 sm:-translate-y-48 md:-translate-y-64 lg:-translate-y-80 flex-col items-center px-4 sm:px-5">
                {children}
            </div>
        </div>
    );
}

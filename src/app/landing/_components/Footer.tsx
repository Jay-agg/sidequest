"use client";

export default function Footer() {
    return (
        <footer className="relative bg-black border-t border-white/10 py-8 sm:py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2.5">
                        {/* <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[var(--accent)] to-[#C084FC] flex items-center justify-center">
                            <Sparkles className="h-3.5 w-3.5 text-white" />
                        </div> */}
                        <span className="text-lg font-bold text-white font-display">SideQuest</span>
                    </div>

                </div>
            </div>
        </footer>
    );
}

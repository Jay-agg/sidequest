"use client";

export default function GridPatternSVG() {
    return (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full stroke-white/5"
            aria-hidden="true"
        >
            <defs>
                <pattern id="sq-grid" width={40} height={40} patternUnits="userSpaceOnUse" x={-1} y={-1}>
                    <path d={`M.5 40V.5H40`} fill="none" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sq-grid)" />
        </svg>
    );
}

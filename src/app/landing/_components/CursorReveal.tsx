"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface CursorRevealProps {
    className?: string;
}

export default function CursorReveal({ className }: CursorRevealProps) {
    const mousePositionRef = useRef({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let lastUpdateTime = 0;
        const throttleMs = 16;

        const handleMouseMove = (e: MouseEvent) => {
            const now = performance.now();
            if (now - lastUpdateTime < throttleMs) return;
            lastUpdateTime = now;

            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            mousePositionRef.current = { x, y };

            const isInside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
            setIsHovering(isInside);
        };

        const handleMouseLeave = () => {
            setIsHovering(false);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("mousemove", handleMouseMove);
            container.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
            if (container) {
                container.removeEventListener("mousemove", handleMouseMove);
                container.removeEventListener("mouseleave", handleMouseLeave);
            }
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let noiseCanvas: HTMLCanvasElement | null = null;
        let animationFrameId: number;

        const generateNoiseTexture = () => {
            const width = canvas.width;
            const height = canvas.height;
            if (width === 0 || height === 0) return;

            noiseCanvas = document.createElement("canvas");
            noiseCanvas.width = width;
            noiseCanvas.height = height;
            const noiseCtx = noiseCanvas.getContext("2d");
            if (!noiseCtx) return;

            const imageData = noiseCtx.createImageData(width, height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const noise = Math.random();
                const colorChoice = Math.random();
                let r, g, b;

                if (colorChoice < 0.33) {
                    // Accent purple
                    r = 139 * noise;
                    g = 127 * noise;
                    b = 212 * noise;
                } else if (colorChoice < 0.66) {
                    // Light purple
                    r = 192 * noise;
                    g = 132 * noise;
                    b = 252 * noise;
                } else {
                    // Peach
                    r = 232 * noise;
                    g = 149 * noise;
                    b = 107 * noise;
                }

                data[i] = r;
                data[i + 1] = g;
                data[i + 2] = b;
                data[i + 3] = 255 * noise * 0.5;
            }

            noiseCtx.putImageData(imageData, 0, 0);
        };

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth * 0.5;
            canvas.height = canvas.offsetHeight * 0.5;
            generateNoiseTexture();
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const revealRadius = 180;
        let lastFrameTime = 0;
        const frameInterval = 1000 / 30;

        const animate = (currentTime: number) => {
            if (currentTime - lastFrameTime < frameInterval) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }
            lastFrameTime = currentTime;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (!isHovering || !noiseCanvas) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }

            ctx.drawImage(noiseCanvas, 0, 0);

            ctx.globalCompositeOperation = "destination-in";

            const gradient = ctx.createRadialGradient(
                mousePositionRef.current.x * 0.5,
                mousePositionRef.current.y * 0.5,
                0,
                mousePositionRef.current.x * 0.5,
                mousePositionRef.current.y * 0.5,
                revealRadius * 0.5
            );
            gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
            gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.6)");
            gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.2)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.globalCompositeOperation = "source-over";

            animationFrameId = requestAnimationFrame(animate);
        };

        animate(0);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isHovering]);

    return (
        <div ref={containerRef} className={className}>
            {/* Subtle brightness boost on hover */}
            <motion.div
                className="absolute inset-0 bg-white rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 0.08 : 0 }}
                transition={{ duration: 0.3 }}
            />

            {/* Canvas grain texture */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full rounded-2xl"
                style={{ mixBlendMode: "lighten", opacity: 0.9 }}
            />
        </div>
    );
}

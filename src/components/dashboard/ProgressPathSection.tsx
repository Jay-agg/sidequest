"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui";
import { MasteryPath } from "@/components/technique";
import { ScrollSection } from "./ScrollSection";
import type { Technique } from "@/types";

interface ProgressPathSectionProps {
  techniques: Technique[];
  selectedId: string | undefined;
  onSelectTechnique: (id: string) => void;
}

export function ProgressPathSection({
  techniques,
  selectedId,
  onSelectTechnique,
}: ProgressPathSectionProps) {
  return (
    <div className="hidden lg:block">
      <ScrollSection>
        <motion.div
          className="sticky top-24"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">
            Progress Path
          </h2>
          <Card className="p-4">
            <MasteryPath
              techniques={techniques}
              onSelectTechnique={(id) => {
                const element = document.getElementById(`technique-${id}`);
                element?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              selectedId={selectedId}
            />
          </Card>
        </motion.div>
      </ScrollSection>
    </div>
  );
}

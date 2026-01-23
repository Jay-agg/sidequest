"use client";

import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import type { Technique } from "@/types";

interface WhyItMattersCardProps {
  technique: Technique;
}

export function WhyItMattersCard({ technique }: WhyItMattersCardProps) {
  return (
    <Card className="mb-4 sm:mb-6 bg-lavender/10 border-lavender/30">
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-lavender/30 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-medium text-foreground mb-1">Why this matters</h3>
            <p className="text-xs sm:text-sm text-foreground-muted">{technique.whyItMatters}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

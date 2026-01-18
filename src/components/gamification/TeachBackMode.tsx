"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Button, Card, CardContent, Textarea } from "@/components/ui";
import type { Technique } from "@/types";

interface TeachBackModeProps {
  technique: Technique;
  onComplete: () => void;
}

export function TeachBackMode({ technique, onComplete }: TeachBackModeProps) {
  const [explanation, setExplanation] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    strengths: string[];
    improvements: string[];
    overall: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async () => {
    if (!explanation.trim()) return;

    setIsAnalyzing(true);
    
    try {
      const response = await fetch("/api/teach-back", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          techniqueName: technique.name,
          techniqueDescription: technique.description,
          userExplanation: explanation,
        }),
      });

      if (!response.ok) throw new Error("Failed to analyze explanation");

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error("Error analyzing explanation:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setExplanation("");
    setFeedback(null);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  if (feedback) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="border-2 border-accent">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  Your Teaching Score: {feedback.score}/10
                </h3>
                <p className="text-sm text-foreground-muted">{feedback.overall}</p>
              </div>
            </div>

            {feedback.strengths.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <h4 className="text-sm font-semibold text-foreground">Strengths</h4>
                </div>
                <ul className="space-y-1">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-foreground-muted pl-6">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.improvements.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-warm-yellow" />
                  <h4 className="text-sm font-semibold text-foreground">Areas to Improve</h4>
                </div>
                <ul className="space-y-1">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index} className="text-sm text-foreground-muted pl-6">
                      • {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Try Again
          </Button>
          <Button onClick={onComplete} className="flex-1">
            Continue Learning
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                Teach Back: {technique.name}
              </h3>
              <p className="text-sm text-foreground-muted">
                Explain this technique in your own words as if you were teaching someone else. 
                This helps reinforce your understanding.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/50 mb-4">
            <p className="text-sm text-foreground-muted mb-2 font-medium">What to cover:</p>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• What is {technique.name}?</li>
              <li>• How do you practice it?</li>
              <li>• Why is it important?</li>
              <li>• What are common mistakes to avoid?</li>
            </ul>
          </div>

          <div className="relative">
            <Textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Start explaining the technique here..."
              className="min-h-[200px] resize-none"
              disabled={isRecording}
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRecording}
              className={`absolute bottom-3 right-3 gap-2 ${
                isRecording ? "bg-red-500/10 border-red-500/30" : ""
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4 text-red-500" />
                  <span className="text-red-500">Recording...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Voice
                </>
              )}
            </Button>
          </div>

          {isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-3 h-3 rounded-full bg-red-500"
                />
                <p className="text-sm text-red-500">
                  Voice recording is simulated. Type your explanation above.
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={!explanation.trim() || isAnalyzing}
        className="w-full gap-2"
        size="lg"
      >
        {isAnalyzing ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            Analyzing...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Get Feedback
          </>
        )}
      </Button>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Mic, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TopBar from "@/components/TopBar";
import type { Practice } from "@/types";
import { Answer } from "@/domain/Answer";
import { AnswerValidator } from "@/domain/AnswerValidator";
import { EmotionDetector } from "@/domain/EmotionDetector";
import { Emotion } from "@/universal/Emotion";
import { FindNextPractice } from "@/lib/api";

type NavState = {
  current: Practice;
  userAnswer: string;
  wasCorrect: boolean;
  emotion: Emotion;
  nextPractice?: Practice | null;
  nextDifficultyFallback?: Practice["difficulty"]; 
};

type RecordingState = "idle" | "recording" | "processing";

const PracticeResult = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: Partial<NavState> };

  useEffect(() => {
    if (!state?.current) navigate("/practice/speaking");
  }, [state?.current, navigate]);

  const current = state?.current as Practice | undefined;
  const initialUserAnswer = state?.userAnswer ?? "";
  const initialCorrect = !!state?.wasCorrect;

  const [recording, setRecording] = useState<RecordingState>("idle");
  const [transcript, setTranscript] = useState<string>(initialUserAnswer);
  const [isCorrect, setIsCorrect] = useState<boolean>(initialCorrect);
  const [emotion, setEmotion] = useState<Emotion>(state?.emotion ?? Emotion.NEUTRAL);
  const [hint, setHint] = useState<string | null>(null);
  const [nextPractice, setNextPractice] = useState<Practice | null>(state?.nextPractice ?? null);

  const nextDifficultyFallback = state?.nextDifficultyFallback;
  const recognitionRef = useRef<any | null>(null);

  const raise = (d: Practice["difficulty"]) => (d === "easy" ? "medium" : d === "medium" ? "hard" : "hard");
  const lower = (d: Practice["difficulty"]) => (d === "hard" ? "medium" : d === "medium" ? "easy" : "easy");

  useEffect(() => {
    if (!current) return;
    const validator = new AnswerValidator(current);
    const correct = validator.ValidateAnswer(new Answer(transcript ?? ""));
    setIsCorrect(correct);

    const emo = new EmotionDetector().Detect(transcript ?? "");
    if (state?.emotion == null) setEmotion(emo);
  }, [current, transcript, state?.emotion]);

  const computedNextDifficulty: Practice["difficulty"] | undefined = current
    ? (() => {
        if (isCorrect && emotion === Emotion.POSITIVE) return raise(current.difficulty);
        if (!isCorrect && emotion === Emotion.NEGATIVE) return lower(current.difficulty);
        return current.difficulty;
      })()
    : undefined;

  useEffect(() => {
    if (!current) return;
    const toShow =
      nextPractice?.difficulty ||
      nextDifficultyFallback ||
      computedNextDifficulty ||
      "(pending)";
    console.log(
      "[Result] Emotion:",
      Emotion[emotion],
      "| current difficulty:",
      current.difficulty,
      "| next difficulty:",
      toShow
    );
  }, [emotion, current?.difficulty, nextPractice?.difficulty, nextDifficultyFallback, computedNextDifficulty, current]);

  const toggleMic = async () => {
    if (recording === "idle") {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) {
        const text = window.prompt("Type your answer (speech unavailable):") ?? "";
        setTranscript(text);
        return;
      }
      const recognition = new SR();
      recognitionRef.current = recognition;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const text: string = event.results[0][0].transcript;
        setTranscript(text);
        setRecording("idle");
      };

      recognition.onerror = () => {
        setRecording("idle");
        alert("Speech recognition failed. Please try again.");
      };

      recognition.onend = () => {
        if (recording === "recording") setRecording("idle");
      };

      try {
        recognition.start();
        setRecording("recording");
      } catch {
        setRecording("idle");
      }
      return;
    }

    if (recording === "recording") {
      try {
        recognitionRef.current?.stop?.();
      } catch {}
      setRecording("processing");
    }
  };

  const goNext = async () => {
    if (!current) {
      navigate("/practice/speaking");
      return;
    }

    const targetDifficulty: Practice["difficulty"] =
      computedNextDifficulty ??
      nextDifficultyFallback ??
      current.difficulty;

    navigate("/practice/speaking", { state: { difficulty: targetDifficulty } });

    try {
      const np = await FindNextPractice(current, emotion);
      setNextPractice(np ?? null);
    } catch {}
  };

  const retrySpeaking = () => {
    navigate("/practice/speaking", { state: { difficulty: current?.difficulty ?? "easy" } });
  };

  if (!current) return null;

  return (
    <div className="min-h-screen gradient-bg">
      <TopBar />
      <main className="max-w-[1200px] mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="rounded-2xl shadow-lg bg-white/95 backdrop-blur p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {isCorrect ? (
                  <CheckCircle2 className="w-16 h-16 text-ml-accent" />
                ) : (
                  <XCircle className="w-16 h-16 text-ml-error" />
                )}
              </div>

              <h2 className="text-2xl font-semibold text-foreground mb-2">
                {isCorrect ? "Correct!" : "Try again"}
              </h2>

              <div className="bg-muted/40 rounded-xl p-4 mb-3">
                <p className="text-sm text-muted-foreground mb-1">Question:</p>
                <p className="text-lg font-medium text-foreground">{current.question}</p>
              </div>

              <div className="bg-muted/40 rounded-xl p-4 mb-4">
                <p className="text-sm text-muted-foreground mb-1">Expected answer:</p>
                <p className="text-lg font-medium text-foreground">{current.correct_answer}</p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 mb-4">
                <p className="text-sm text-muted-foreground mb-1">You said:</p>
                <p className="text-lg font-medium text-foreground break-words">
                  {transcript || "—"}
                </p>
              </div>

              {!isCorrect && (
                <div className="bg-ml-warn/10 border border-ml-warn/20 rounded-xl p-4">
                  <p className="text-sm text-ml-warn font-medium mb-1">💡 Tip:</p>
                  <p className="text-sm text-foreground">
                    Try to match the phrase exactly. Speak clearly and at a steady pace.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 mb-6">
              <Button
                onClick={toggleMic}
                variant={recording === "recording" ? "destructive" : "outline"}
                className="h-11 rounded-2xl px-4"
              >
                <Mic className="w-4 h-4 mr-2" />
                {recording === "recording" ? "Stop" : "Speak again"}
              </Button>

              {recording === "processing" && (
                <span className="text-sm text-muted-foreground">Processing…</span>
              )}
            </div>

            {hint && (
              <p className="text-xs text-muted-foreground text-center mb-4 italic">
                {hint}
              </p>
            )}

            <div className="flex gap-4">
              <Button
                onClick={retrySpeaking}
                variant="outline"
                className="flex-1 h-12 rounded-2xl border-2"
              >
                Retry
              </Button>

              <Button
                onClick={goNext}
                className="flex-1 h-12 rounded-2xl bg-ml-primary hover:bg-ml-primary/90 text-white font-medium"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default PracticeResult;

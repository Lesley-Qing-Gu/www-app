import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TopBar from "@/components/TopBar";
import ProgressStep from "@/components/ProgressStep";
import MicButton from "@/components/MicButton";

import type { Practice } from "@/types";
import { Answer } from "@/domain/Answer";
import { AnswerValidator } from "@/domain/AnswerValidator";
import { EmotionDetector } from "@/domain/EmotionDetector";
import { Emotion } from "@/universal/Emotion";
import { FindNextPractice, practicesByDifficulty } from "@/lib/api";

type RecordingState = "idle" | "recording" | "processing";

const PracticeSpeaking = () => {
  const navigate = useNavigate();
  const { state: navState } = useLocation() as { state?: { difficulty?: Practice["difficulty"] } };

  const [state, setState] = useState<RecordingState>("idle");
  const [practice, setPractice] = useState<Practice | null>(null);
  const [loading, setLoading] = useState(true);
  const [hint, setHint] = useState<string | null>(null);
  const [fatal, setFatal] = useState<string | null>(null);

  const recognitionRef = useRef<any | null>(null);

  /** Load one practice; prefer by difficulty, fallback to all */
  useEffect(() => {
    let mounted = true;

    async function loadPractice() {
      setLoading(true);
      setHint(null);
      setFatal(null);

      const diff = navState?.difficulty ?? "easy";
      const base = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

      try {
        const list = await practicesByDifficulty(diff);
        if (!mounted) return;

        if (Array.isArray(list) && list.length > 0) {
          const item = list[Math.floor(Math.random() * list.length)];
          setPractice(item);
        } else {
          // fallback to all
          const r = await fetch(`${base}/api/practices`);
          if (!r.ok) throw new Error(`Fallback HTTP ${r.status} ${r.statusText}`);
          const all = await r.json();
          if (Array.isArray(all) && all.length > 0) {
            setPractice(all[Math.floor(Math.random() * all.length)]);
            setHint(`No "${diff}" practices; used any difficulty.`);
          } else {
            setFatal("No practices found in database.");
          }
        }
      } catch (err: any) {
        console.error("[UI] load by difficulty failed:", err?.message ?? err);
        try {
          const r = await fetch(`${base}/api/practices`);
          if (!r.ok) throw new Error(`Fallback HTTP ${r.status} ${r.statusText}`);
          const all = await r.json();
          if (Array.isArray(all) && all.length > 0) {
            setPractice(all[Math.floor(Math.random() * all.length)]);
            setHint(`Failed to load "${navState?.difficulty ?? "easy"}"; used any difficulty.`);
          } else {
            setFatal("No practices found in database.");
          }
        } catch (err2: any) {
          console.error("[UI] fallback /api/practices failed:", err2?.message ?? err2);
          setFatal(`Failed to load practices: ${err2?.message ?? "unknown error"}`);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadPractice();
    return () => {
      mounted = false;
      try {
        recognitionRef.current?.stop?.();
      } catch {}
      recognitionRef.current = null;
    };
  }, [navState?.difficulty]);

  /** Start/stop recognition; on result, validate and navigate */
  const handleMicClick = async () => {
    if (state === "idle") {
      // start recognition immediately when mic clicked
      const SR =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) {
        const transcript = window.prompt("Type your answer (speech unavailable):") ?? "";
        return handleAnswer(transcript);
      }

      const recognition = new SR();
      recognitionRef.current = recognition;

      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = async (event: any) => {
        const transcript: string = event.results[0][0].transcript;
        await handleAnswer(transcript);
      };
      recognition.onerror = (event: any) => {
        console.error("SpeechRecognition error:", event.error);
        setState("idle");
        alert("Speech recognition failed. Please try again.");
      };
      recognition.onend = () => {
        if (state === "recording") setState("idle");
      };

      try {
        recognition.start();
        setState("recording");
      } catch (e) {
        console.error("recognition.start failed:", e);
        setState("idle");
      }
      return;
    }

    if (state === "recording") {
      try {
        recognitionRef.current?.stop?.();
      } catch {}
      setState("processing");
    }
  };

  /** Validate, detect emotion, ask backend for next, then navigate */
  const handleAnswer = async (transcript: string) => {
    if (!practice) {
      setFatal("No current practice available.");
      return;
    }

    setState("processing");

    const wasCorrect = new AnswerValidator(practice).ValidateAnswer(new Answer(transcript));
    const emotion: Emotion = new EmotionDetector().Detect(transcript);

    let nextPractice: Practice | null = null;
    try {
      nextPractice = await FindNextPractice(practice, emotion);
    } catch (e) {
      console.error("FindNextPractice failed:", e);
    }

    navigate("/practice/result", {
      state: {
        current: practice,
        userAnswer: transcript,
        wasCorrect,
        emotion,
        nextPractice,
      },
    });
  };

  const handleSkip = () => {
    navigate("/practice/result", {
      state: practice
        ? { current: practice, userAnswer: "", wasCorrect: false, emotion: Emotion.NEUTRAL }
        : undefined,
    });
  };

  return (
    <div className="min-h-screen gradient-bg">
      <TopBar />

      <main className="max-w-[1200px] mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="mb-8">
          <ProgressStep current={1} total={3} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="rounded-2xl shadow-lg bg-white/95 backdrop-blur p-8 md:p-12 text-center">
            <h2 className="text-lg font-medium text-muted-foreground mb-4">
              Translate to English
            </h2>

            <div className="text-5xl md:text-6xl font-semibold text-foreground mb-12">
              {loading && "Loading..."}
              {!loading && fatal && <span className="text-2xl text-red-500">{fatal}</span>}
              {!loading && !fatal && (practice?.question ?? "No question")}
            </div>

            <div className="flex flex-col items-center gap-6">
              {/* ✅ Only the mic button now controls recording */}
              <MicButton isRecording={state === "recording"} onClick={handleMicClick} />

              {state === "recording" && (
                <p className="text-muted-foreground">Recording... Click again to Stop</p>
              )}
              {state === "processing" && (
                <p className="text-muted-foreground">Processing your answer...</p>
              )}
            </div>
          </Card>

          {/* Non-blocking hint below the card */}
          {hint && !fatal && (
            <p className="mt-3 text-sm text-white/80 text-right italic">{hint}</p>
          )}

          <div className="flex justify-end mt-4">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Skip
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PracticeSpeaking;

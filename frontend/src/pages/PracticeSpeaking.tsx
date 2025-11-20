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
import { FindNextPractice } from "@/lib/api";

type RecordingState = "idle" | "recording" | "processing";
type SessionMode = "emotion" | "fixed"; // "fixed" = A, "emotion" = B

const MAX_QUESTIONS = 10;

const FIXED_SEQUENCE: Practice["difficulty"][] = [
  "easy",
  "easy",
  "easy",
  "easy",
  "medium",
  "medium",
  "medium",
  "hard",
  "hard",
  "hard",
];

const COUNT_KEY = "practice_count_v1";
const ANSWERS_KEY = "practice_answers_v1";
const MODE_KEY = "practice_mode_v1";

const PARTICIPANT_ID_KEY = "participant_id";
const USED_IDS_KEY = "practice_used_ids_v1"; // 这一轮已用过的题目 id

const PracticeSpeaking = () => {
  const navigate = useNavigate();

  type NavMode = SessionMode | "A" | "B" | undefined;

  const { state: navState } = useLocation() as {
    state?: { difficulty?: Practice["difficulty"]; mode?: NavMode };
  };

  const [sessionMode] = useState<SessionMode>(() => {
    if (typeof window !== "undefined") {
      const stored = window.sessionStorage.getItem(MODE_KEY);
      if (stored === "fixed" || stored === "emotion") {
        return stored;
      }
    }

    const mode = navState?.mode;
    if (mode === "fixed" || mode === "A") return "fixed"; // Version A
    if (mode === "emotion" || mode === "B") return "emotion"; // Version B

    return "emotion";
  });

  const [state, setState] = useState<RecordingState>("idle");
  const [practice, setPractice] = useState<Practice | null>(null);
  const [loading, setLoading] = useState(true);
  const [hint, setHint] = useState<string | null>(null);
  const [fatal, setFatal] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);

  const [questionCount, setQuestionCount] = useState<number>(() => {
    if (typeof window === "undefined") return 0;

    try {
      const rawAnswers = window.sessionStorage.getItem(ANSWERS_KEY);
      if (rawAnswers) {
        const arr = JSON.parse(rawAnswers);
        if (Array.isArray(arr)) {
          const len = arr.length;
          if (len >= 0 && len <= MAX_QUESTIONS) {
            return len;
          }
        }
      }
    } catch {
      // ignore
    }

    const raw = window.sessionStorage.getItem(COUNT_KEY);
    const n = raw ? parseInt(raw, 10) : 0;
    if (Number.isNaN(n) || n < 0) return 0;
    if (n > MAX_QUESTIONS) return MAX_QUESTIONS;
    return n;
  });

  // 这一轮 session 中已经出现过的 practice id
  const [usedIds, setUsedIds] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.sessionStorage.getItem(USED_IDS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const rawAnswers = window.sessionStorage.getItem(ANSWERS_KEY);
      if (rawAnswers) {
        const arr = JSON.parse(rawAnswers);
        if (Array.isArray(arr)) {
          const len = Math.min(arr.length, MAX_QUESTIONS);
          if (len !== questionCount) {
            setQuestionCount(len);
            window.sessionStorage.setItem(COUNT_KEY, String(len));
          }
        }
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 切换模式时重置计数 & 已用题目
  useEffect(() => {
    if (typeof window === "undefined") return;
    const existingMode = window.sessionStorage.getItem(MODE_KEY);
    if (existingMode !== sessionMode) {
      window.sessionStorage.setItem(MODE_KEY, sessionMode);
      window.sessionStorage.removeItem(COUNT_KEY);
      window.sessionStorage.removeItem(ANSWERS_KEY);
      window.sessionStorage.removeItem(USED_IDS_KEY);
      setQuestionCount(0);
      setUsedIds([]);
    }
  }, [sessionMode]);

  useEffect(() => {
    let mounted = true;

    async function loadPractice() {
      if (questionCount >= MAX_QUESTIONS) {
        setLoading(false);
        setFatal("This condition is finished. You have completed 10 questions.");
        return;
      }

      setLoading(true);
      setHint(null);
      setFatal(null);

      let diff: Practice["difficulty"] = navState?.difficulty ?? "easy";

      if (sessionMode === "fixed") {
        const idx = Math.min(questionCount, FIXED_SEQUENCE.length - 1);
        diff = FIXED_SEQUENCE[idx];
      }

      const base = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";
      // 根据 sessionMode 选用 A 表还是 B 表
      const modePath =
        sessionMode === "fixed" ? "/api/practices_a" : "/api/practices_b";

      try {
        // 1）先按难度取题
        const listRes = await fetch(`${base}${modePath}?difficulty=${diff}`);
        if (!listRes.ok) {
          throw new Error(`HTTP ${listRes.status} ${listRes.statusText}`);
        }
        const list: Practice[] = await listRes.json();
        if (!mounted) return;

        if (Array.isArray(list) && list.length > 0) {
          // 先过滤掉已经用过的题，如果这一难度都用光了，就允许重复
          const candidates =
            Array.isArray(usedIds) && usedIds.length > 0
              ? list.filter((item) => !usedIds.includes(item.id))
              : list;

          const pool = candidates.length > 0 ? candidates : list;
          const item = pool[Math.floor(Math.random() * pool.length)];
          setPractice(item);
        } else {
          // 2）如果这个难度没有题，就在同一个 mode 下随便取一题
          const r = await fetch(`${base}${modePath}`);
          if (!r.ok) throw new Error(`Fallback HTTP ${r.status} ${r.statusText}`);
          const all: Practice[] = await r.json();
          if (Array.isArray(all) && all.length > 0) {
            // 同样可以过滤已用 id（这里题数一般更多，其实重复概率本来也不高）
            const candidates =
              Array.isArray(usedIds) && usedIds.length > 0
                ? all.filter((item) => !usedIds.includes(item.id))
                : all;
            const pool = candidates.length > 0 ? candidates : all;

            setPractice(pool[Math.floor(Math.random() * pool.length)]);
            setHint(`No "${diff}" practices; used any difficulty in this mode.`);
          } else {
            setFatal("No practices found in database for this mode.");
          }
        }
      } catch (err: any) {
        try {
          // 3）如果上面整个流程报错，也只在当前 mode 下随便取一题
          const r = await fetch(`${base}${modePath}`);
          if (!r.ok) throw new Error(`Fallback HTTP ${r.status} ${r.statusText}`);
          const all: Practice[] = await r.json();
          if (Array.isArray(all) && all.length > 0) {
            const candidates =
              Array.isArray(usedIds) && usedIds.length > 0
                ? all.filter((item) => !usedIds.includes(item.id))
                : all;
            const pool = candidates.length > 0 ? candidates : all;

            setPractice(pool[Math.floor(Math.random() * pool.length)]);
            setHint(
              `Failed to load "${navState?.difficulty ?? "easy"}"; used any difficulty in this mode.`
            );
          } else {
            setFatal("No practices found in database for this mode.");
          }
        } catch (err2: any) {
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
  }, [navState?.difficulty, questionCount, sessionMode, usedIds]);

  const handleMicClick = async () => {
    if (state === "idle") {
      const SR =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) {
        const transcript = window.prompt("Type your answer (speech unavailable):") ?? "";
        return handleAnswer(transcript, null);
      }
      const recognition = new SR();
      recognitionRef.current = recognition;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const transcript = (recognitionRef.current as any)?.finalTranscript ?? "";
        await handleAnswer(transcript, audioBlob);
      };

      recognition.onresult = (event: any) => {
        const transcript: string = event.results[0][0].transcript;
        (recognitionRef.current as any).finalTranscript = transcript;
      };
      recognition.onerror = () => {
        setState("idle");
        alert("Speech recognition failed. Please try again.");
      };
      recognition.onend = () => {
        if (state === "recording") setState("idle");
        try {
          mediaRecorder.stop();
        } catch {}
        stream.getTracks().forEach((t) => t.stop());
      };

      try {
        recognition.start();
        mediaRecorder.start();
        setState("recording");
      } catch {
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

  const handleAnswer = async (transcript: string, audioBlob: Blob | null) => {
    if (!practice) {
      setFatal("No current practice available.");
      return;
    }
    setState("processing");

    const wasCorrect = new AnswerValidator(practice).ValidateAnswer(
      new Answer(transcript)
    );

    let emotion: Emotion = Emotion.NEUTRAL;

    if (sessionMode === "emotion") {
      emotion = new EmotionDetector().Detect(transcript);

      if (audioBlob) {
        try {
          const speechBase =
            import.meta.env.VITE_SPEECH_BASE ?? "http://localhost:8080";
          const fd = new FormData();
          fd.append("file", audioBlob, "speech.webm");
          const res = await fetch(`${speechBase}/emotion`, {
            method: "POST",
            body: fd,
          });
          if (res.ok) {
            const js = await res.json();
            const label = (js?.label ?? "Neutral").toString().toUpperCase();
            emotion =
              label === "POSITIVE"
                ? Emotion.POSITIVE
                : label === "NEGATIVE"
                ? Emotion.NEGATIVE
                : Emotion.NEUTRAL;
          }
        } catch {
        }
      }
    } else {
      emotion = Emotion.NEUTRAL;
    }

    let updated: any[] = [];
    let newCount = questionCount + 1;

    try {
      const raw = window.sessionStorage.getItem(ANSWERS_KEY);
      const prev: any[] = raw ? JSON.parse(raw) : [];

      const newEntry = {
        index: newCount,
        difficulty: practice.difficulty,
        emotion: String(emotion),
        wasCorrect,
      };

      updated = [...prev, newEntry];
      window.sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(updated));

      newCount = updated.length;
      if (newCount > MAX_QUESTIONS) newCount = MAX_QUESTIONS;

      setQuestionCount(newCount);
      window.sessionStorage.setItem(COUNT_KEY, String(newCount));
    } catch (e) {
      console.warn("Failed to log answers in sessionStorage:", e);
    }

    // 把当前 practice id 记为“已使用”
    try {
      const rawUsed = window.sessionStorage.getItem(USED_IDS_KEY);
      const prevUsed: number[] = rawUsed ? JSON.parse(rawUsed) : [];
      const exists = prevUsed.includes(practice.id);
      const nextUsed = exists ? prevUsed : [...prevUsed, practice.id];
      window.sessionStorage.setItem(USED_IDS_KEY, JSON.stringify(nextUsed));
      setUsedIds(nextUsed);
    } catch (e) {
      console.warn("Failed to log used practice ids:", e);
    }

    const sessionFinished = newCount >= MAX_QUESTIONS;

    if (sessionFinished) {
      try {
        const participantId =
          window.localStorage.getItem(PARTICIPANT_ID_KEY) ?? "";
        const versionLabel = sessionMode === "fixed" ? "A" : "B";

        const header = [
          "ParticipantId",
          "Version",
          "Task",
          "Difficulty",
          "Emotion",
          "Correct",
        ];
        const rows = updated.map((e) => [
          participantId || "",
          versionLabel,
          e.index,
          e.difficulty,
          e.emotion,
          e.wasCorrect ? "1" : "0",
        ]);

        const csvContent =
          header.join(",") +
          "\n" +
          rows.map((r) => r.join(",")).join("\n");

        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });

        const fileName = `${participantId || "unknown"}_${versionLabel}.csv`;

        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        window.sessionStorage.removeItem(ANSWERS_KEY);
        window.sessionStorage.removeItem(USED_IDS_KEY);
        setUsedIds([]);
      } catch (err) {
        console.warn("Failed to export CSV:", err);
      }
    }

    let nextDifficulty: Practice["difficulty"] = practice.difficulty;

    if (sessionMode === "fixed") {
      const nextIdx = Math.min(newCount, FIXED_SEQUENCE.length - 1);
      nextDifficulty = FIXED_SEQUENCE[nextIdx] ?? "hard";
    } else {
      const raise = (d: Practice["difficulty"]) =>
        d === "easy" ? "medium" : d === "medium" ? "hard" : "hard";
      const lower = (d: Practice["difficulty"]) =>
        d === "hard" ? "medium" : d === "medium" ? "easy" : "easy";

      nextDifficulty = practice.difficulty;

      if (wasCorrect && emotion === Emotion.POSITIVE) {
        nextDifficulty = raise(practice.difficulty);
      } else if (!wasCorrect && emotion === Emotion.NEGATIVE) {
        nextDifficulty = lower(practice.difficulty);
      }
    }

    let nextPractice: Practice | null = null;
    if (sessionMode === "emotion" && !sessionFinished) {
      try {
        nextPractice = await FindNextPractice(practice, emotion);
      } catch {
        // ignore
      }
    }

    navigate("/practice/result", {
      state: {
        current: practice,
        userAnswer: transcript,
        wasCorrect,
        emotion,
        nextPractice,
        nextDifficultyFallback: nextDifficulty,
        sessionMode,
        questionIndex: newCount,
        sessionFinished,
      },
    });
  };

  const handleSkip = () => {
    const newCount = questionCount + 1;
    const sessionFinished = newCount >= MAX_QUESTIONS;

    try {
      const raw = window.sessionStorage.getItem(ANSWERS_KEY);
      const prev: any[] = raw ? JSON.parse(raw) : [];
      const newEntry = {
        index: newCount,
        difficulty: practice?.difficulty ?? "easy",
        emotion: String(Emotion.NEUTRAL),
        wasCorrect: false,
      };
      const updated = [...prev, newEntry];
      window.sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(updated));
      setQuestionCount(updated.length);
      window.sessionStorage.setItem(COUNT_KEY, String(updated.length));
    } catch (e) {
      console.warn("Failed to log skipped answer:", e);
      setQuestionCount(newCount);
      window.sessionStorage.setItem(COUNT_KEY, String(newCount));
    }

    // Skip 也算“用过这道题”
    try {
      if (practice?.id != null) {
        const rawUsed = window.sessionStorage.getItem(USED_IDS_KEY);
        const prevUsed: number[] = rawUsed ? JSON.parse(rawUsed) : [];
        const exists = prevUsed.includes(practice.id);
        const nextUsed = exists ? prevUsed : [...prevUsed, practice.id];
        window.sessionStorage.setItem(USED_IDS_KEY, JSON.stringify(nextUsed));
        setUsedIds(nextUsed);
      }
    } catch (e) {
      console.warn("Failed to log used practice ids on skip:", e);
    }

    navigate("/practice/result", {
      state: practice
        ? {
            current: practice,
            userAnswer: "",
            wasCorrect: false,
            emotion: Emotion.NEUTRAL,
            sessionMode,
            questionIndex: newCount,
            sessionFinished,
          }
        : undefined,
    });
  };

  const currentStep = Math.min(questionCount + 1, MAX_QUESTIONS);

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
          <ProgressStep current={currentStep} total={MAX_QUESTIONS} />
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
              {!loading && fatal && (
                <span className="text-2xl text-red-500">{fatal}</span>
              )}
              {!loading && !fatal && (practice?.question ?? "No question")}
            </div>
            <div className="flex flex-col items-center gap-6">
              <MicButton
                isRecording={state === "recording"}
                onClick={handleMicClick}
              />
              {state === "recording" && (
                <p className="text-muted-foreground">
                  Recording... Click again to Stop
                </p>
              )}
              {state === "processing" && (
                <p className="text-muted-foreground">
                  Processing your answer...
                </p>
              )}
            </div>
          </Card>
          {hint && !fatal && (
            <p className="mt-3 text-sm text-white/80 text-right italic">
              {hint}
            </p>
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

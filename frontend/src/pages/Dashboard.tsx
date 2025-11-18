import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";

const PARTICIPANT_ID_KEY = "participant_id";
const COUNT_KEY = "practice_count_v1";
const ANSWERS_KEY = "practice_answers_v1";
const MODE_KEY = "practice_mode_v1";

const Dashboard = () => {
  const navigate = useNavigate();

  const [participantId, setParticipantId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(PARTICIPANT_ID_KEY) ?? "";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PARTICIPANT_ID_KEY, participantId);
    }
  }, [participantId]);

  const resetSessionStorage = () => {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(COUNT_KEY);
    window.sessionStorage.removeItem(ANSWERS_KEY);
    window.sessionStorage.removeItem(MODE_KEY);
  };

  const handleStartA = () => {
    if (!participantId.trim()) {
      alert("Please enter your Participant ID before starting.");
      return;
    }

    resetSessionStorage();

    navigate("/practice/speaking", {
      state: {
        mode: "fixed", // Version A
      },
    });
  };

  const handleStartB = () => {
    if (!participantId.trim()) {
      alert("Please enter your Participant ID before starting.");
      return;
    }

    resetSessionStorage();

    navigate("/practice/speaking", {
      state: {
        mode: "emotion", // Version B
      },
    });
  };

  return (
    <div className="min-h-screen gradient-bg">
      <TopBar />

      <main className="max-w-[800px] mx-auto p-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-semibold text-white/90 drop-shadow mb-6 text-center"
        >
          A/B Test – Choose Your Condition
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white/95 backdrop-blur rounded-2xl shadow-lg p-6 mb-10"
        >
          <label
            htmlFor="participantId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Participant ID
          </label>
          <input
            id="participantId"
            type="text"
            value={participantId}
            onChange={(e) => setParticipantId(e.target.value)}
            placeholder="e.g. P01"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ml-primary focus:border-transparent"
          />
          <p className="mt-2 text-xs text-gray-500">
            This ID will be stored locally and used to link your answers to this session.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Button
            onClick={handleStartA}
            className="h-16 px-10 rounded-2xl bg-white/95 text-ml-primary font-semibold text-xl shadow-lg hover:shadow-xl hover:bg-white"
          >
            A
          </Button>

          <Button
            onClick={handleStartB}
            className="h-16 px-10 rounded-2xl bg-ml-primary hover:bg-ml-primary/90 text-white font-semibold text-xl shadow-lg hover:shadow-xl"
          >
            B
          </Button>
        </motion.div>
{/* 
        <p className="mt-6 text-center text-sm text-white/80">
          A = fixed difficulty (4 easy · 3 medium · 3 hard) &nbsp;&nbsp;|&nbsp;&nbsp;
          B = emotion-adaptive difficulty
        </p> */}
      </main>
    </div>
  );
};

export default Dashboard;

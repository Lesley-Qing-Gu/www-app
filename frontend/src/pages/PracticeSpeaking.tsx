import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TopBar from "@/components/TopBar";
import ProgressStep from "@/components/ProgressStep";
import MicButton from "@/components/MicButton";

type RecordingState = "idle" | "recording" | "processing";

const PracticeSpeaking = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<RecordingState>("idle");

  const handleMicClick = () => {
    if (state === "idle") {
      setState("recording");
    } else if (state === "recording") {
      setState("processing");
      // Mock processing delay
      setTimeout(() => {
        navigate("/practice/result");
      }, 2000);
    }
  };

  const handleSkip = () => {
    navigate("/practice/result");
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
              Anteeksi
            </div>

            <div className="flex flex-col items-center gap-6">
              <MicButton isRecording={state === "recording"} onClick={handleMicClick} />
              
              <div className="min-h-[60px] flex items-center justify-center">
                {state === "idle" && (
                  <Button
                    onClick={handleMicClick}
                    className="h-12 px-8 rounded-2xl bg-ml-primary hover:bg-ml-primary/90 text-white font-medium"
                  >
                    Start
                  </Button>
                )}
                {state === "recording" && (
                  <p className="text-muted-foreground">
                    Recording... Click to Stop
                  </p>
                )}
                {state === "processing" && (
                  <p className="text-muted-foreground">
                    Processing your answer...
                  </p>
                )}
              </div>
            </div>
          </Card>

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

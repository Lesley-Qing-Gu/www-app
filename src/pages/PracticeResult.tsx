import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TopBar from "@/components/TopBar";
import ProgressStep from "@/components/ProgressStep";

const PracticeResult = () => {
  const navigate = useNavigate();
  const [isCorrect] = useState(false); // Mock result

  return (
    <div className="min-h-screen gradient-bg">
      <TopBar />
      
      <main className="max-w-[1200px] mx-auto p-6">
        <div className="mb-8">
          <ProgressStep current={1} total={3} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
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
                {isCorrect ? "Correct!" : "Sorry"}
              </h2>
              
              <div className="bg-muted/50 rounded-xl p-4 mb-4">
                <p className="text-sm text-muted-foreground mb-1">You said:</p>
                <p className="text-lg font-medium text-foreground">
                  Excuse me
                </p>
              </div>

              {!isCorrect && (
                <div className="bg-ml-warn/10 border border-ml-warn/20 rounded-xl p-4">
                  <p className="text-sm text-ml-warn font-medium mb-1">💡 Tip:</p>
                  <p className="text-sm text-foreground">
                    Focus on the 'r' sound in the middle of the word.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => navigate("/practice/speaking")}
                variant="outline"
                className="flex-1 h-12 rounded-2xl border-2"
              >
                Retry
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                className="flex-1 h-12 rounded-2xl bg-ml-primary hover:bg-ml-primary/90 text-white font-medium"
              >
                Next
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default PracticeResult;

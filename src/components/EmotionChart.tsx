import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

const data = [
  { session: "1", difficulty: 3, confidence: 2 },
  { session: "2", difficulty: 4, confidence: 3 },
  { session: "3", difficulty: 3, confidence: 4 },
  { session: "4", difficulty: 5, confidence: 4 },
  { session: "5", difficulty: 4, confidence: 5 },
];

const EmotionChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="rounded-2xl shadow-lg bg-white/95 backdrop-blur p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Emotion Changes</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="session" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="difficulty" 
              stroke="hsl(var(--ml-primary))" 
              strokeWidth={2}
              dot={{ fill: "hsl(var(--ml-primary))" }}
            />
            <Line 
              type="monotone" 
              dataKey="confidence" 
              stroke="hsl(var(--ml-accent))" 
              strokeWidth={2}
              dot={{ fill: "hsl(var(--ml-accent))" }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ml-primary"></div>
            <span className="text-sm text-muted-foreground">Difficulty</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ml-accent"></div>
            <span className="text-sm text-muted-foreground">Confidence</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default EmotionChart;

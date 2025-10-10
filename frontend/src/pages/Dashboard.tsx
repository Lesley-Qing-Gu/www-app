import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import StatCard from "@/components/StatCard";
import EmotionChart from "@/components/EmotionChart";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg">
      <TopBar />
      
      <main className="max-w-[1200px] mx-auto p-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-semibold text-white/90 drop-shadow mb-8"
        >
          Your Learning Progress
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Streak" value="0" caption="days in a row" delay={0} />
          <StatCard title="Level" value="1" caption="100 XP to Next" delay={0.1} />
          <StatCard title="Total XP" value="0" caption="experience points" delay={0.2} />
          <StatCard title="Answered" value="0" caption="questions completed" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EmotionChart />
          <div></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex justify-center"
        >
          <Button
            onClick={() => navigate("/practice/speaking")}
            className="h-14 px-12 rounded-2xl bg-ml-primary hover:bg-ml-primary/90 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Start Practice
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  caption?: string;
  delay?: number;
}

const StatCard = ({ title, value, caption, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="rounded-2xl shadow-lg bg-white/95 backdrop-blur p-6 hover:shadow-xl transition-shadow">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
        <div className="text-3xl font-semibold text-foreground mb-1">{value}</div>
        {caption && <p className="text-xs text-muted-foreground">{caption}</p>}
      </Card>
    </motion.div>
  );
};

export default StatCard;

import { Progress } from "@/components/ui/progress";

interface ProgressStepProps {
  current: number;
  total: number;
}

const ProgressStep = ({ current, total }: ProgressStepProps) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-white/70">{current} / {total}</span>
      </div>
      <Progress value={percentage} className="h-2 bg-white/20" />
    </div>
  );
};

export default ProgressStep;

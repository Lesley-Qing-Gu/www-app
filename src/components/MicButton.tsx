import { Mic, Square } from "lucide-react";
import { motion } from "framer-motion";

interface MicButtonProps {
  isRecording: boolean;
  onClick: () => void;
}

const MicButton = ({ isRecording, onClick }: MicButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
        isRecording 
          ? "bg-ml-error hover:bg-ml-error/90" 
          : "bg-ml-accent hover:bg-ml-accent/90"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isRecording ? (
        <Square className="w-8 h-8 text-white" fill="white" />
      ) : (
        <Mic className="w-8 h-8 text-white" />
      )}
      
      {isRecording && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-ml-error"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.button>
  );
};

export default MicButton;

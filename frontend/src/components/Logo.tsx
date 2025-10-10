type LogoProps = {
  variant?: "light" | "dark";
};

const Logo = ({ variant = "light" }: LogoProps) => {
  const isLight = variant === "light";

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ml-primary to-ml-accent flex items-center justify-center">
        <span className="text-white font-bold text-sm">M</span>
      </div>
      <span
        className={`font-semibold text-xl tracking-tight ${
          isLight ? "text-white" : "text-[#0E2A72]"
        }`}
      >
        MoodiLearn
      </span>
    </div>
  );
};

export default Logo;
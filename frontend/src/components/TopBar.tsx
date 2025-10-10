import Logo from "./Logo";

interface TopBarProps {
  userEmail?: string;
}

const TopBar = ({ userEmail = "mood.learn@sample.com" }: TopBarProps) => {
  return (
    <header className="w-full border-b border-white/10 backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Logo variant="light"/>
        {userEmail && (
          <div className="text-white/80 text-sm">{userEmail}</div>
        )}
      </div>
    </header>
  );
};

export default TopBar;

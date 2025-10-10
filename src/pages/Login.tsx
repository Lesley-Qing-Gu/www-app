import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Logo from "@/components/Logo";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    // Mock login delay
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-lg bg-white/95 backdrop-blur p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="mb-4">
              <Logo variant="dark"/>
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome Back!</h1>
            <p className="text-muted-foreground text-center">
              Start your language journey with your Emotion ♥︎
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl"
                required
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl"
                required
              />
              <div className="text-right mt-2">
                <button type="button" className="text-sm text-ml-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-2xl bg-ml-primary hover:bg-ml-primary/90 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full h-11 rounded-2xl"
              onClick={() => {}}
            >
              Signup
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{" "}
            <button className="text-ml-primary hover:underline font-medium">
              Signup
            </button>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;

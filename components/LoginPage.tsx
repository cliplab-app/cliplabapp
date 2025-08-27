import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {
  onLogin?: (email: string, password: string) => Promise<void>;
  onSignup?: () => void;
  onBack?: () => void;
}

export function LoginPage({ onLogin, onSignup, onBack }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin) return;
    
    setIsLoading(true);
    try {
      await onLogin(email, password);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    if (onSignup) {
      onSignup();
    } else {
      navigate("/signup");
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <div className="window-card p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-retro-display mb-2">LOGIN</h1>
          <p className="text-muted-foreground">Welcome back to ClipLab</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-retro w-full px-4 py-3 rounded-lg"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-retro w-full px-4 py-3 rounded-lg"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 rounded-lg disabled:opacity-50"
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={handleSignup}
              className="text-primary hover:text-primary-alt underline"
            >
              Sign up
            </button>
          </p>

          <button
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground underline"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
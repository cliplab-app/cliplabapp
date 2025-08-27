import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignupPageProps {
  onSignup?: (email: string, password: string, username: string, role: "creator" | "clipper", channelLink?: string) => Promise<void>;
  onLogin?: () => void;
  onBack?: () => void;
}

export function SignupPage({ onSignup, onLogin, onBack }: SignupPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    role: "clipper" as "creator" | "clipper",
    channelLink: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSignup) return;
    
    setIsLoading(true);
    try {
      await onSignup(
        formData.email,
        formData.password,
        formData.username,
        formData.role,
        formData.channelLink || undefined
      );
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate("/login");
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
          <h1 className="text-3xl text-retro-display mb-2">SIGN UP</h1>
          <p className="text-muted-foreground">Join the ClipLab community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2">I'M A</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: "clipper" }))}
                className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                  formData.role === "clipper" 
                    ? "btn-primary" 
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                CLIPPER
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: "creator" }))}
                className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                  formData.role === "creator" 
                    ? "btn-primary" 
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                BRAND
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">USERNAME</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="input-retro w-full px-4 py-3 rounded-lg"
              placeholder="your_username"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">EMAIL</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="input-retro w-full px-4 py-3 rounded-lg"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">PASSWORD</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="input-retro w-full px-4 py-3 rounded-lg"
              placeholder="••••••••"
              required
            />
          </div>

          {formData.role === "creator" && (
            <div>
              <label className="block text-sm mb-2">CHANNEL LINK (OPTIONAL)</label>
              <input
                type="url"
                value={formData.channelLink}
                onChange={(e) => setFormData(prev => ({ ...prev, channelLink: e.target.value }))}
                className="input-retro w-full px-4 py-3 rounded-lg"
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 rounded-lg disabled:opacity-50"
          >
            {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={handleLogin}
              className="text-primary hover:text-primary-alt underline"
            >
              Login
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
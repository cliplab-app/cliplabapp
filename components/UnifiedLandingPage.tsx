import React from "react";
import { useNavigate } from "react-router-dom";

interface UnifiedLandingPageProps {
  onChooseRole?: (role: "creator" | "clipper", demoMode?: boolean) => void;
  onGetStarted?: () => void;
  onLogin?: () => void;
  onViewCaseStudies?: () => void;
}

export function UnifiedLandingPage({ 
  onChooseRole,
  onGetStarted,
  onLogin,
  onViewCaseStudies 
}: UnifiedLandingPageProps) {
  const navigate = useNavigate();

  // Fallback navigation if props aren't provided
  const handleChooseRole = (role: "creator" | "clipper", demoMode = false) => {
    if (onChooseRole) {
      onChooseRole(role, demoMode);
    } else if (demoMode) {
      // Handle demo login locally if needed
      console.log(`Demo login for ${role}`);
    } else {
      navigate(role === "creator" ? "/creator/welcome" : "/clipper/welcome");
    }
  };

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigate("/signup");
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate("/login");
    }
  };

  const handleViewCaseStudies = () => {
    if (onViewCaseStudies) {
      onViewCaseStudies();
    } else {
      navigate("/case-studies");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Bar */}
      <nav className="bg-nav-yellow border-b-2 border-foreground sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-retro-display text-xl">CLIPLAB</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogin}
                className="btn-secondary-cyan px-4 py-2 rounded-lg text-sm"
              >
                LOGIN
              </button>
              <button
                onClick={handleGetStarted}
                className="btn-primary px-4 py-2 rounded-lg text-sm"
              >
                GET STARTED
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black text-retro-display leading-none">
              GET PAID FOR
              <br />
              <span className="text-primary">CLIPPING</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              The marketplace where brands set bounties on content and clippers earn money creating viral shorts
            </p>
          </div>

          {/* Role Selection */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="window-card p-8 max-w-sm w-full">
              <h3 className="text-2xl text-retro-display mb-4">I'M A BRAND</h3>
              <p className="text-muted-foreground mb-6">
                Set bounties on your content and get viral clips created by talented clippers
              </p>
              <button
                onClick={() => handleChooseRole("creator", true)}
                className="btn-primary w-full py-3 rounded-lg"
              >
                START CAMPAIGN
              </button>
            </div>

            <div className="window-card p-8 max-w-sm w-full">
              <h3 className="text-2xl text-retro-display mb-4">I'M A CLIPPER</h3>
              <p className="text-muted-foreground mb-6">
                Find bounties, create amazing clips, and earn money from your editing skills
              </p>
              <button
                onClick={() => handleChooseRole("clipper", true)}
                className="btn-secondary-pink w-full py-3 rounded-lg"
              >
                START CLIPPING
              </button>
            </div>
          </div>

          {/* Case Studies Link */}
          <div className="pt-8">
            <button
              onClick={handleViewCaseStudies}
              className="text-primary hover:text-primary-alt underline text-lg"
            >
              View Success Stories →
            </button>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 grid-bg opacity-50" />
      </div>
    </div>
  );
}
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NavigationProvider } from "./providers/NavigationProvider";
import { AuthCallback } from "./pages/AuthCallback";
import AppWithNavigation from "./AppWithNavigation";

// Import page components directly
import { UnifiedLandingPage } from "./components/UnifiedLandingPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";

// Lazy load components for better performance
const CreatorLandingPage = React.lazy(() => 
  import("./components/CreatorLandingPage").then(m => ({ default: m.CreatorLandingPage }))
);

const ClipperLandingPage = React.lazy(() => 
  import("./components/ClipperLandingPage").then(m => ({ default: m.ClipperLandingPage }))
);

const CaseStudiesPage = React.lazy(() => 
  import("./components/CaseStudiesPage").then(m => ({ default: m.CaseStudiesPage }))
);

const CreatorWelcomeScreen = React.lazy(() => 
  import("./components/CreatorWelcomeScreen").then(m => ({ default: m.CreatorWelcomeScreen }))
);

const CreatorSignupFlow = React.lazy(() => 
  import("./components/CreatorSignupFlow").then(m => ({ default: m.CreatorSignupFlow }))
);

const CreatorDashboard = React.lazy(() => 
  import("./components/CreatorDashboard").then(m => ({ default: m.CreatorDashboard }))
);

const CreatorBountyWizard = React.lazy(() => 
  import("./components/CreatorBountyWizard").then(m => ({ default: m.CreatorBountyWizard }))
);

const CreatorSuccessScreen = React.lazy(() => 
  import("./components/CreatorSuccessScreen").then(m => ({ default: m.CreatorSuccessScreen }))
);

const ClipperWelcomeScreenNew = React.lazy(() => 
  import("./components/ClipperWelcomeScreenNew").then(m => ({ default: m.ClipperWelcomeScreenNew }))
);

const ClipperSignupFlow = React.lazy(() => 
  import("./components/ClipperSignupFlow").then(m => ({ default: m.ClipperSignupFlow }))
);

const ClipperCampaignFeed = React.lazy(() => 
  import("./components/ClipperCampaignFeed").then(m => ({ default: m.ClipperCampaignFeed }))
);

const ClipperSubmissionScreen = React.lazy(() => 
  import("./components/ClipperSubmissionScreen").then(m => ({ default: m.ClipperSubmissionScreen }))
);

const ClipperConfirmationScreen = React.lazy(() => 
  import("./components/ClipperConfirmationScreen").then(m => ({ default: m.ClipperConfirmationScreen }))
);

const ClipperEarnings = React.lazy(() => 
  import("./components/ClipperEarnings").then(m => ({ default: m.ClipperEarnings }))
);

const ClipperLeaderboards = React.lazy(() => 
  import("./components/ClipperLeaderboards").then(m => ({ default: m.ClipperLeaderboards }))
);

const ClipperAnalytics = React.lazy(() => 
  import("./components/ClipperAnalytics").then(m => ({ default: m.ClipperAnalytics }))
);

const CampaignSetupPage = React.lazy(() => 
  import("./components/CampaignSetupPage").then(m => ({ default: m.CampaignSetupPage }))
);

const CampaignConfigurationPage = React.lazy(() => 
  import("./components/CampaignConfigurationPage").then(m => ({ default: m.CampaignConfigurationPage }))
);

const CampaignEscrowPage = React.lazy(() => 
  import("./components/CampaignEscrowPage").then(m => ({ default: m.CampaignEscrowPage }))
);

const PaymentSetupPage = React.lazy(() => 
  import("./components/PaymentSetupPage").then(m => ({ default: m.PaymentSetupPage }))
);

const CampaignConstructor = React.lazy(() => 
  import("./components/CampaignConstructor").then(m => ({ default: m.CampaignConstructor }))
);

const CampaignTracking = React.lazy(() => 
  import("./components/CampaignTracking").then(m => ({ default: m.CampaignTracking }))
);

const AdminPanel = React.lazy(() => 
  import("./components/AdminPanel").then(m => ({ default: m.AdminPanel }))
);

// Enhanced Suspense wrapper with loading fallback
const SuspenseWithLoading = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="window-card p-8">
            <h2 className="text-xl mb-4">Loading...</h2>
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      {children}
    </React.Suspense>
  );
};

// Main Router component with simplified structure
export function Router() {
  console.log('🚀 Router component rendering');
  
  return (
    <BrowserRouter>
      <NavigationProvider>
        <Routes>
          {/* Special auth callback route - separate from main app */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* TEMP: Direct render to test if UnifiedLandingPage works */}
          <Route 
            path="/" 
            element={<UnifiedLandingPage />}
          />
          <Route 
            path="/login" 
            element={
              <AppWithNavigation>
                <LoginPage />
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <AppWithNavigation>
                <SignupPage />
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/case-studies" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <CaseStudiesPage />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          
          {/* Role-specific landing pages */}
          <Route 
            path="/creator" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <CreatorLandingPage />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/clipper" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <ClipperLandingPage />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          
          {/* Creator onboarding */}
          <Route 
            path="/creator/welcome" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <CreatorWelcomeScreen />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/creator/signup" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <CreatorSignupFlow />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          
          {/* Creator dashboard and tools */}
          <Route 
            path="/creator/dashboard" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <CreatorDashboard />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/creator/bounty-wizard" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <CreatorBountyWizard />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/creator/success" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <CreatorSuccessScreen />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          
          {/* Clipper onboarding */}
          <Route 
            path="/clipper/welcome" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <ClipperWelcomeScreenNew />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/clipper/signup" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <ClipperSignupFlow />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          
          {/* Clipper dashboard and tools */}
          <Route 
            path="/clipper/campaigns" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <ClipperCampaignFeed />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/clipper/submission" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <ClipperSubmissionScreen />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/clipper/confirmation" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <ClipperConfirmationScreen />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/clipper/earnings" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <ClipperEarnings />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/clipper/leaderboards" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <ClipperLeaderboards />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/clipper/analytics" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <ClipperAnalytics />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          
          {/* Campaign flow pages */}
          <Route 
            path="/campaign/setup" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <CampaignSetupPage />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/campaign/configuration" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <CampaignConfigurationPage />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/campaign/escrow" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <CampaignEscrowPage />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/campaign/constructor" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <CampaignConstructor />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/campaign/tracking" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <CampaignTracking />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          <Route 
            path="/payment/setup" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <PaymentSetupPage />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          
          {/* Admin */}
          <Route 
            path="/admin" 
            element={
              <AppWithNavigation>
                <SuspenseWithLoading>
                  <AdminPanel />
                </SuspenseWithLoading>
              </AppWithNavigation>
            } 
          />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NavigationProvider>
    </BrowserRouter>
  );
}
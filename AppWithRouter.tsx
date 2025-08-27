"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import type { User, Bounty } from "./types";
import { useAppData } from "./hooks/useAppData";
import { useAuth } from "./services/auth";
import { Loading } from "./components/Loading";
import { Error } from "./components/Error";
import { isDev } from "./utils/env";
import { AuthCallback } from "./pages/AuthCallback";
import {
  createMockUser,
  createMockCampaignFromClip,
  getLoginRedirectPage,
  handleShare,
} from "./utils/appHandlers";

// Import page components
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

const CreatorWalkthrough = React.lazy(() => 
  import("./components/CreatorWalkthrough").then(m => ({ default: m.CreatorWalkthrough }))
);

const ClipperWalkthrough = React.lazy(() => 
  import("./components/ClipperWalkthrough").then(m => ({ default: m.ClipperWalkthrough }))
);

interface AppState {
  selectedCampaignMode: "reach" | null;
  selectedCampaign: Bounty | null;
  selectedSubmissionId: string | null;
  createdBountyData: any;
  campaignDataForEscrow: any;
  hasPaymentMethod: boolean;
  clipperFeedPage: "bounties" | "submissions" | "leaderboards" | "earnings";
  showWalkthrough: boolean;
  showCreatorWalkthrough: boolean;
  isLoggingOut: boolean;
  hasError: boolean;
  loadingTimeout: boolean;
  isInCampaignFlow: boolean;
}

// Enhanced Loading component with timeout
const LoadingWithTimeout = ({ timeout = 10000, onTimeout }: { timeout?: number; onTimeout: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      console.warn('⚠️ Loading timeout reached, redirecting to home');
      onTimeout();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onTimeout]);

  return <Loading />;
};

// Enhanced Suspense wrapper with timeout fallback
const SuspenseWithTimeout = ({ children, onTimeout }: { children: React.ReactNode; onTimeout: () => void }) => {
  return (
    <React.Suspense fallback={<LoadingWithTimeout onTimeout={onTimeout} />}>
      {children}
    </React.Suspense>
  );
};

export default function AppWithRouter() {
  console.log('🎯 AppWithRouter component rendering');
  
  // Router hooks are now safe to use since we're properly within BrowserRouter context
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const appData = useAppData();

  console.log('✅ Router hooks initialized successfully:', { 
    pathname: location.pathname,
    navigateType: typeof navigate 
  });

  // Consolidated state
  const [state, setState] = useState<AppState>({
    selectedCampaignMode: null,
    selectedCampaign: null,
    selectedSubmissionId: null,
    createdBountyData: null,
    campaignDataForEscrow: null,
    hasPaymentMethod: false,
    clipperFeedPage: "bounties",
    showWalkthrough: false,
    showCreatorWalkthrough: false,
    isLoggingOut: false,
    hasError: false,
    loadingTimeout: false,
    isInCampaignFlow: location.pathname.startsWith("/campaign") || location.pathname.startsWith("/payment"),
  });

  // Force light mode
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  // Update campaign flow state when URL changes
  useEffect(() => {
    const isInCampaignFlow = location.pathname.startsWith("/campaign") || location.pathname.startsWith("/payment");
    setState(prev => ({ ...prev, isInCampaignFlow }));
  }, [location.pathname]);

  // Convert AuthUser to User type for backward compatibility
  const currentUser: User | null = useMemo(() => 
    auth.user ? {
      id: auth.user.id,
      email: auth.user.email,
      username: auth.user.username,
      role: auth.user.role,
      channelLink: auth.user.channelLink,
      avatar: auth.user.avatar,
      isVerified: auth.user.isVerified || false,
      createdAt: auth.user.createdAt
    } : null
  , [auth.user]);

  // Emergency go home function
  const goHome = useCallback(() => {
    console.log('🏠 Emergency go home triggered');
    setState(prev => ({
      ...prev,
      selectedCampaignMode: null,
      selectedCampaign: null,
      selectedSubmissionId: null,
      createdBountyData: null,
      campaignDataForEscrow: null,
      hasPaymentMethod: false,
      clipperFeedPage: "bounties",
      showWalkthrough: false,
      showCreatorWalkthrough: false,
      isLoggingOut: false,
      hasError: false,
      loadingTimeout: false,
      isInCampaignFlow: false,
    }));
    navigate("/", { replace: true });
  }, [navigate]);

  // Handle loading timeouts - redirect to home
  const handleLoadingTimeout = useCallback(() => {
    console.warn('⏰ Loading timeout detected, forcing redirect to home');
    setState(prev => ({
      ...prev,
      loadingTimeout: true,
      hasError: true
    }));
    // Give a moment for state to update, then redirect
    setTimeout(goHome, 1000);
  }, [goHome]);

  // Auto-redirect authenticated users away from auth pages (but not during logout or campaign flow)
  useEffect(() => {
    if (currentUser && auth.isInitialized && !auth.isLoading && !state.isLoggingOut && !state.hasError && !state.isInCampaignFlow) {
      // Only redirect from home page, not from all auth pages
      const redirectOnlyFromPages = ['/'];
      
      if (redirectOnlyFromPages.includes(location.pathname)) {
        console.log('🔄 Auto-redirecting authenticated user from:', location.pathname);
        const redirectPage = getLoginRedirectPage(currentUser, state.selectedCampaignMode);
        console.log('➡️ Auto-redirect to:', redirectPage);
        
        // Map internal page names to URLs
        const pageToUrl: Record<string, string> = {
          'creator-dashboard': '/creator/dashboard',
          'clipper-campaigns': '/clipper/campaigns',
          'admin': '/admin'
        };
        
        const redirectUrl = pageToUrl[redirectPage] || '/creator/dashboard';
        navigate(redirectUrl, { replace: true });
        
        setState(prev => ({
          ...prev,
          showCreatorWalkthrough: currentUser.role === "creator" && redirectPage === "creator-dashboard",
          showWalkthrough: currentUser.role === "clipper" && redirectPage === "clipper-campaigns",
          hasError: false,
          loadingTimeout: false
        }));
      }
    }
  }, [currentUser, auth.isInitialized, auth.isLoading, location.pathname, state.selectedCampaignMode, state.isLoggingOut, state.hasError, state.isInCampaignFlow, navigate]);

  // Clear logout state when user is actually cleared
  useEffect(() => {
    if (!currentUser && state.isLoggingOut) {
      console.log('✅ Logout completed, clearing logout state');
      setState(prev => ({
        ...prev,
        isLoggingOut: false,
        hasError: false,
        loadingTimeout: false,
        isInCampaignFlow: false,
      }));
      navigate("/", { replace: true });
    }
  }, [currentUser, state.isLoggingOut, navigate]);

  // Debug logging
  useEffect(() => {
    if (isDev) {
      console.log('🐛 AppWithRouter Debug - Current state:', {
        currentPath: location.pathname,
        isLoggingOut: state.isLoggingOut,
        hasError: state.hasError,
        loadingTimeout: state.loadingTimeout,
        isInCampaignFlow: state.isInCampaignFlow,
        selectedCampaignMode: state.selectedCampaignMode,
        currentUser: currentUser ? {
          id: currentUser.id,
          email: currentUser.email,
          role: currentUser.role,
          username: currentUser.username
        } : null,
        authState: {
          isInitialized: auth.isInitialized,
          isLoading: auth.isLoading,
          error: auth.error
        }
      });
    }
  }, [location.pathname, state.isLoggingOut, state.hasError, state.loadingTimeout, state.isInCampaignFlow, state.selectedCampaignMode, currentUser, auth.isInitialized, auth.isLoading, auth.error]);

  // Core handlers
  const handleLogin = useCallback(async (email: string, password: string) => {
    console.log('🔐 handleLogin called');
    const result = await auth.login(email, password);
    
    if (result.success) {
      console.log('✅ Login successful, will auto-redirect via useEffect');
      setState(prev => ({ ...prev, hasError: false, loadingTimeout: false }));
    } else {
      console.log('❌ Login failed:', result.error);
    }
  }, [auth]);

  const handleSignup = useCallback(async (
    email: string,
    password: string,
    username: string,
    role: "creator" | "clipper",
    channelLink?: string,
  ) => {
    const result = await auth.register({
      email,
      password,
      username,
      role,
      channelLink
    });

    if (result.success) {
      console.log('✅ Signup successful, will auto-redirect via useEffect');
      setState(prev => ({ ...prev, hasError: false, loadingTimeout: false }));
    }
  }, [auth]);

  const handleDemoLogin = useCallback(async (role: "creator" | "clipper") => {
    console.log('🎭 Demo login for role:', role);
    
    const mockUser = createMockUser(`demo-${role}@cliplab.com`, role);
    console.log('👤 Created mock user:', mockUser);
    
    const result = await auth.demoLogin(mockUser);
    
    if (result.success) {
      console.log('✅ Demo login successful, will auto-redirect via useEffect');
      setState(prev => ({ ...prev, hasError: false, loadingTimeout: false }));
    } else {
      console.error('❌ Demo login failed:', result.error);
    }
  }, [auth]);

  const handleLogout = useCallback(async () => {
    console.log('🚪 Starting logout process');
    
    try {
      setState(prev => ({
        ...prev,
        isLoggingOut: true,
        hasError: false,
        loadingTimeout: false,
        isInCampaignFlow: false,
      }));

      await auth.logout();
      
      console.log('✅ Auth logout completed, resetting to landing page');
      
      setState(prev => ({
        ...prev,
        selectedCampaignMode: null,
        selectedCampaign: null,
        selectedSubmissionId: null,
        createdBountyData: null,
        campaignDataForEscrow: null,
        hasPaymentMethod: false,
        clipperFeedPage: "bounties",
        showWalkthrough: false,
        showCreatorWalkthrough: false,
        isLoggingOut: true, // Keep true until user is cleared
        hasError: false,
        loadingTimeout: false,
        isInCampaignFlow: false,
      }));
      
      console.log('✅ Logout state reset completed');
    } catch (error) {
      console.error('❌ Logout error:', error);
      goHome();
    }
  }, [auth, goHome]);

  // Helper function to create a simple bounty
  const createSimpleBounty = useCallback((campaignMode: string, currentUser: User) => {
    const bountyId = Date.now().toString();
    const newBounty = {
      id: bountyId,
      creatorId: currentUser.id,
      title: `${campaignMode.charAt(0).toUpperCase() + campaignMode.slice(1)} Campaign`,
      description: `Campaign created for ${campaignMode} amplification`,
      amount: 500,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      hashtags: ['Campaign', campaignMode.charAt(0).toUpperCase() + campaignMode.slice(1)],
      status: 'active' as const,
      difficulty: 'Medium' as any,
      featured: false,
      campaignMode: 'reach' as const,
      createdAt: new Date(),
      submissions: []
    };
    
    appData.addBounty(newBounty);
    return newBounty;
  }, [appData]);

  // Navigation handlers using React Router
  const navigation = useMemo(() => ({
    // Role selection - now supports demo mode
    chooseRole: (role: "creator" | "clipper", demoMode = false) => {
      if (demoMode) {
        console.log('🎭 Demo mode role selection:', role);
        handleDemoLogin(role);
      } else {
        const targetUrl = role === "creator" ? "/creator/welcome" : "/clipper/welcome";
        setState(prev => ({ 
          ...prev, 
          hasError: false,
          loadingTimeout: false,
          isInCampaignFlow: false,
        }));
        navigate(targetUrl);
      }
    },

    // Campaign flow handlers
    startCampaign: (mode: "reach") => {
      console.log('🚀 Starting campaign with mode:', mode);
      setState(prev => ({ 
        ...prev, 
        selectedCampaignMode: mode, 
        hasError: false,
        loadingTimeout: false,
        isInCampaignFlow: true,
      }));
      navigate("/campaign/setup");
    },

    viewCampaign: (campaign: Bounty) => {
      setState(prev => ({ 
        ...prev, 
        selectedCampaign: campaign, 
        hasError: false,
        loadingTimeout: false,
        isInCampaignFlow: true,
      }));
      navigate("/campaign/tracking");
    },

    viewFeaturedCampaign: (clip: any) => {
      try {
        const mockCampaign = createMockCampaignFromClip(clip);
        setState(prev => ({ 
          ...prev, 
          selectedCampaign: mockCampaign, 
          hasError: false,
          loadingTimeout: false,
          isInCampaignFlow: true,
        }));
        navigate("/campaign/tracking");
      } catch (error) {
        console.error('❌ Error creating mock campaign:', error);
        goHome();
      }
    },

    // Campaign creation flow
    continueCampaignFlow: (step: string, data?: any) => {
      console.log(`🔄 Campaign flow step: ${step} with data:`, data);
      
      try {
        const flowMap: Record<string, { url: string; updates?: Partial<AppState> }> = {
          'setup-continue': { 
            url: "/payment/setup",
            updates: { 
              selectedCampaignMode: data, 
              isInCampaignFlow: true
            }
          },
          'config-continue': { 
            url: "/campaign/escrow",
            updates: { 
              campaignDataForEscrow: data, 
              isInCampaignFlow: true
            }
          },
          'escrow-payment': { 
            url: "/payment/setup",
            updates: { 
              isInCampaignFlow: true
            }
          },
          'payment-complete': { 
            url: currentUser?.role === "creator" ? "/creator/dashboard" : "/",
            updates: { 
              hasPaymentMethod: true, 
              selectedCampaignMode: null,
              isInCampaignFlow: false,
              ...(data && currentUser ? {
                createdBountyData: createSimpleBounty(data, currentUser)
              } : {})
            }
          },
          'escrow-complete': {
            url: currentUser?.role === "creator" ? "/creator/dashboard" : "/",
            updates: {
              selectedCampaignMode: null,
              campaignDataForEscrow: null,
              isInCampaignFlow: false,
              ...(data && currentUser ? {
                createdBountyData: createSimpleBounty(data.mode || 'reach', currentUser)
              } : {})
            }
          }
        };
        
        const flow = flowMap[step];
        if (flow) {
          console.log(`✅ Campaign flow found - navigating to: ${flow.url}`);
          setState(prev => ({ 
            ...prev, 
            hasError: false, 
            loadingTimeout: false,
            ...flow.updates 
          }));
          navigate(flow.url);
        } else {
          console.error('❌ Unknown campaign flow step:', step);
          setState(prev => ({
            ...prev,
            hasError: true,
            loadingTimeout: false
          }));
        }
      } catch (error) {
        console.error('❌ Error in campaign flow:', error);
        setState(prev => ({
          ...prev,
          hasError: true,
          loadingTimeout: false
        }));
      }
    },

    // Submission handling
    handleSubmission: (submission: any, navigateToSubmissions = false) => {
      try {
        const submissionId = appData.addSubmission(submission);
        
        if (navigateToSubmissions) {
          setState(prev => ({
            ...prev,
            clipperFeedPage: "submissions",
            selectedCampaign: null,
            hasError: false,
            loadingTimeout: false,
            isInCampaignFlow: false,
          }));
          navigate("/clipper/campaigns");
        } else {
          setState(prev => ({
            ...prev,
            selectedSubmissionId: submissionId,
            hasError: false,
            loadingTimeout: false,
            isInCampaignFlow: false,
          }));
          navigate("/clipper/confirmation");
        }
      } catch (error) {
        console.error('❌ Error handling submission:', error);
        goHome();
      }
    },

    // Walkthrough controls
    toggleWalkthrough: (type: 'clipper' | 'creator', show: boolean) =>
      setState(prev => ({
        ...prev,
        [type === 'clipper' ? 'showWalkthrough' : 'showCreatorWalkthrough']: show
      })),

    // Bounty creation
    createBounty: (bountyData: any) => {
      try {
        const newBounty = appData.addBounty({
          ...bountyData,
          creatorId: currentUser!.id,
          status: "active" as const,
          campaignMode: "reach" as const,
        });
        setState(prev => ({
          ...prev,
          createdBountyData: { ...bountyData, id: newBounty.id },
          hasError: false,
          loadingTimeout: false,
          isInCampaignFlow: false,
        }));
        navigate("/creator/success");
      } catch (error) {
        console.error('❌ Error creating bounty:', error);
        goHome();
      }
    },

    // Back navigation
    goBack: () => {
      window.history.back();
    }
  }), [currentUser, appData, handleDemoLogin, goHome, createSimpleBounty, navigate]);

  // Show loading while auth is initializing OR during logout
  if (!auth.isInitialized || auth.isLoading || state.isLoggingOut) {
    return <LoadingWithTimeout onTimeout={handleLoadingTimeout} />;
  }

  // Show error if there's a persistent auth error
  if (auth.error && auth.isInitialized) {
    return (
      <Error 
        message={auth.error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Show timeout/error fallback
  if (state.hasError || state.loadingTimeout) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8 flex items-center justify-center">
        <div className="window-card p-8 max-w-md w-full text-center">
          <h1 className="text-2xl mb-4">Something went wrong</h1>
          <p className="mb-6 text-muted-foreground">
            {state.loadingTimeout ? 
              "The page took too long to load." : 
              "There was an error in the navigation flow."
            }
          </p>
          <div className="space-y-2 mb-6">
            <button 
              onClick={() => setState(prev => ({ ...prev, hasError: false, loadingTimeout: false }))}
              className="btn-primary px-6 py-3 rounded-lg w-full"
            >
              Try Again
            </button>
            <button 
              onClick={goHome}
              className="btn-secondary-cyan px-6 py-3 rounded-lg w-full"
            >
              Go Home
            </button>
            {currentUser && (
              <button 
                onClick={() => {
                  const dashboardUrl = currentUser.role === "creator" ? "/creator/dashboard" : "/clipper/campaigns";
                  setState(prev => ({ 
                    ...prev, 
                    hasError: false,
                    loadingTimeout: false,
                    isInCampaignFlow: false
                  }));
                  navigate(dashboardUrl);
                }}
                className="btn-secondary-pink px-6 py-3 rounded-lg w-full"
              >
                Go to Dashboard
              </button>
            )}
          </div>
          {isDev && (
            <div className="text-xs text-muted-foreground bg-muted p-4 rounded">
              <strong>Debug Info:</strong><br/>
              Path: {location.pathname}<br/>
              Campaign Flow: {state.isInCampaignFlow ? 'Yes' : 'No'}<br/>
              Campaign Mode: {state.selectedCampaignMode || 'None'}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Debug panel for development
  const debugPanel = isDev && (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      background: '#7FFF00',
      color: '#1A1A1F',
      padding: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div>Path: {location.pathname}</div>
      <div>Role: {currentUser?.role}</div>
      <div>User: {currentUser?.username}</div>
      <div>Campaign Mode: {state.selectedCampaignMode || 'None'}</div>
      <div style={{ color: state.isInCampaignFlow ? '#FF3B30' : '#00FF9C' }}>
        Campaign Flow: {state.isInCampaignFlow ? 'ACTIVE' : 'INACTIVE'}
      </div>
      <div>Logging out: {state.isLoggingOut ? 'Yes' : 'No'}</div>
      <div>Has error: {state.hasError ? 'Yes' : 'No'}</div>
      <button 
        onClick={goHome}
        style={{ 
          background: '#FF3B30', 
          color: 'white', 
          border: 'none', 
          padding: '4px 8px', 
          fontSize: '10px',
          marginTop: '4px',
          cursor: 'pointer'
        }}
      >
        Emergency Home
      </button>
    </div>
  );

  // Create common props that many components need
  const commonProps = {
    // Auth handlers
    onLogin: handleLogin,
    onSignup: handleSignup,
    onLogout: handleLogout,
    onChooseRole: navigation.chooseRole,
    
    // Navigation handlers
    onGetStarted: () => navigate("/signup"),
    onBack: navigation.goBack,
    onViewCaseStudies: () => navigate("/case-studies"),
    onStartCampaign: navigation.startCampaign,
    onViewCampaign: navigation.viewCampaign,
    onViewFeaturedCampaign: navigation.viewFeaturedCampaign,
    onContinue: navigation.continueCampaignFlow,
    onCreateBounty: () => navigate("/campaign/setup"),
    onComplete: navigation.createBounty,
    onSubmit: navigation.handleSubmission,
    onSelectCampaign: (campaign: Bounty) => {
      setState(prev => ({ ...prev, selectedCampaign: campaign }));
      navigate("/clipper/submission");
    },
    onSubmissionComplete: navigation.handleSubmission,
    onTrackRank: () => navigate("/clipper/campaigns"),
    onSubmitAnother: () => {
      setState(prev => ({ 
        ...prev, 
        selectedCampaign: null, 
        selectedSubmissionId: null 
      }));
      navigate("/clipper/campaigns");
    },
    onViewSubmissions: () => navigate("/creator/dashboard"),
    onCreateAnother: () => {
      setState(prev => ({ ...prev, createdBountyData: null }));
      navigate("/creator/bounty-wizard");
    },
    onShare: (platform: "copy" | "twitter") => handleShare(platform, state.createdBountyData),
    onClearCreatedBounty: () => setState(prev => ({ ...prev, createdBountyData: null })),
    onSwitchToClipper: () => navigate("/clipper/welcome"),
    onSwitchToCreator: () => navigate("/creator/welcome"),
    
    // Data props
    user: currentUser,
    bounties: appData.bounties.filter(b => currentUser ? b.creatorId === currentUser.id : true),
    campaigns: appData.bounties,
    featuredClips: appData.featuredClips,
    topCreators: appData.topCreators,
    liveBounties: appData.bounties.slice(0, 6),
    submissions: appData.submissions || [],
    
    // State props
    selectedCampaign: state.selectedCampaign,
    selectedCampaignMode: state.selectedCampaignMode,
    selectedCampaignType: "reach" as const,
    campaignData: state.campaignDataForEscrow,
    hasPaymentMethod: state.hasPaymentMethod,
    bountyData: state.createdBountyData,
    createdBountyData: state.createdBountyData,
    submissionId: state.selectedSubmissionId,
    initialPage: state.clipperFeedPage,
    
    // App data methods
    onUpdateSubmissionStatus: appData.updateSubmissionStatus,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {debugPanel}
      <Routes>
        {/* Special auth callback route */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Main app routes */}
        <Route path="/" element={<UnifiedLandingPage {...commonProps} />} />
        <Route path="/login" element={<LoginPage {...commonProps} />} />
        <Route path="/signup" element={<SignupPage {...commonProps} />} />
        <Route 
          path="/case-studies" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <CaseStudiesPage {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/creator" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <CreatorLandingPage {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/clipper" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <ClipperLandingPage {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/creator/welcome" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <CreatorWelcomeScreen {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/creator/signup" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <CreatorSignupFlow {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/creator/dashboard" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <CreatorDashboard {...commonProps} />
              {state.showCreatorWalkthrough && (
                <CreatorWalkthrough
                  onComplete={() => navigation.toggleWalkthrough('creator', false)}
                  onSkip={() => navigation.toggleWalkthrough('creator', false)}
                />
              )}
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/creator/bounty-wizard" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <CreatorBountyWizard {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/creator/success" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <CreatorSuccessScreen {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/clipper/welcome" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <ClipperWelcomeScreenNew {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/clipper/signup" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <ClipperSignupFlow {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/clipper/campaigns" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <ClipperCampaignFeed {...commonProps} />
              {state.showWalkthrough && (
                <ClipperWalkthrough
                  onComplete={() => navigation.toggleWalkthrough('clipper', false)}
                  onSkip={() => navigation.toggleWalkthrough('clipper', false)}
                />
              )}
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/clipper/submission" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <ClipperSubmissionScreen {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/clipper/confirmation" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <ClipperConfirmationScreen {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/clipper/earnings" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <ClipperEarnings {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/clipper/leaderboards" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <ClipperLeaderboards {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/clipper/analytics" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <ClipperAnalytics {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/campaign/setup" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <CampaignSetupPage {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/campaign/configuration" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <CampaignConfigurationPage {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/campaign/escrow" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <CampaignEscrowPage {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/campaign/constructor" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <CampaignConstructor {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/campaign/tracking" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <CampaignTracking {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/payment/setup" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <PaymentSetupPage {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <SuspenseWithTimeout onTimeout={handleLoadingTimeout}>
              <AdminPanel {...commonProps} />
            </SuspenseWithTimeout>
          } 
        />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
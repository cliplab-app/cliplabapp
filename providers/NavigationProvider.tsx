"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { User, Bounty } from "../types";
import { useAppData } from "../hooks/useAppData";
import { useAuth } from "../services/auth";
import { isDev } from "../utils/env";
import {
  createMockUser,
  createMockCampaignFromClip,
  getLoginRedirectPage,
  handleShare,
} from "../utils/appHandlers";

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

interface NavigationContextType {
  // State
  state: AppState;
  currentUser: User | null;
  auth: any;
  appData: any;
  location: any;
  
  // Navigation functions
  navigation: {
    chooseRole: (role: "creator" | "clipper", demoMode?: boolean) => void;
    startCampaign: (mode: "reach") => void;
    viewCampaign: (campaign: Bounty) => void;
    viewFeaturedCampaign: (clip: any) => void;
    continueCampaignFlow: (step: string, data?: any) => void;
    handleSubmission: (submission: any, navigateToSubmissions?: boolean) => void;
    toggleWalkthrough: (type: 'clipper' | 'creator', show: boolean) => void;
    createBounty: (bountyData: any) => void;
    goBack: () => void;
  };
  
  // Handlers
  handleLogin: (email: string, password: string) => Promise<void>;
  handleSignup: (email: string, password: string, username: string, role: "creator" | "clipper", channelLink?: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  goHome: () => void;
  handleLoadingTimeout: () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    console.error('useNavigation called outside of NavigationProvider. Current component tree might not be properly wrapped.');
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

interface NavigationProviderProps {
  children: React.ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  console.log('🎯 NavigationProvider rendering', {
    hasChildren: !!children,
    childrenType: typeof children,
    isValidElement: React.isValidElement(children),
    childrenCount: React.Children.count(children)
  });
  
  // Router hooks are safe to use here since NavigationProvider is rendered within BrowserRouter context
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();  
  const appData = useAppData();
  
  // Add initialization state to ensure context is ready before consuming components use it
  const [isInitialized, setIsInitialized] = useState(false);

  console.log('✅ Router hooks initialized successfully in NavigationProvider:', { 
    pathname: location.pathname,
    navigateType: typeof navigate,
    hasAuth: !!auth,
    hasAppData: !!appData
  });
  
  // Mark as initialized after router hooks are established
  useEffect(() => {
    if (navigate && location && auth && appData) {
      console.log('🚀 NavigationProvider fully initialized - providing context');
      setIsInitialized(true);
    }
  }, [navigate, location, auth, appData]);

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
      console.log('🐛 NavigationProvider Debug - Current state:', {
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

  // Create context value
  const contextValue: NavigationContextType = {
    state,
    currentUser,
    auth,
    appData,
    location,
    navigation,
    handleLogin,
    handleSignup,
    handleLogout,
    goHome,
    handleLoadingTimeout,
  };

  // Show loading while NavigationProvider initializes - BUT STILL PASS CHILDREN
  if (!isInitialized) {
    console.log('⏳ NavigationProvider initializing, but still providing basic context...');
    
    // Create a minimal context for initialization period - make sure all fields are properly populated
    const initContextValue: NavigationContextType = {
      state: {
        selectedCampaignMode: null,
        selectedCampaign: null,
        selectedSubmissionId: null,
        createdBountyData: null,
        campaignDataForEscrow: null,
        hasPaymentMethod: false,
        clipperFeedPage: "bounties" as const,
        showWalkthrough: false,
        showCreatorWalkthrough: false,
        isLoggingOut: false,
        hasError: false,
        loadingTimeout: false,
        isInCampaignFlow: false,
      },
      currentUser: null,
      auth: auth || { 
        isInitialized: false, 
        isLoading: true,
        user: null,
        error: null
      },
      appData: appData || { 
        bounties: [], 
        featuredClips: [], 
        topCreators: [], 
        submissions: [],
        addBounty: () => {},
        addSubmission: () => {},
        updateSubmissionStatus: () => {}
      },
      location: location || { pathname: '/' },
      navigation: {
        chooseRole: () => console.log('Navigation not ready yet'),
        startCampaign: () => console.log('Navigation not ready yet'),
        viewCampaign: () => console.log('Navigation not ready yet'),
        viewFeaturedCampaign: () => console.log('Navigation not ready yet'),
        continueCampaignFlow: () => console.log('Navigation not ready yet'),
        handleSubmission: () => console.log('Navigation not ready yet'),
        toggleWalkthrough: () => console.log('Navigation not ready yet'),
        createBounty: () => console.log('Navigation not ready yet'),
        goBack: () => window.history.back(),
      },
      handleLogin: async () => { console.log('Login not ready yet') },
      handleSignup: async () => { console.log('Signup not ready yet') },
      handleLogout: async () => { console.log('Logout not ready yet') },
      goHome: () => {
        try {
          if (navigate) {
            navigate("/");
          } else {
            window.location.href = "/";
          }
        } catch (error) {
          window.location.href = "/";
        }
      },
      handleLoadingTimeout: () => console.log('Loading timeout handler not ready yet'),
    };
    
    console.log('⏳ NavigationProvider: Rendering with init context, children:', {
      hasChildren: !!children,
      childrenType: typeof children
    });
    
    return (
      <NavigationContext.Provider value={initContextValue}>
        {children}
      </NavigationContext.Provider>
    );
  }

  console.log('✅ NavigationProvider providing full context to children:', {
    hasState: !!contextValue.state,
    hasCurrentUser: !!contextValue.currentUser,
    hasNavigation: !!contextValue.navigation,
    pathname: contextValue.location?.pathname,
    hasChildren: !!children,
    childrenType: typeof children
  });
  
  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}
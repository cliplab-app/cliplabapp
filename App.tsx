"use client";

import React, { useEffect } from "react";
import { Loading } from "./components/Loading";
import { Error } from "./components/Error";
import { isDev } from "./utils/env";

// Lazy load walkthrough components
const CreatorWalkthrough = React.lazy(() => 
  import("./components/CreatorWalkthrough").then(m => ({ default: m.CreatorWalkthrough }))
);

const ClipperWalkthrough = React.lazy(() => 
  import("./components/ClipperWalkthrough").then(m => ({ default: m.ClipperWalkthrough }))
);

interface AppProps {
  children: React.ReactNode;
  // Navigation handlers
  onLogin?: (email: string, password: string) => Promise<void>;
  onSignup?: (email: string, password: string, username: string, role: "creator" | "clipper", channelLink?: string) => Promise<void>;
  onLogout?: () => Promise<void>;
  onChooseRole?: (role: "creator" | "clipper", demoMode?: boolean) => void;
  onGetStarted?: () => void;
  onBack?: () => void;
  onViewCaseStudies?: () => void;
  onStartCampaign?: (mode: "reach") => void;
  onViewCampaign?: (campaign: any) => void;
  onViewFeaturedCampaign?: (clip: any) => void;
  onContinue?: (step: string, data?: any) => void;
  onCreateBounty?: () => void;
  onComplete?: (bountyData: any) => void;
  onSubmit?: (submission: any, navigateToSubmissions?: boolean) => void;
  onSelectCampaign?: (campaign: any) => void;
  onSubmissionComplete?: (submission: any, navigateToSubmissions?: boolean) => void;
  onTrackRank?: () => void;
  onSubmitAnother?: () => void;
  onViewSubmissions?: () => void;
  onCreateAnother?: () => void;
  onShare?: (platform: "copy" | "twitter") => void;
  onClearCreatedBounty?: () => void;
  onSwitchToClipper?: () => void;
  onSwitchToCreator?: () => void;
  onUpdateSubmissionStatus?: (submissionId: string, status: string) => void;
  
  // Data props
  user?: any;
  bounties?: any[];
  campaigns?: any[];
  featuredClips?: any[];
  topCreators?: any[];
  liveBounties?: any[];
  submissions?: any[];
  
  // State props
  selectedCampaign?: any;
  selectedCampaignMode?: "reach" | null;
  selectedCampaignType?: "reach";
  campaignData?: any;
  hasPaymentMethod?: boolean;
  bountyData?: any;
  createdBountyData?: any;
  submissionId?: string | null;
  initialPage?: "bounties" | "submissions" | "leaderboards" | "earnings";
  
  // App state
  isLoading?: boolean;
  isLoggingOut?: boolean;
  hasError?: boolean;
  loadingTimeout?: boolean;
  showWalkthrough?: boolean;
  showCreatorWalkthrough?: boolean;
  currentPath?: string;
  isInCampaignFlow?: boolean;
  
  // Callbacks
  onLoadingTimeout?: () => void;
  goHome?: () => void;
}

// Enhanced Loading component with timeout
const LoadingWithTimeout = ({ timeout = 10000, onTimeout }: { timeout?: number; onTimeout?: () => void }) => {
  useEffect(() => {
    if (!onTimeout) return;
    
    const timer = setTimeout(() => {
      console.warn('⚠️ Loading timeout reached, redirecting to home');
      onTimeout();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onTimeout]);

  return <Loading />;
};

export default function App({ 
  children, 
  user,
  isLoading = false,
  isLoggingOut = false,
  hasError = false,
  loadingTimeout = false,
  showWalkthrough = false,
  showCreatorWalkthrough = false,
  currentPath = '/',
  isInCampaignFlow = false,
  selectedCampaignMode,
  onLoadingTimeout,
  goHome,
  onChooseRole,
  onLogin,
  onSignup,
  onLogout,
  onGetStarted,
  onBack,
  onViewCaseStudies,
  onStartCampaign,
  onViewCampaign,
  onViewFeaturedCampaign,
  onContinue,
  onCreateBounty,
  onComplete,
  onSubmit,
  onSelectCampaign,
  onSubmissionComplete,
  onTrackRank,
  onSubmitAnother,
  onViewSubmissions,
  onCreateAnother,
  onShare,
  onClearCreatedBounty,
  onSwitchToClipper,
  onSwitchToCreator,
  onUpdateSubmissionStatus,
  bounties = [],
  campaigns = [],
  featuredClips = [],
  topCreators = [],
  liveBounties = [],
  submissions = [],
  selectedCampaign,
  selectedCampaignType = "reach",
  campaignData,
  hasPaymentMethod = false,
  bountyData,
  createdBountyData,
  submissionId,
  initialPage = "bounties",
  ...restProps
}: AppProps) {
  console.log('🎯 App component rendering - validating children first');
  console.log('🔍 App component - children received:', {
    children,
    type: typeof children,
    isValidElement: React.isValidElement(children),
    truthiness: !!children
  });

  // Force light mode
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  // Show loading while auth is initializing OR during logout
  if (isLoading || isLoggingOut) {
    return <LoadingWithTimeout onTimeout={onLoadingTimeout} />;
  }

  // Show timeout/error fallback
  if (hasError || loadingTimeout) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8 flex items-center justify-center">
        <div className="window-card p-8 max-w-md w-full text-center">
          <h1 className="text-2xl mb-4">Something went wrong</h1>
          <p className="mb-6 text-muted-foreground">
            {loadingTimeout ? 
              "The page took too long to load." : 
              "There was an error in the navigation flow."
            }
          </p>
          <div className="space-y-2 mb-6">
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary px-6 py-3 rounded-lg w-full"
            >
              Try Again
            </button>
            {goHome && (
              <button 
                onClick={goHome}
                className="btn-secondary-cyan px-6 py-3 rounded-lg w-full"
              >
                Go Home
              </button>
            )}
            {user && (
              <button 
                onClick={() => {
                  const dashboardUrl = user.role === "creator" ? "/creator/dashboard" : "/clipper/campaigns";
                  window.location.href = dashboardUrl;
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
              Path: {currentPath}<br/>
              Campaign Flow: {isInCampaignFlow ? 'Yes' : 'No'}<br/>
              Campaign Mode: {selectedCampaignMode || 'None'}
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
      <div>Path: {currentPath}</div>
      <div>Role: {user?.role}</div>
      <div>User: {user?.username}</div>
      <div>Campaign Mode: {selectedCampaignMode || 'None'}</div>
      <div style={{ color: isInCampaignFlow ? '#FF3B30' : '#00FF9C' }}>
        Campaign Flow: {isInCampaignFlow ? 'ACTIVE' : 'INACTIVE'}
      </div>
      <div>Logging out: {isLoggingOut ? 'Yes' : 'No'}</div>
      <div>Has error: {hasError ? 'Yes' : 'No'}</div>
      <div style={{ color: '#0F28C6' }}>
        Context: ✅ Props
      </div>
      {goHome && (
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
      )}
    </div>
  );

  // Create enhanced children with proper validation and error handling
  console.log('🔍 App: Checking children prop:', { 
    hasChildren: !!children, 
    childrenType: typeof children,
    isValidElement: React.isValidElement(children),
    childrenCount: React.Children.count(children),
    childrenDisplayName: children && React.isValidElement(children) ? children.type?.displayName || children.type?.name || 'Unknown Component' : 'N/A',
    childrenStringified: children ? String(children).substring(0, 100) : 'null/undefined'
  });

  // Enhanced children handling with better validation
  let enhancedChildren;
  
  try {
    // More robust children validation
    console.log('🔍 App: Validating children:', {
      children,
      hasChildren: !!children,
      isNull: children === null,
      isUndefined: children === undefined,
      isFalse: children === false,
      isEmptyString: children === '',
      childrenType: typeof children,
      isValidElement: React.isValidElement(children),
      childrenStringified: String(children)
    });

    // Check if children is truly empty/invalid
    const hasValidChildren = children !== null && 
                             children !== undefined && 
                             children !== false && 
                             children !== '' &&
                             !(Array.isArray(children) && children.length === 0);

    if (!hasValidChildren) {
      console.warn('⚠️ App: No valid children prop provided');
      enhancedChildren = (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="window-card p-8 text-center">
            <h2 className="text-xl mb-4">No Content</h2>
            <p className="text-muted-foreground">No page component was provided to render.</p>
            <div className="mt-4 text-xs bg-muted p-2 rounded">
              Debug: children = {String(children)} (type: {typeof children})
            </div>
          </div>
        </div>
      );
    } else {
      console.log('✅ App: Children exist, creating enhanced version');
      
      // Create props object once
      const childProps = {
        // Auth handlers
        onLogin,
        onSignup,
        onLogout,
        onChooseRole,
        
        // Navigation handlers
        onGetStarted,
        onBack,
        onViewCaseStudies,
        onStartCampaign,
        onViewCampaign,
        onViewFeaturedCampaign,
        onContinue,
        onCreateBounty,
        onComplete,
        onSubmit,
        onSelectCampaign,
        onSubmissionComplete,
        onTrackRank,
        onSubmitAnother,
        onViewSubmissions,
        onCreateAnother,
        onShare,
        onClearCreatedBounty,
        onSwitchToClipper,
        onSwitchToCreator,
        
        // Data props
        user,
        bounties,
        campaigns,
        featuredClips,
        topCreators,
        liveBounties,
        submissions,
        
        // State props
        selectedCampaign,
        selectedCampaignMode,
        selectedCampaignType,
        campaignData,
        hasPaymentMethod,
        bountyData,
        createdBountyData,
        submissionId,
        initialPage,
        
        // App data methods
        onUpdateSubmissionStatus,
        
        // Pass any other props
        ...restProps
      };

      // Handle different children types
      if (React.isValidElement(children)) {
        // Single React element
        enhancedChildren = React.cloneElement(children, childProps);
      } else if (React.Children.count(children) > 1) {
        // Multiple children
        enhancedChildren = React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, childProps);
          }
          return child;
        });
      } else {
        // Just render children as-is if it's not a React element
        console.log('🔄 App: Children is not a React element, rendering as-is');
        enhancedChildren = children;
      }
    }
    
    console.log('✅ App: Successfully created enhanced children');
  } catch (error) {
    console.error('❌ App: Error creating enhanced children:', error);
    enhancedChildren = (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="window-card p-8 text-center">
          <h2 className="text-xl mb-4 text-destructive">Rendering Error</h2>
          <p className="text-muted-foreground mb-4">Failed to render the page component.</p>
          <div className="text-xs bg-muted p-4 rounded text-left">
            <strong>Error:</strong> {error?.message || 'Unknown error'}<br/>
            <strong>Children Type:</strong> {typeof children}<br/>
            <strong>Children Value:</strong> {String(children)}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary px-4 py-2 rounded-lg mt-4"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {debugPanel}
      {enhancedChildren}
      
      {/* Walkthrough overlays */}
      {showCreatorWalkthrough && onChooseRole && (
        <React.Suspense fallback={null}>
          <CreatorWalkthrough
            onComplete={() => console.log('Creator walkthrough completed')}
            onSkip={() => console.log('Creator walkthrough skipped')}
          />
        </React.Suspense>
      )}
      
      {showWalkthrough && onChooseRole && (
        <React.Suspense fallback={null}>
          <ClipperWalkthrough
            onComplete={() => console.log('Clipper walkthrough completed')}
            onSkip={() => console.log('Clipper walkthrough skipped')}
          />
        </React.Suspense>
      )}
    </div>
  );
}
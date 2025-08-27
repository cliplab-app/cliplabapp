"use client";

import React from "react";
import { useNavigation } from "./providers/NavigationProvider";
import App from "./App";

// Error Boundary to catch any errors in children
class ChildrenErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('❌ ChildrenErrorBoundary: Error caught:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ ChildrenErrorBoundary: Component did catch:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="window-card p-8 text-center max-w-md">
            <h2 className="text-xl mb-4 text-destructive">Children Rendering Error</h2>
            <p className="text-muted-foreground mb-4">The page component failed to render.</p>
            <div className="text-xs bg-muted p-4 rounded text-left">
              <strong>Error:</strong> {this.state.error?.message || 'Unknown error'}<br/>
              <strong>Stack:</strong> {this.state.error?.stack?.substring(0, 200)}...
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

    return this.props.children;
  }
}

interface AppWithNavigationProps {
  children: React.ReactNode;
}

export default function AppWithNavigation({ children }: AppWithNavigationProps) {
  console.log('🔗 AppWithNavigation: Starting render');
  console.log('🔍 AppWithNavigation: Received children:', {
    hasChildren: !!children,
    childrenType: typeof children,
    isValidElement: React.isValidElement(children),
    childrenDisplayName: children && React.isValidElement(children) ? children.type?.displayName || children.type?.name || 'Unknown' : 'N/A'
  });
  
  // Get navigation context with error handling
  let navigationContext;
  try {
    navigationContext = useNavigation();
    console.log('✅ AppWithNavigation: Successfully received navigation context');
  } catch (error) {
    console.error('❌ AppWithNavigation: Error getting navigation context:', error);
    // If navigation context fails, still try to render children directly
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="p-4 bg-destructive text-white mb-4">
          <strong>Navigation Error:</strong> {error?.message || 'Unknown error'}
        </div>
        {children}
      </div>
    );
  }

  const {
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
  } = navigationContext;

  // Validate children before passing to App
  if (!children) {
    console.error('❌ AppWithNavigation: No children provided, cannot render App');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="window-card p-8 text-center">
          <h2 className="text-xl mb-4 text-destructive">Navigation Error</h2>
          <p className="text-muted-foreground">No page component was provided to render.</p>
        </div>
      </div>
    );
  }

  console.log('✅ AppWithNavigation: Passing children to App component');
  console.log('🔍 AppWithNavigation: About to pass children:', children);

  // Pass all navigation data to App as props and wrap children properly
  return (
    <ChildrenErrorBoundary>
      <App
        // CRITICAL: Pass children as a prop, not as JSX children
        children={children}
        
        // App state
        isLoading={!auth.isInitialized || auth.isLoading}
        isLoggingOut={state.isLoggingOut}
        hasError={state.hasError || (auth.error && auth.isInitialized)}
        loadingTimeout={state.loadingTimeout}
        showWalkthrough={state.showWalkthrough}
        showCreatorWalkthrough={state.showCreatorWalkthrough}
        currentPath={location.pathname}
        isInCampaignFlow={state.isInCampaignFlow}
        
        // Auth handlers
        onLogin={handleLogin}
        onSignup={handleSignup}
        onLogout={handleLogout}
        onChooseRole={navigation.chooseRole}
        
        // Navigation handlers
        onGetStarted={() => navigation.chooseRole('clipper', false)}
        onBack={navigation.goBack}
        onViewCaseStudies={() => window.location.href = "/case-studies"}
        onStartCampaign={navigation.startCampaign}
        onViewCampaign={navigation.viewCampaign}
        onViewFeaturedCampaign={navigation.viewFeaturedCampaign}
        onContinue={navigation.continueCampaignFlow}
        onCreateBounty={() => navigation.startCampaign('reach')}
        onComplete={navigation.createBounty}
        onSubmit={navigation.handleSubmission}
        onSelectCampaign={(campaign: any) => {
          navigation.continueCampaignFlow('select-campaign', campaign);
          window.location.href = "/clipper/submission";
        }}
        onSubmissionComplete={navigation.handleSubmission}
        onTrackRank={() => window.location.href = "/clipper/campaigns"}
        onSubmitAnother={() => window.location.href = "/clipper/campaigns"}
        onViewSubmissions={() => window.location.href = "/creator/dashboard"}
        onCreateAnother={() => window.location.href = "/creator/bounty-wizard"}
        onShare={(platform: "copy" | "twitter") => {
          if (state.createdBountyData) {
            if (platform === "copy") {
              navigator.clipboard.writeText(window.location.origin + "/campaign/" + state.createdBountyData.id);
            } else {
              window.open(`https://twitter.com/intent/tweet?text=Check out my new campaign on ClipLab!&url=${window.location.origin}/campaign/${state.createdBountyData.id}`);
            }
          }
        }}
        onClearCreatedBounty={() => console.log('Clear created bounty')}
        onSwitchToClipper={() => window.location.href = "/clipper/welcome"}
        onSwitchToCreator={() => window.location.href = "/creator/welcome"}
        
        // Data props
        user={currentUser}
        bounties={appData.bounties.filter((b: any) => currentUser ? b.creatorId === currentUser.id : true)}
        campaigns={appData.bounties}
        featuredClips={appData.featuredClips}
        topCreators={appData.topCreators}
        liveBounties={appData.bounties.slice(0, 6)}
        submissions={appData.submissions || []}
        
        // State props
        selectedCampaign={state.selectedCampaign}
        selectedCampaignMode={state.selectedCampaignMode}
        selectedCampaignType="reach"
        campaignData={state.campaignDataForEscrow}
        hasPaymentMethod={state.hasPaymentMethod}
        bountyData={state.createdBountyData}
        createdBountyData={state.createdBountyData}
        submissionId={state.selectedSubmissionId}
        initialPage={state.clipperFeedPage}
        
        // App methods
        onUpdateSubmissionStatus={appData.updateSubmissionStatus}
        onLoadingTimeout={handleLoadingTimeout}
        goHome={goHome}
      />
    </ChildrenErrorBoundary>
  );
}
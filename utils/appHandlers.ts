import type { User, Bounty, FeaturedClip, Submission, Page } from '../types';

export function createMockUser(email: string, role?: 'creator' | 'clipper' | 'admin'): User {
  const userRole = role || (email.includes('admin') ? 'admin' : email.includes('creator') ? 'creator' : 'clipper');
  
  return {
    id: userRole === 'creator' ? 'demo-creator-1' : Date.now().toString(),
    email,
    username: email.split('@')[0],
    role: userRole,
    channelLink: 'https://youtube.com/@example',
    createdAt: new Date(),
    level: Math.floor(Math.random() * 30) + 10,
    totalEarnings: Math.floor(Math.random() * 15000) + 2000,
    streak: Math.floor(Math.random() * 20) + 1
  };
}

export function createMockCampaignFromClip(clip: FeaturedClip): Bounty {
  return {
    id: `featured-${clip.id}`,
    creatorId: 'mock-creator',
    title: `${clip.category} Campaign - ${clip.title.split(' - ')[0]}`,
    description: `Campaign that produced: ${clip.title}`,
    amount: clip.earnings,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    hashtags: [clip.category],
    status: 'active',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    submissions: [
      {
        id: `featured-sub-${clip.id}`,
        bountyId: `featured-${clip.id}`,
        clipperId: 'featured-clipper',
        clipperUsername: clip.creator.replace('@', ''),
        youtubeUrl: 'https://youtube.com/shorts/featured-example',
        description: clip.title,
        status: 'winner-1st',
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        youtubeData: {
          title: clip.title,
          views: clip.views,
          likes: clip.likes,
          comments: Math.floor(clip.likes * 0.1),
          thumbnail: clip.thumbnail
        }
      }
    ],
    difficulty: clip.difficulty as any,
    featured: true,
    campaignMode: 'reach'
  };
}

export function convertCampaignDataToBounty(campaignData: any, currentUser: User) {
  const { mode, data, bountyDetails } = campaignData;
  
  return {
    creatorId: currentUser.id,
    title: bountyDetails?.title || `${mode.charAt(0).toUpperCase() + mode.slice(1)} Campaign`,
    description: bountyDetails?.description || data.creatorNotes || `${mode} campaign for content amplification`,
    amount: parseInt(data.budget) || 0,
    deadline: new Date(Date.now() + (parseInt(data.campaignDuration) * 24 * 60 * 60 * 1000)),
    hashtags: bountyDetails?.hashtags || ['Campaign', mode.charAt(0).toUpperCase() + mode.slice(1)],
    status: 'active' as const,
    difficulty: bountyDetails?.difficulty || (['Easy', 'Medium', 'Hard', 'Expert'][Math.floor(Math.random() * 4)] as any),
    featured: bountyDetails?.featured || Math.random() > 0.7,
    campaignMode: 'reach' as const,
    campaignData: data
  };
}

export function getLoginRedirectPage(user: User, selectedCampaignMode: 'reach' | null): Page {
  if (user.role === 'creator' && selectedCampaignMode) {
    return 'campaign-constructor';
  } else if (user.role === 'admin') {
    return 'admin';
  } else if (user.role === 'creator') {
    return 'creator-dashboard';
  } else {
    return 'clipper-campaigns';
  }
}

export function getSignupRedirectPage(role: 'creator' | 'clipper', selectedCampaignMode: 'reach' | null): Page {
  if (role === 'creator' && selectedCampaignMode) {
    return 'campaign-constructor';
  } else if (role === 'creator') {
    return 'creator-dashboard';
  } else {
    return 'clipper-campaigns';
  }
}

export function getCampaignTrackingBackPage(currentUser: User | null, selectedCampaign: Bounty | null): Page {
  if (currentUser) {
    if (currentUser.role === 'creator') {
      return 'creator-dashboard';
    } else {
      return 'clipper-campaigns';
    }
  } else {
    if (selectedCampaign?.id.startsWith('featured-')) {
      return 'creator-landing';
    } else {
      return 'clipper-welcome';
    }
  }
}

export function handleShare(platform: 'copy' | 'twitter', bountyData: any) {
  const bountyUrl = `https://cliplab.com/bounty/${bountyData?.id || 'demo-123'}`;
  
  if (platform === 'copy') {
    navigator.clipboard.writeText(bountyUrl);
    console.log('Link copied to clipboard');
  } else if (platform === 'twitter') {
    const tweetText = `Just launched a new bounty on @ClipLab! 🚀\n\n"${bountyData?.title}" - $${bountyData?.amount} AUD\n\nClippers, come get paid! 💰`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(bountyUrl)}`;
    window.open(tweetUrl, '_blank');
  }
}
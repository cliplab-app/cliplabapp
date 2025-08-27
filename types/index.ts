export type User = {
  id: string;
  email: string;
  username: string;
  role: 'creator' | 'clipper' | 'admin';
  avatar?: string;
  channelLink?: string;
};

export type Page = 
  | 'landing'
  | 'unified-landing'
  | 'creator-landing'
  | 'clipper-landing'
  | 'creator-welcome'
  | 'creator-signup'
  | 'clipper-welcome'
  | 'clipper-signup'
  | 'login'
  | 'signup'
  | 'creator-dashboard'
  | 'creator-bounty-wizard'
  | 'creator-success'
  | 'campaign-setup'
  | 'campaign-configuration'
  | 'campaign-escrow'
  | 'payment-setup'
  | 'bounty-creation'
  | 'campaign-constructor'
  | 'campaign-tracking'
  | 'clipper-campaigns'
  | 'clipper-submission'
  | 'clipper-confirmation'
  | 'clipper-earnings'
  | 'clipper-leaderboards'
  | 'clipper-analytics'
  | 'admin'
  | 'campaign-creation'
  | 'campaigns'
  | 'case-studies';

export type Bounty = {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  amount: number;
  deadline: Date;
  hashtags: string[];
  status: 'active' | 'completed' | 'expired';
  createdAt: Date;
  submissions: Submission[];
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  featured?: boolean;
  campaignMode?: 'reach' | 'velocity' | 'select';
  campaignData?: {
    budget?: string;
    cpmRate?: string;
    minViews?: string;
    maxSubmissions?: string;
    campaignDuration?: string;
    creatorNotes?: string;
    platforms?: Array<{
      id: string;
      name: string;
      isActive: boolean;
      allocation: number;
      cpmRate: number;
      expectedViews: number;
      budget: number;
    }>;
    totalExpectedViews?: number;
    estimatedSubmissions?: number;
    contentSourceUrl?: string;
  };
};

export type Submission = {
  id: string;
  bountyId: string;
  clipperId: string;
  clipperUsername: string;
  youtubeUrl: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'winner-1st' | 'winner-2nd' | 'winner-3rd';
  submittedAt: Date;
  youtubeData?: {
    title: string;
    views: number;
    likes: number;
    comments: number;
    thumbnail?: string;
    duration?: string;
  };
};

export type FeaturedClip = {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
  views: number;
  likes: number;
  category: string;
  trending?: boolean;
  earnings: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  viral?: boolean;
};

export type TopCreator = {
  id: string;
  username: string;
  avatar: string;
  totalEarnings: number;
  level: number;
  streak: number;
  clipsCreated: number;
  rank: number;
  status: 'Legend' | 'Elite' | 'Hot Streak' | 'Active';
};
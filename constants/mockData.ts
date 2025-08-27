import type { TopCreator, FeaturedClip, Bounty, Submission } from '../types';

export const mockTopCreators: TopCreator[] = [
  {
    id: '1',
    username: 'ClipMaster_AI',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
    totalEarnings: 28400,
    level: 47,
    streak: 23,
    clipsCreated: 156,
    rank: 1,
    status: 'Legend'
  },
  {
    id: '2',
    username: 'ViralClips_Pro',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b8d03d6e?w=100&h=100&fit=crop&crop=faces',
    totalEarnings: 22150,
    level: 42,
    streak: 15,
    clipsCreated: 203,
    rank: 2,
    status: 'Elite'
  },
  {
    id: '3',
    username: 'ContentKing',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    totalEarnings: 19750,
    level: 38,
    streak: 8,
    clipsCreated: 134,
    rank: 3,
    status: 'Hot Streak'
  },
  {
    id: '4',
    username: 'EditWizard',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
    totalEarnings: 16200,
    level: 35,
    streak: 12,
    clipsCreated: 98,
    rank: 4,
    status: 'Hot Streak'
  },
  {
    id: '5',
    username: 'ClipCrafted',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
    totalEarnings: 14600,
    level: 31,
    streak: 6,
    clipsCreated: 87,
    rank: 5,
    status: 'Active'
  }
];

export const mockFeaturedClips: FeaturedClip[] = [
  {
    id: '1',
    title: 'Valorant Pro Makes Insane Play - $850 Winner',
    creator: '@ClipMaster_AI',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    views: 4200000,
    likes: 385000,
    category: 'Gaming',
    trending: true,
    earnings: 850,
    difficulty: 'Hard',
    viral: true
  },
  {
    id: '2',
    title: 'Chef Burns Kitchen Down - $650 Payout',
    creator: '@ViralClips_Pro',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    views: 3800000,
    likes: 295000,
    category: 'Comedy',
    trending: true,
    earnings: 650,
    difficulty: 'Medium',
    viral: true
  },
  {
    id: '3',
    title: 'Guitar Solo Goes Massive - $920 Earned',
    creator: '@ContentKing',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    views: 5600000,
    likes: 410000,
    category: 'Music',
    trending: false,
    earnings: 920,
    difficulty: 'Expert',
    viral: true
  },
  {
    id: '4',
    title: 'Coding Tutorial Disaster - $420 Quick Win',
    creator: '@EditWizard',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    views: 1920000,
    likes: 145000,
    category: 'Tutorial',
    trending: true,
    earnings: 420,
    difficulty: 'Easy'
  },
  {
    id: '5',
    title: 'Streamer Meltdown Moment - $780 in Hours',
    creator: '@ClipCrafted',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
    views: 6800000,
    likes: 520000,
    category: 'Livestream',
    trending: true,
    earnings: 780,
    difficulty: 'Hard',
    viral: true
  },
  {
    id: '6',
    title: 'Podcast Gold Clip - $350 Easy Money',
    creator: '@ContentKing',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop',
    views: 2200000,
    likes: 168000,
    category: 'Podcast',
    trending: false,
    earnings: 350,
    difficulty: 'Medium'
  }
];

export const mockBounties: Bounty[] = [
  {
    id: '1',
    creatorId: 'demo-creator-1',
    title: 'Gaming Rage Compilation - High Payout',
    description: 'Looking for the most intense gaming rage moments from streamers. High-engagement content that drives significant viewership and monetization.',
    amount: 750,
    deadline: new Date('2025-08-15'),
    hashtags: ['Gaming', 'Livestream'],
    status: 'active',
    createdAt: new Date('2025-07-20'),
    submissions: [],
    difficulty: 'Hard',
    featured: true,
    campaignMode: 'reach',
    campaignData: {
      budget: '750',
      cpmRate: '1.50',
      minViews: '10000',
      maxSubmissions: '25',
      campaignDuration: '14',
      creatorNotes: 'Looking for high-energy gaming clips with authentic reactions. Focus on competitive moments and clutch plays.'
    }
  },
  {
    id: '2',
    creatorId: 'demo-creator-1',
    title: 'Cooking Disaster Compilation',
    description: 'Epic cooking fails and kitchen disasters. The more chaotic the better. Quick turnaround for quality submissions.',
    amount: 450,
    deadline: new Date('2025-08-20'),
    hashtags: ['Tutorial', 'Comedy'],
    status: 'active',
    createdAt: new Date('2025-07-22'),
    submissions: [],
    difficulty: 'Medium',
    campaignMode: 'reach',
    campaignData: {
      budget: '450',
      cpmRate: '1.50',
      minViews: '10000',
      maxSubmissions: '25',
      campaignDuration: '14',
      creatorNotes: 'Seeking viral-worthy moments from any gaming content. Perfect timing and editing are key.'
    }
  },
  {
    id: '3',
    creatorId: 'demo-creator-1',
    title: 'Viral Dance Trends - Trending Now',
    description: 'Latest TikTok dances that are exploding right now. Get in early for maximum views and engagement.',
    amount: 600,
    deadline: new Date('2025-08-25'),
    hashtags: ['Comedy', 'Music'],
    status: 'active',
    createdAt: new Date('2025-07-25'),
    submissions: [],
    difficulty: 'Medium',
    featured: true,
    campaignMode: 'reach',
    campaignData: {
      budget: '600',
      cpmRate: '1.50',
      minViews: '10000',
      maxSubmissions: '25',
      campaignDuration: '14',
      creatorNotes: 'Premium brand-safe content only. Looking for creative storytelling and professional editing quality.'
    }
  },
  {
    id: '4',
    creatorId: 'demo-creator-1',
    title: 'Podcast Golden Moments',
    description: 'Extract the most shareable 60-second moments from long-form podcasts. Untapped opportunity with strong monetization potential.',
    amount: 380,
    deadline: new Date('2025-08-30'),
    hashtags: ['Podcast', 'Reaction'],
    status: 'active',
    createdAt: new Date('2025-07-28'),
    submissions: [],
    difficulty: 'Easy',
    campaignMode: 'reach'
  },
  {
    id: '5',
    creatorId: 'demo-creator-1',
    title: 'Tech Review Fails - Instant Viral',
    description: 'Tech reviewers having unexpected moments. Premium brands provide substantial earning opportunities for quality content.',
    amount: 520,
    deadline: new Date('2025-09-05'),
    hashtags: ['Tutorial', 'Comedy'],
    status: 'active',
    createdAt: new Date('2025-07-30'),
    submissions: [],
    difficulty: 'Hard',
    campaignMode: 'reach'
  },
  {
    id: '6',
    creatorId: 'demo-creator-1',
    title: 'Sports Reaction Explosions',
    description: 'Capture the exact moment fans lose their minds over game-changing plays. Premium sports content with massive engagement potential.',
    amount: 890,
    deadline: new Date('2025-08-18'),
    hashtags: ['Reaction', 'Livestream'],
    status: 'active',
    createdAt: new Date('2025-07-25'),
    submissions: [],
    difficulty: 'Expert',
    featured: true,
    campaignMode: 'reach'
  },
  {
    id: '7',
    creatorId: 'demo-creator-1',
    title: 'Celebrity Interview Moments',
    description: 'Find the most shareable 30-second clips from long-form celebrity interviews. High-value content with proven viral track record.',
    amount: 670,
    deadline: new Date('2025-08-22'),
    hashtags: ['Comedy', 'Reaction'],
    status: 'active',
    createdAt: new Date('2025-07-28'),
    submissions: [],
    difficulty: 'Hard',
    campaignMode: 'reach'
  },
  {
    id: '8',
    creatorId: 'other-creator-1',
    title: 'AI Tool Mishaps & Glitches',
    description: 'Document the funniest AI fails and unexpected outputs. Tech humor is exploding right now - perfect timing for viral content.',
    amount: 425,
    deadline: new Date('2025-08-28'),
    hashtags: ['Tutorial', 'Comedy'],
    status: 'active',
    createdAt: new Date('2025-07-30'),
    submissions: [],
    difficulty: 'Medium',
    campaignMode: 'reach'
  },
  {
    id: '9',
    creatorId: 'other-creator-2',
    title: 'Street Food First Reactions',
    description: 'Capture authentic first-bite reactions to exotic street foods. Food content consistently performs well across all platforms.',
    amount: 390,
    deadline: new Date('2025-09-02'),
    hashtags: ['Comedy', 'Reaction'],
    status: 'active',
    createdAt: new Date('2025-08-01'),
    submissions: [],
    difficulty: 'Easy',
    campaignMode: 'reach'
  },
  {
    id: '10',
    creatorId: 'demo-creator-1',
    title: 'Music Producer Beat Drops',
    description: 'Find the moment producers first hear their beat and react. Music creation content has massive crossover potential.',
    amount: 580,
    deadline: new Date('2025-09-08'),
    hashtags: ['Music', 'Reaction'],
    status: 'active',
    createdAt: new Date('2025-08-01'),
    submissions: [],
    difficulty: 'Hard',
    featured: true,
    campaignMode: 'reach'
  }
];

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    bountyId: '1',
    clipperId: 'clipper1',
    clipperUsername: 'ClipMaster_AI',
    youtubeUrl: 'https://youtube.com/shorts/example1',
    description: 'Streamer has complete meltdown after losing ranked game - 2.4M views in 6 hours!',
    status: 'winner-1st',
    submittedAt: new Date('2025-07-31'),
    youtubeData: {
      title: 'STREAMER RAGE MOMENT - EPIC MELTDOWN',
      views: 2400000,
      likes: 185000,
      comments: 12800,
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop'
    }
  },
  {
    id: '2',
    bountyId: '2',
    clipperId: 'clipper2',
    clipperUsername: 'ViralClips_Pro',
    youtubeUrl: 'https://youtube.com/shorts/example2',
    description: 'Chef completely burns down kitchen while filming tutorial - pure comedy gold',
    status: 'winner-1st',
    submittedAt: new Date('2025-07-31'),
    youtubeData: {
      title: 'CHEF SETS KITCHEN ON FIRE - EPIC FAIL',
      views: 1800000,
      likes: 156000,
      comments: 8900,
      thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
    }
  },
  {
    id: '3',
    bountyId: '1',
    clipperId: 'clipper3',
    clipperUsername: 'ContentKing',
    youtubeUrl: 'https://youtube.com/shorts/example3',
    description: 'Another epic gaming rage moment with incredible engagement',
    status: 'winner-2nd',
    submittedAt: new Date('2025-08-01'),
    youtubeData: {
      title: 'GAMING RAGE COMPILATION PART 2',
      views: 1200000,
      likes: 98000,
      comments: 5600,
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop'
    }
  },
  {
    id: '4',
    bountyId: '1',
    clipperId: 'clipper4',
    clipperUsername: 'EditWizard',
    youtubeUrl: 'https://youtube.com/shorts/example4',
    description: 'High-energy gaming moments with perfect timing',
    status: 'pending',
    submittedAt: new Date('2025-08-02'),
    youtubeData: {
      title: 'CLUTCH GAMING MOMENTS COMPILATION',
      views: 850000,
      likes: 67000,
      comments: 4200,
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop'
    }
  },
  {
    id: '5',
    bountyId: '3',
    clipperId: 'clipper5',
    clipperUsername: 'DanceClipPro',
    youtubeUrl: 'https://youtube.com/shorts/dance1',
    description: 'Perfect TikTok dance compilation with trending audio - massive engagement!',
    status: 'winner-1st',
    submittedAt: new Date('2025-08-01'),
    youtubeData: {
      title: 'VIRAL DANCE TRENDS 2025 - COMPILATION',
      views: 3200000,
      likes: 245000,
      comments: 18400,
      thumbnail: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop'
    }
  },
  {
    id: '6',
    bountyId: '4',
    clipperId: 'clipper6',
    clipperUsername: 'PodcastClipper',
    youtubeUrl: 'https://youtube.com/shorts/podcast1',
    description: 'Joe Rogan mind-blown moment - perfect 60-second clip with natural punchline',
    status: 'approved',
    submittedAt: new Date('2025-08-02'),
    youtubeData: {
      title: 'PODCAST GOLDEN MOMENT - MIND BLOWN',
      views: 1650000,
      likes: 128000,
      comments: 7800,
      thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop'
    }
  },
  {
    id: '7',
    bountyId: '5',
    clipperId: 'clipper7',
    clipperUsername: 'TechFails',
    youtubeUrl: 'https://youtube.com/shorts/tech1',
    description: 'Tech reviewer breaks $2000 gadget on camera - instant viral moment',
    status: 'winner-1st',
    submittedAt: new Date('2025-08-03'),
    youtubeData: {
      title: 'TECH REVIEWER BREAKS EXPENSIVE GADGET',
      views: 2800000,
      likes: 198000,
      comments: 15600,
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop'
    }
  },
  {
    id: '8',
    bountyId: '6',
    clipperId: 'clipper8',
    clipperUsername: 'SportsReacts',
    youtubeUrl: 'https://youtube.com/shorts/sports1',
    description: 'Fan goes absolutely insane during game-winning touchdown - pure emotion',
    status: 'winner-1st',
    submittedAt: new Date('2025-08-01'),
    youtubeData: {
      title: 'SPORTS FAN LOSES MIND - EPIC REACTION',
      views: 4100000,
      likes: 312000,
      comments: 22400,
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    }
  },
  {
    id: '9',
    bountyId: '10',
    clipperId: 'clipper9',
    clipperUsername: 'BeatDropper',
    youtubeUrl: 'https://youtube.com/shorts/music1',
    description: 'Producer hears his beat for first time and goes crazy - authentic reaction gold',
    status: 'pending',
    submittedAt: new Date('2025-08-03'),
    youtubeData: {
      title: 'PRODUCER FIRST BEAT REACTION - EMOTIONAL',
      views: 1900000,
      likes: 142000,
      comments: 9200,
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'
    }
  }
];
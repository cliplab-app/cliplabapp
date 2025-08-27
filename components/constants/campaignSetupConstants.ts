import { Eye, Zap, Target } from 'lucide-react';

export interface CampaignTypeData {
  id: 'velocity' | 'reach' | 'select';
  title: string;
  icon: any;
  subtitle: string;
  description: string;
  keyBenefit: string;
  features: string[];
  bestFor: string;
  isActive: boolean;
  isRecommended: boolean;
  gradientFrom: string;
  gradientTo: string;
  iconBg: string;
  iconColor: string;
}

export const CAMPAIGN_TYPES: CampaignTypeData[] = [
  {
    id: 'velocity',
    title: 'VELOCITY',
    icon: Zap,
    subtitle: 'Fast viral content with competition-based rewards',
    description: 'Perfect for product launches, marketing bursts, or when you need instant viral momentum. Top performers compete for fixed prize pools.',
    keyBenefit: 'Top 3 performers share fixed prize pool',
    features: [
      'Fixed competition timeline',
      'Engagement-based scoring',
      'Instant viral potential',
      'Performance leaderboards'
    ],
    bestFor: 'Marketing bursts, product launches, trend capitalizing',
    isActive: false,
    isRecommended: false,
    gradientFrom: 'secondary',
    gradientTo: 'secondary-alt',
    iconBg: 'secondary/20',
    iconColor: 'secondary'
  },
  {
    id: 'reach',
    title: 'REACH',
    icon: Eye,
    subtitle: 'Pay per view with verified performance tracking',
    description: 'Low-risk, performance-based model. Only pay for actual verified views delivered. Perfect for consistent, scalable content distribution.',
    keyBenefit: 'Only pay for actual views delivered',
    features: [
      'Pay-per-view model',
      'Verified view tracking',
      'Budget control',
      'Scalable reach'
    ],
    bestFor: 'Long-tail promotion, passive growth, budget optimization',
    isActive: true,
    isRecommended: true,
    gradientFrom: 'status-pending',
    gradientTo: 'secondary',
    iconBg: 'status-pending/20',
    iconColor: 'status-pending'
  },
  {
    id: 'select',
    title: 'SELECT',
    icon: Target,
    subtitle: 'Hand-picked winners based on brand quality',
    description: 'Complete creative control over content selection. Perfect for brand-safe content where quality and alignment matter more than pure viral metrics.',
    keyBenefit: 'Complete creative control over selection',
    features: [
      'Manual content review',
      'Brand safety focus',
      'Quality over quantity',
      'Creative alignment'
    ],
    bestFor: 'Brand-safe content, premium quality, specific messaging',
    isActive: false,
    isRecommended: false,
    gradientFrom: 'primary',
    gradientTo: 'primary-alt',
    iconBg: 'primary/20',
    iconColor: 'primary/60'
  }
];

export const STEP_LABELS = [
  'Campaign Type',
  'Campaign Details', 
  'Launch Campaign'
];
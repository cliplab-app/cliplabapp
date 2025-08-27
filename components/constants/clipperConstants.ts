export const SUBMISSION_STATUS_STYLES = {
  'winner-1st': 'status-winner-1st',
  'winner-2nd': 'status-winner-2nd', 
  'winner-3rd': 'status-winner-3rd',
  'approved': 'status-approved',
  'rejected': 'status-rejected',
  'pending': 'status-pending'
} as const;

export const CAMPAIGN_MODE_INFO = {
  velocity: {
    icon: 'Zap',
    color: 'text-secondary',
    description: 'Competition-based ranking by engagement metrics'
  },
  reach: {
    icon: 'Eye', 
    color: 'text-status-pending',
    description: 'Earnings based on view performance milestones'
  },
  select: {
    icon: 'Star',
    color: 'text-primary', 
    description: 'Manual selection of winning submissions'
  }
} as const;

export const SUBMISSION_ICONS = {
  'winner-1st': 'Crown',
  'winner-2nd': 'Award',
  'winner-3rd': 'Star', 
  'approved': 'CheckCircle',
  'rejected': 'XCircle',
  'pending': 'Clock'
} as const;
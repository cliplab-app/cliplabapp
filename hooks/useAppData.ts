'use client';

import { useState } from 'react';
import type { User, Bounty, Submission, FeaturedClip, TopCreator } from '../types';

// Import mock data
import { 
  mockBounties, 
  mockSubmissions, 
  mockFeaturedClips, 
  mockTopCreators 
} from '../constants/mockData';

interface UseAppDataReturn {
  bounties: Bounty[];
  submissions: Submission[];
  featuredClips: FeaturedClip[];
  topCreators: TopCreator[];
  loading: boolean;
  error: string | null;
  addBounty: (bounty: Omit<Bounty, 'id' | 'createdAt' | 'submissions'>) => Bounty;
  updateBounty: (id: string, updates: Partial<Bounty>) => void;
  deleteBounty: (id: string) => void;
  addSubmission: (submission: Omit<Submission, 'id' | 'submittedAt'>) => string;
  updateSubmissionStatus: (submissionId: string, status: Submission['status']) => void;
  refreshData: () => void;
  validateYouTubeUrl: (url: string) => { isValid: boolean; videoData?: any };
}

export function useAppData(): UseAppDataReturn {
  // State management
  const [bounties, setBounties] = useState<Bounty[]>(mockBounties);
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [featuredClips, setFeaturedClips] = useState<FeaturedClip[]>(mockFeaturedClips);
  const [topCreators, setTopCreators] = useState<TopCreator[]>(mockTopCreators);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bounty operations
  const addBounty = (bountyData: Omit<Bounty, 'id' | 'createdAt' | 'submissions'>): Bounty => {
    const newBounty: Bounty = {
      ...bountyData,
      id: `bounty-${Date.now()}`,
      createdAt: new Date(),
      submissions: [],
    };
    setBounties(prev => [newBounty, ...prev]);
    return newBounty;
  };

  const updateBounty = (id: string, updates: Partial<Bounty>): void => {
    setBounties(prev => prev.map(bounty => 
      bounty.id === id ? { ...bounty, ...updates } : bounty
    ));
  };

  const deleteBounty = (id: string): void => {
    setBounties(prev => prev.filter(bounty => bounty.id !== id));
  };

  // Submission operations
  const addSubmission = (submissionData: Omit<Submission, 'id' | 'submittedAt'>): string => {
    const newSubmission: Submission = {
      ...submissionData,
      id: `submission-${Date.now()}`,
      submittedAt: new Date(),
    };
    
    setSubmissions(prev => [newSubmission, ...prev]);
    setBounties(prev => prev.map(bounty => 
      bounty.id === submissionData.bountyId 
        ? { ...bounty, submissions: [newSubmission, ...bounty.submissions] }
        : bounty
    ));

    return newSubmission.id;
  };

  const updateSubmissionStatus = (submissionId: string, status: Submission['status']): void => {
    setSubmissions(prev => prev.map(submission => 
      submission.id === submissionId ? { ...submission, status } : submission
    ));
    setBounties(prev => prev.map(bounty => ({
      ...bounty,
      submissions: bounty.submissions.map(submission =>
        submission.id === submissionId ? { ...submission, status } : submission
      )
    })));
  };

  // YouTube URL validation
  const validateYouTubeUrl = (url: string): { isValid: boolean; videoData?: any } => {
    const isValidYouTubeUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
    return {
      isValid: isValidYouTubeUrl,
      videoData: isValidYouTubeUrl ? {
        title: 'Mock Video Title',
        views: Math.floor(Math.random() * 1000000) + 10000,
        likes: Math.floor(Math.random() * 50000) + 1000,
        comments: Math.floor(Math.random() * 5000) + 100,
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
        duration: '2:34'
      } : undefined
    };
  };

  // Refresh data function
  const refreshData = (): void => {
    // Reset to original mock data
    setBounties(mockBounties);
    setSubmissions(mockSubmissions);
    setFeaturedClips(mockFeaturedClips);
    setTopCreators(mockTopCreators);
  };

  return {
    bounties,
    submissions,
    featuredClips,
    topCreators,
    loading,
    error,
    addBounty,
    updateBounty,
    deleteBounty,
    addSubmission,
    updateSubmissionStatus,
    refreshData,
    validateYouTubeUrl,
  };
}
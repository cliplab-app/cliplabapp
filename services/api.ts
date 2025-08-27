'use client';

// API Configuration - Fixed for Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-api-endpoint.com/api';
const API_KEY = import.meta.env.VITE_API_KEY || 'YOUR_API_KEY_HERE';

// Types for API responses
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

interface CreateBountyRequest {
  title: string;
  description: string;
  amount: number;
  deadline: string;
  hashtags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  featured: boolean;
  campaignMode: 'reach';
}

interface SubmissionRequest {
  bountyId: string;
  youtubeUrl: string;
  description: string;
}

// Base API client with error handling
class ApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        data: data.data || data,
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      return {
        data: {} as T,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Authentication APIs
  async login(email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    username: string;
    role: 'creator' | 'clipper';
    channelLink?: string;
  }): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<{}>> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // User APIs
  async getUserProfile(userId: string): Promise<ApiResponse<any>> {
    return this.request(`/users/${userId}`);
  }

  async updateUserProfile(userId: string, profileData: any): Promise<ApiResponse<any>> {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Bounty/Campaign APIs
  async getBounties(filters?: {
    status?: 'active' | 'completed' | 'expired';
    creatorId?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/bounties${params.toString() ? `?${params}` : ''}`;
    return this.request(endpoint);
  }

  async createBounty(bountyData: CreateBountyRequest): Promise<ApiResponse<any>> {
    return this.request('/bounties', {
      method: 'POST',
      body: JSON.stringify(bountyData),
    });
  }

  async getBountyById(bountyId: string): Promise<ApiResponse<any>> {
    return this.request(`/bounties/${bountyId}`);
  }

  async updateBounty(bountyId: string, updates: Partial<CreateBountyRequest>): Promise<ApiResponse<any>> {
    return this.request(`/bounties/${bountyId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteBounty(bountyId: string): Promise<ApiResponse<{}>> {
    return this.request(`/bounties/${bountyId}`, {
      method: 'DELETE',
    });
  }

  // Submission APIs
  async createSubmission(submissionData: SubmissionRequest): Promise<ApiResponse<any>> {
    return this.request('/submissions', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  }

  async getSubmissions(filters?: {
    bountyId?: string;
    clipperId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/submissions${params.toString() ? `?${params}` : ''}`;
    return this.request(endpoint);
  }

  async updateSubmissionStatus(
    submissionId: string, 
    status: 'pending' | 'approved' | 'rejected' | 'winner-1st' | 'winner-2nd' | 'winner-3rd'
  ): Promise<ApiResponse<any>> {
    return this.request(`/submissions/${submissionId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // YouTube API Integration
  async validateYouTubeUrl(url: string): Promise<ApiResponse<{
    isValid: boolean;
    videoData?: {
      title: string;
      views: number;
      likes: number;
      comments: number;
      thumbnail: string;
      duration: string;
    };
  }>> {
    return this.request('/external/youtube/validate', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  // Analytics APIs
  async getCreatorAnalytics(creatorId: string, timeframe: '7d' | '30d' | '90d' = '30d'): Promise<ApiResponse<{
    totalSpent: number;
    totalSubmissions: number;
    successRate: number;
    avgCPM: number;
    campaignPerformance: any[];
  }>> {
    return this.request(`/analytics/creator/${creatorId}?timeframe=${timeframe}`);
  }

  async getClipperAnalytics(clipperId: string, timeframe: '7d' | '30d' | '90d' = '30d'): Promise<ApiResponse<{
    totalEarnings: number;
    totalSubmissions: number;
    successRate: number;
    topPerformingClips: any[];
  }>> {
    return this.request(`/analytics/clipper/${clipperId}?timeframe=${timeframe}`);
  }

  // Payment APIs (integrate with Stripe, PayPal, etc.)
  async createPaymentIntent(amount: number, campaignId: string): Promise<ApiResponse<{
    clientSecret: string;
    paymentIntentId: string;
  }>> {
    return this.request('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, campaignId }),
    });
  }

  async processEarningsPayout(clipperId: string, amount: number): Promise<ApiResponse<{
    payoutId: string;
    status: string;
  }>> {
    return this.request('/payments/payout', {
      method: 'POST',
      body: JSON.stringify({ clipperId, amount }),
    });
  }

  // File Upload API (for thumbnails, assets, etc.)
  async uploadFile(file: File, type: 'thumbnail' | 'avatar' | 'asset'): Promise<ApiResponse<{
    url: string;
    filename: string;
  }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      const data = await response.json();
      return {
        data: data.data || data,
        success: response.ok,
        message: data.message
      };
    } catch (error) {
      return {
        data: {} as any,
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  // Real-time notifications (WebSocket integration)
  createWebSocketConnection(userId: string): WebSocket | null {
    try {
      const wsUrl = `${this.baseUrl.replace('http', 'ws')}/ws/${userId}?token=${this.apiKey}`;
      return new WebSocket(wsUrl);
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      return null;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL, API_KEY);

// Utility functions for common API patterns
export const withRetry = async <T>(
  operation: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> => {
  let lastError: ApiResponse<T>;
  
  for (let i = 0; i < maxRetries; i++) {
    const result = await operation();
    if (result.success) {
      return result;
    }
    
    lastError = result;
    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  return lastError!;
};

// Cache management for frequently accessed data
class ApiCache {
  private cache = new Map<string, { data: any; expires: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl?: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + (ttl || this.defaultTTL)
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const apiCache = new ApiCache();

// Helper function to cache API responses
export const withCache = async <T>(
  key: string,
  operation: () => Promise<ApiResponse<T>>,
  ttl?: number
): Promise<ApiResponse<T>> => {
  // Check cache first
  const cached = apiCache.get(key);
  if (cached) {
    return { data: cached, success: true };
  }
  
  // Fetch from API
  const result = await operation();
  if (result.success) {
    apiCache.set(key, result.data, ttl);
  }
  
  return result;
};
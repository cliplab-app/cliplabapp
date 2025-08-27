'use client';

import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Shield, 
  Users, 
  Crown, 
  TrendingUp, 
  DollarSign, 
  Eye,
  Heart,
  MessageCircle,
  Flag,
  Trash2,
  CheckCircle,
  XCircle,
  Award,
  Star,
  Flame
} from 'lucide-react';
import { Bounty, Submission, FeaturedClip, TopCreator } from '../App';

interface AdminPanelProps {
  bounties: Bounty[];
  submissions: Submission[];
  featuredClips: FeaturedClip[];
  topCreators: TopCreator[];
  onUpdateSubmissionStatus: (submissionId: string, status: Submission['status']) => void;
}

export function AdminPanel({ 
  bounties, 
  submissions, 
  featuredClips, 
  topCreators, 
  onUpdateSubmissionStatus 
}: AdminPanelProps) {
  const totalCreators = topCreators.filter(c => c.status !== 'Active').length;
  const totalClippers = topCreators.length;
  const totalBounties = bounties.length;
  const totalSubmissions = submissions.length;
  const totalPayouts = bounties.reduce((acc, b) => acc + b.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-gradient-primary">Admin Panel</h1>
          <p className="text-muted-foreground">Monitor platform activity and manage content</p>
        </div>
        
        <Badge className="bg-vibrant-red/20 text-vibrant-red border-vibrant-red/30 px-4 py-2">
          <Shield className="w-4 h-4 mr-2" />
          Administrator
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="card-3d gradient-primary text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Total Users</p>
              <p className="text-2xl">{totalCreators + totalClippers}</p>
            </div>
            <Users className="w-8 h-8 text-white/80" />
          </div>
        </Card>

        <Card className="card-3d bg-vibrant-purple/10 border-vibrant-purple/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Creators</p>
              <p className="text-2xl text-vibrant-purple">{totalCreators}</p>
            </div>
            <Crown className="w-8 h-8 text-vibrant-purple" />
          </div>
        </Card>

        <Card className="card-3d bg-vibrant-blue/10 border-vibrant-blue/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Clippers</p>
              <p className="text-2xl text-vibrant-blue">{totalClippers}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-vibrant-blue" />
          </div>
        </Card>

        <Card className="card-3d bg-vibrant-green/10 border-vibrant-green/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Bounties</p>
              <p className="text-2xl text-vibrant-green">{totalBounties}</p>
            </div>
            <Award className="w-8 h-8 text-vibrant-green" />
          </div>
        </Card>

        <Card className="card-3d bg-vibrant-orange/10 border-vibrant-orange/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Payouts</p>
              <p className="text-2xl text-vibrant-orange">${totalPayouts.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-vibrant-orange" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="submissions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="bounties">Bounties</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Featured Content</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="space-y-6">
          <div className="space-y-4">
            {submissions.map((submission) => {
              const bounty = bounties.find(b => b.id === submission.bountyId);
              return (
                <Card key={submission.id} className="card-3d backdrop-blur-glass border-vibrant-blue/20 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-16 h-12 bg-vibrant-blue/20 rounded flex items-center justify-center">
                          <Eye className="w-4 h-4 text-vibrant-blue" />
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-1">{bounty?.title}</h3>
                          <p className="text-sm text-muted-foreground">By: {submission.clipperUsername}</p>
                          <p className="text-sm text-muted-foreground">{submission.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span>Submitted: {submission.submittedAt.toLocaleDateString()}</span>
                            {submission.youtubeData && (
                              <>
                                <div className="flex items-center space-x-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{(submission.youtubeData.views / 1000000).toFixed(1)}M</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Heart className="w-4 h-4" />
                                  <span>{(submission.youtubeData.likes / 1000).toFixed(0)}K</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={`${
                        submission.status === 'winner-1st' ? 'bg-vibrant-green/20 text-vibrant-green border-vibrant-green/30' :
                        submission.status === 'winner-2nd' ? 'bg-vibrant-blue/20 text-vibrant-blue border-vibrant-blue/30' :
                        submission.status === 'winner-3rd' ? 'bg-vibrant-orange/20 text-vibrant-orange border-vibrant-orange/30' :
                        submission.status === 'approved' ? 'bg-vibrant-purple/20 text-vibrant-purple border-vibrant-purple/30' :
                        submission.status === 'rejected' ? 'bg-vibrant-red/20 text-vibrant-red border-vibrant-red/30' :
                        'bg-vibrant-yellow/20 text-vibrant-yellow border-vibrant-yellow/30'
                      }`}>
                        {submission.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateSubmissionStatus(submission.id, 'approved')}
                          className="border-vibrant-green/50 text-vibrant-green hover:bg-vibrant-green/10"
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateSubmissionStatus(submission.id, 'rejected')}
                          className="border-vibrant-red/50 text-vibrant-red hover:bg-vibrant-red/10"
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-vibrant-orange/50 text-vibrant-orange hover:bg-vibrant-orange/10"
                        >
                          <Flag className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="bounties" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bounties.map((bounty) => (
              <Card key={bounty.id} className="card-3d backdrop-blur-glass border-vibrant-blue/20 p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg">{bounty.title}</h3>
                        {bounty.featured && (
                          <Badge className="bg-vibrant-red/20 text-vibrant-red border-vibrant-red/30">
                            <Flame className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{bounty.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Created: {bounty.createdAt.toLocaleDateString()}</span>
                        <span>Deadline: {bounty.deadline.toLocaleDateString()}</span>
                        <span>{bounty.submissions.length} submissions</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className="bg-vibrant-green/20 text-vibrant-green border-vibrant-green/30">
                        ${bounty.amount}
                      </Badge>
                      <Badge className={`${
                        bounty.status === 'active' ? 'bg-vibrant-blue/20 text-vibrant-blue border-vibrant-blue/30' :
                        bounty.status === 'completed' ? 'bg-vibrant-green/20 text-vibrant-green border-vibrant-green/30' :
                        'bg-vibrant-red/20 text-vibrant-red border-vibrant-red/30'
                      }`}>
                        {bounty.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {bounty.hashtags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-vibrant-blue/50 text-vibrant-blue">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-vibrant-orange/50 text-vibrant-orange hover:bg-vibrant-orange/10"
                    >
                      <Flag className="w-3 h-3 mr-1" />
                      Flag
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-vibrant-red/50 text-vibrant-red hover:bg-vibrant-red/10"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCreators.map((creator) => (
              <Card key={creator.id} className="card-3d backdrop-blur-glass border-vibrant-blue/20 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={creator.avatar} 
                    alt={creator.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="mb-1">{creator.username}</h3>
                    <Badge className={`${
                      creator.status === 'Legend' ? 'bg-vibrant-yellow/20 text-vibrant-yellow border-vibrant-yellow/30' :
                      creator.status === 'Elite' ? 'bg-vibrant-purple/20 text-vibrant-purple border-vibrant-purple/30' :
                      creator.status === 'Hot Streak' ? 'bg-vibrant-red/20 text-vibrant-red border-vibrant-red/30' :
                      'bg-vibrant-blue/20 text-vibrant-blue border-vibrant-blue/30'
                    }`}>
                      {creator.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Earnings:</span>
                    <span className="text-vibrant-green">${creator.totalEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level:</span>
                    <span>{creator.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clips:</span>
                    <span>{creator.clipsCreated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Streak:</span>
                    <span>{creator.streak} days</span>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-vibrant-blue/20">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-vibrant-orange/50 text-vibrant-orange hover:bg-vibrant-orange/10"
                  >
                    <Flag className="w-3 h-3 mr-1" />
                    Flag
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-vibrant-red/50 text-vibrant-red hover:bg-vibrant-red/10"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Ban
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredClips.map((clip) => (
              <Card key={clip.id} className="card-3d backdrop-blur-glass border-vibrant-blue/20 overflow-hidden">
                <div className="relative">
                  <img 
                    src={clip.thumbnail} 
                    alt={clip.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {clip.viral && (
                    <Badge className="absolute top-2 left-2 bg-vibrant-red/90 text-white">
                      <Flame className="w-3 h-3 mr-1" />
                      VIRAL
                    </Badge>
                  )}
                  
                  <Badge className="absolute top-2 right-2 bg-vibrant-green/90 text-white">
                    ${clip.earnings}
                  </Badge>
                </div>
                
                <div className="p-4">
                  <Badge variant="outline" className="border-vibrant-purple/50 text-vibrant-purple mb-2">
                    {clip.category}
                  </Badge>
                  <h3 className="mb-2 line-clamp-2">{clip.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{clip.creator}</p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{(clip.views / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{(clip.likes / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-vibrant-orange/50 text-vibrant-orange hover:bg-vibrant-orange/10"
                    >
                      <Flag className="w-3 h-3 mr-1" />
                      Flag
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-vibrant-red/50 text-vibrant-red hover:bg-vibrant-red/10"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
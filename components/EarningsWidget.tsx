import React from 'react';
import { TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

type EarningsData = {
  totalEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  weeklyGoal: number;
  monthlyGoal: number;
  streak: number;
  rank: number;
  topPercentile: number;
};

type EarningsWidgetProps = {
  data: EarningsData;
  className?: string;
};

export function EarningsWidget({ data, className }: EarningsWidgetProps) {
  const weeklyProgress = (data.weeklyEarnings / data.weeklyGoal) * 100;
  const monthlyProgress = (data.monthlyEarnings / data.monthlyGoal) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Total Earnings Card */}
      <Card className="card-3d gradient-primary text-white p-6 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Total Earnings</p>
              <motion.h3 
                className="text-3xl font-bold"
                key={data.totalEarnings}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {formatCurrency(data.totalEarnings)}
              </motion.h3>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-none">
              <TrendingUp className="w-3 h-3 mr-1" />
              Rank #{data.rank}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-none">
              Top {data.topPercentile}%
            </Badge>
          </div>
        </div>
      </Card>

      {/* Weekly Progress */}
      <Card className="card-3d p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-vibrant-blue" />
            <span className="font-medium">This Week</span>
          </div>
          <Badge 
            variant={weeklyProgress >= 100 ? "default" : "secondary"}
            className={weeklyProgress >= 100 ? "gradient-success text-white" : ""}
          >
            {weeklyProgress.toFixed(0)}%
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {formatCurrency(data.weeklyEarnings)} / {formatCurrency(data.weeklyGoal)}
            </span>
          </div>
          <Progress 
            value={Math.min(weeklyProgress, 100)} 
            className="h-2"
          />
        </div>
      </Card>

      {/* Monthly Progress */}
      <Card className="card-3d p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-vibrant-purple" />
            <span className="font-medium">This Month</span>
          </div>
          <Badge 
            variant={monthlyProgress >= 100 ? "default" : "secondary"}
            className={monthlyProgress >= 100 ? "gradient-success text-white" : ""}
          >
            {monthlyProgress.toFixed(0)}%
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {formatCurrency(data.monthlyEarnings)} / {formatCurrency(data.monthlyGoal)}
            </span>
          </div>
          <Progress 
            value={Math.min(monthlyProgress, 100)} 
            className="h-2"
          />
        </div>
      </Card>

      {/* Streak Counter */}
      <Card className="card-3d p-4 gradient-accent text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Winning Streak</p>
            <motion.p 
              className="text-2xl font-bold"
              key={data.streak}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {data.streak} days
            </motion.p>
          </div>
          <div className="text-4xl opacity-50">🔥</div>
        </div>
      </Card>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  CreditCard,
  Banknote,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Download,
  Settings,
  Plus,
  Edit3,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Wallet,
  Building,
  UserCheck
} from 'lucide-react';
import { User, Submission } from '../App';

interface ClipperEarningsProps {
  user: User;
  userSubmissions: Submission[];
}

interface BankAccount {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  isDefault: boolean;
  isVerified: boolean;
  addedAt: Date;
}

interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  submissionIds: string[];
  requestedAt: Date;
  processedAt?: Date;
  bankAccountId: string;
  method: 'bank_transfer' | 'paypal' | 'stripe';
}

export function ClipperEarnings({ user, userSubmissions }: ClipperEarningsProps) {
  const [showAddBankAccount, setShowAddBankAccount] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [newBankAccount, setNewBankAccount] = useState({
    accountName: '',
    bankName: '',
    accountNumber: '',
    routingNumber: ''
  });

  // Mock data for bank accounts and payouts
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      accountName: 'John Doe',
      bankName: 'Chase Bank',
      accountNumber: '****1234',
      routingNumber: '****5678',
      isDefault: true,
      isVerified: true,
      addedAt: new Date('2025-06-15')
    }
  ]);

  const [payouts, setPayouts] = useState<Payout[]>([
    {
      id: '1',
      amount: 450,
      status: 'completed',
      submissionIds: ['1', '2'],
      requestedAt: new Date('2025-07-28'),
      processedAt: new Date('2025-07-30'),
      bankAccountId: '1',
      method: 'bank_transfer'
    },
    {
      id: '2',
      amount: 320,
      status: 'processing',
      submissionIds: ['3'],
      requestedAt: new Date('2025-08-01'),
      bankAccountId: '1',
      method: 'bank_transfer'
    },
    {
      id: '3',
      amount: 180,
      status: 'pending',
      submissionIds: ['4'],
      requestedAt: new Date('2025-08-03'),
      bankAccountId: '1',
      method: 'bank_transfer'
    }
  ]);

  // Calculate earnings data
  const totalEarnings = user.totalEarnings || 0;
  const availableBalance = userSubmissions
    .filter(s => s.status.includes('winner') || s.status === 'approved')
    .reduce((total, sub) => total + 50, 0) - payouts.reduce((total, p) => total + (p.status === 'completed' ? p.amount : 0), 0);
  
  const pendingPayouts = payouts.filter(p => p.status === 'pending' || p.status === 'processing');
  const completedPayouts = payouts.filter(p => p.status === 'completed');

  // Mock monthly earnings data
  const monthlyEarnings = [
    { month: 'Jan', amount: 280 },
    { month: 'Feb', amount: 420 },
    { month: 'Mar', amount: 380 },
    { month: 'Apr', amount: 650 },
    { month: 'May', amount: 580 },
    { month: 'Jun', amount: 720 },
    { month: 'Jul', amount: 890 }
  ];

  const handleAddBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      accountName: newBankAccount.accountName,
      bankName: newBankAccount.bankName,
      accountNumber: `****${newBankAccount.accountNumber.slice(-4)}`,
      routingNumber: `****${newBankAccount.routingNumber.slice(-4)}`,
      isDefault: bankAccounts.length === 0,
      isVerified: false,
      addedAt: new Date()
    };
    
    setBankAccounts(prev => [...prev, newAccount]);
    setNewBankAccount({ accountName: '', bankName: '', accountNumber: '', routingNumber: '' });
    setShowAddBankAccount(false);
  };

  const handleRequestPayout = () => {
    if (availableBalance > 0) {
      const newPayout: Payout = {
        id: Date.now().toString(),
        amount: availableBalance,
        status: 'pending',
        submissionIds: userSubmissions
          .filter(s => s.status.includes('winner') || s.status === 'approved')
          .map(s => s.id),
        requestedAt: new Date(),
        bankAccountId: bankAccounts.find(b => b.isDefault)?.id || bankAccounts[0]?.id,
        method: 'bank_transfer'
      };
      
      setPayouts(prev => [newPayout, ...prev]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'processing': return Clock;
      case 'pending': return AlertTriangle;
      case 'failed': return AlertTriangle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'status-approved';
      case 'processing': return 'status-pending';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-retro-display text-3xl mb-2">EARNINGS</h1>
          <p className="text-muted-foreground">Manage your payments, bank accounts, and analyze your earnings</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            onClick={handleRequestPayout}
            disabled={availableBalance <= 0}
            className="btn-primary"
          >
            <Wallet className="w-4 h-4 mr-2" />
            REQUEST PAYOUT
          </Button>
          
          <Dialog open={showAddBankAccount} onOpenChange={setShowAddBankAccount}>
            <DialogTrigger asChild>
              <Button variant="outline" className="btn-secondary-cyan">
                <Plus className="w-4 h-4 mr-2" />
                ADD BANK
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-retro-display text-xl">ADD BANK ACCOUNT</DialogTitle>
                <DialogDescription>
                  Add a new bank account for receiving payouts securely.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAddBankAccount} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName">ACCOUNT HOLDER NAME</Label>
                  <Input
                    id="accountName"
                    value={newBankAccount.accountName}
                    onChange={(e) => setNewBankAccount(prev => ({ ...prev, accountName: e.target.value }))}
                    placeholder="John Doe"
                    required
                    className="input-retro"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankName">BANK NAME</Label>
                  <Input
                    id="bankName"
                    value={newBankAccount.bankName}
                    onChange={(e) => setNewBankAccount(prev => ({ ...prev, bankName: e.target.value }))}
                    placeholder="Chase Bank"
                    required
                    className="input-retro"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">ACCOUNT NUMBER</Label>
                    <Input
                      id="accountNumber"
                      type="password"
                      value={newBankAccount.accountNumber}
                      onChange={(e) => setNewBankAccount(prev => ({ ...prev, accountNumber: e.target.value }))}
                      placeholder="Account Number"
                      required
                      className="input-retro"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="routingNumber">ROUTING NUMBER</Label>
                    <Input
                      id="routingNumber"
                      value={newBankAccount.routingNumber}
                      onChange={(e) => setNewBankAccount(prev => ({ ...prev, routingNumber: e.target.value }))}
                      placeholder="Routing Number"
                      required
                      className="input-retro"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full btn-primary">
                  ADD BANK ACCOUNT
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="window-card p-6 bg-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm">TOTAL EARNED</p>
              <p className="text-2xl">${totalEarnings.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-primary-foreground/80" />
          </div>
        </Card>

        <Card className="window-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Available Balance</p>
              <p className="text-2xl text-status-approved">${availableBalance.toLocaleString()}</p>
            </div>
            <Wallet className="w-8 h-8 text-status-approved" />
          </div>
        </Card>

        <Card className="window-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Pending Payouts</p>
              <p className="text-2xl text-status-pending">{pendingPayouts.length}</p>
            </div>
            <Clock className="w-8 h-8 text-status-pending" />
          </div>
        </Card>

        <Card className="window-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">This Month</p>
              <p className="text-2xl text-primary">${monthlyEarnings[monthlyEarnings.length - 1]?.amount || 0}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="payouts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="payouts" className="space-y-6">
          {/* Available Balance Card */}
          <Card className="window-card p-6 bg-status-approved/5 border-status-approved/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-retro-display text-lg mb-2">AVAILABLE BALANCE</h3>
                <div className="text-3xl text-status-approved mb-2">${availableBalance.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">
                  Ready to withdraw • Minimum payout: $50
                </p>
              </div>
              <Button 
                onClick={handleRequestPayout}
                disabled={availableBalance < 50}
                className="btn-primary px-8"
              >
                <Wallet className="w-4 h-4 mr-2" />
                REQUEST PAYOUT
              </Button>
            </div>
          </Card>

          {/* Payout History */}
          <Card className="window-card p-0">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-retro-display text-lg">PAYOUT HISTORY</h3>
                  <p className="text-sm text-muted-foreground">Track your payment requests and status</p>
                </div>
                <Button variant="outline" className="btn-secondary-cyan">
                  <Download className="w-4 h-4 mr-2" />
                  EXPORT CSV
                </Button>
              </div>
            </div>
            
            <div className="divide-y divide-border">
              {payouts.map((payout) => {
                const StatusIcon = getStatusIcon(payout.status);
                const bankAccount = bankAccounts.find(b => b.id === payout.bankAccountId);
                
                return (
                  <div key={payout.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                          payout.status === 'completed' ? 'bg-status-approved/20 border-status-approved' :
                          payout.status === 'processing' ? 'bg-status-pending/20 border-status-pending' :
                          payout.status === 'failed' ? 'bg-status-rejected/20 border-status-rejected' :
                          'bg-status-pending/20 border-status-pending'
                        }`}>
                          <StatusIcon className={`w-5 h-5 ${
                            payout.status === 'completed' ? 'text-status-approved' :
                            payout.status === 'processing' ? 'text-status-pending' :
                            payout.status === 'failed' ? 'text-status-rejected' :
                            'text-status-pending'
                          }`} />
                        </div>
                        
                        <div>
                          <div className="text-retro-display text-lg">${payout.amount.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {bankAccount?.bankName} • {bankAccount?.accountNumber}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Requested: {payout.requestedAt.toLocaleDateString()}
                            {payout.processedAt && ` • Processed: ${payout.processedAt.toLocaleDateString()}`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge className={`px-3 py-2 ${getStatusColor(payout.status)}`}>
                          {payout.status.toUpperCase()}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-2">
                          {payout.submissionIds.length} submission(s)
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Timeframe Selector */}
          <div className="flex items-center justify-between">
            <h3 className="text-retro-display text-lg">EARNINGS ANALYTICS</h3>
            <Select value={selectedTimeframe} onValueChange={(value: 'week' | 'month' | 'year') => setSelectedTimeframe(value)}>
              <SelectTrigger className="w-32 input-retro">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Earnings Chart */}
          <Card className="window-card p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-retro-display">MONTHLY EARNINGS TREND</h4>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <ArrowUpRight className="w-4 h-4 text-status-approved" />
                  <span>+23% vs last period</span>
                </div>
              </div>
              
              <div className="h-64 flex items-end justify-between space-x-2">
                {monthlyEarnings.map((data, index) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center space-y-2">
                    <div 
                      className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary-alt"
                      style={{ height: `${(data.amount / Math.max(...monthlyEarnings.map(d => d.amount))) * 200}px` }}
                    />
                    <div className="text-xs text-muted-foreground">{data.month}</div>
                    <div className="text-xs text-retro-mono">${data.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Performance Metrics */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="window-card p-6">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-retro-display text-lg">89%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </Card>
            
            <Card className="window-card p-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-secondary" />
                <div>
                  <div className="text-retro-display text-lg">$156</div>
                  <div className="text-sm text-muted-foreground">Avg Per Win</div>
                </div>
              </div>
            </Card>
            
            <Card className="window-card p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-secondary-alt" />
                <div>
                  <div className="text-retro-display text-lg">12</div>
                  <div className="text-sm text-muted-foreground">Days Avg Payout</div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-retro-display text-lg">BANK ACCOUNTS</h3>
              <p className="text-sm text-muted-foreground">Manage your payout methods</p>
            </div>
            <Button onClick={() => setShowAddBankAccount(true)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              ADD ACCOUNT
            </Button>
          </div>

          <div className="space-y-4">
            {bankAccounts.map((account) => (
              <Card key={account.id} className="window-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Building className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div>
                      <div className="text-retro-display">{account.bankName}</div>
                      <div className="text-sm text-muted-foreground">
                        {account.accountName} • {account.accountNumber}
                      </div>
                      <div className="flex items-center space-x-3 mt-1">
                        {account.isDefault && (
                          <Badge className="status-approved px-2 py-1 text-xs">DEFAULT</Badge>
                        )}
                        {account.isVerified ? (
                          <Badge className="status-approved px-2 py-1 text-xs">
                            <UserCheck className="w-3 h-3 mr-1" />
                            VERIFIED
                          </Badge>
                        ) : (
                          <Badge className="status-pending px-2 py-1 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            PENDING
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="btn-secondary-cyan">
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive hover:text-white">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {bankAccounts.length === 0 && (
            <Card className="window-card p-12 text-center">
              <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl mb-2">No Bank Accounts Added</h3>
              <p className="text-muted-foreground mb-6">Add a bank account to start receiving payouts</p>
              <Button onClick={() => setShowAddBankAccount(true)} className="btn-primary">
                Add Your First Account
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
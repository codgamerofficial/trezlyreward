
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { differenceInDays, addDays, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type InvestmentPlan = {
  id: string;
  name: string;
  investment: number;
  dailyIncome: number;
  duration: number;
  totalReturn: number;
  color: string;
  purchaseDate: string;
};

const barColors = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f', '#ffbb28'
];

export default function DashboardPage() {
  const [investment, setInvestment] = useState<InvestmentPlan | null>(null);
  const [earnings, setEarnings] = useState(0);
  const [daysPassed, setDaysPassed] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    const storedInvestment = localStorage.getItem('userInvestment');
    if (storedInvestment) {
      const parsedInvestment: InvestmentPlan = JSON.parse(storedInvestment);
      setInvestment(parsedInvestment);

      const purchaseDate = new Date(parsedInvestment.purchaseDate);
      const now = new Date();
      let passed = differenceInDays(now, purchaseDate);
      if (passed < 0) passed = 0;
      if (passed > parsedInvestment.duration) passed = parsedInvestment.duration;
      
      setDaysPassed(passed);
      const calculatedEarnings = passed * parsedInvestment.dailyIncome;
      setEarnings(calculatedEarnings);

      const data = Array.from({ length: parsedInvestment.duration }, (_, i) => {
        const date = addDays(purchaseDate, i);
        const isFuture = i >= passed;
        return {
          name: format(date, 'MMM d'),
          earnings: isFuture ? 0 : parsedInvestment.dailyIncome,
          projected: parsedInvestment.dailyIncome,
        };
      });
      setChartData(data);
    }
  }, []);

  const handleWithdraw = () => {
    if (!upiId) {
      toast({
        title: 'Validation Error',
        description: 'Please enter your UPI ID or bank details.',
        variant: 'destructive',
      });
      return;
    }
    // In a real app, this would trigger a payout process.
    toast({
      title: 'Withdrawal Initiated',
      description: `Your earnings of ₹${earnings.toLocaleString()} will be processed to ${upiId}.`,
    });
    localStorage.removeItem('userInvestment');
    setInvestment(null);
    setEarnings(0);
    toast({
        title: 'Earnings Withdrawn',
        description: 'Your investment has been reset. You can now choose a new plan.',
    });
    router.push('/invest');
  };

  if (!investment) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">No Active Investment</CardTitle>
            <CardDescription>You haven't invested in any plan yet. Explore our plans to start earning.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/invest" className="w-full">
              <Button className="w-full">Explore Plans</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const progressPercentage = (daysPassed / investment.duration) * 100;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary">Your Investment Dashboard</h1>
        <p className="mt-2 text-md sm:text-lg text-muted-foreground">
          Track your earnings and see your investment grow.
        </p>
      </div>
      
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Current Plan: <span style={{ color: investment.color }}>{investment.name}</span></CardTitle>
          <CardDescription>
            Invested ₹{investment.investment.toLocaleString()} on {format(new Date(investment.purchaseDate), 'PPP')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Total Earned</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-3xl sm:text-4xl font-bold font-mono text-accent">₹{earnings.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Projected Return</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-3xl sm:text-4xl font-bold font-mono">₹{investment.totalReturn.toLocaleString()}</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Daily Income</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-3xl sm:text-4xl font-bold font-mono">₹{investment.dailyIncome.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>
          <div>
            <div className="flex justify-between mb-2 text-sm font-medium">
              <span>Progress</span>
              <span>Day {daysPassed} of {investment.duration}</span>
            </div>
            <Progress value={progressPercentage} className="h-4" style={{'--primary': investment.color} as React.CSSProperties} />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Start Date: {format(new Date(investment.purchaseDate), 'PP')}</span>
              <span>End Date: {format(addDays(new Date(investment.purchaseDate), investment.duration), 'PP')}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg" disabled={earnings <= 0}>
                Withdraw Earnings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Withdraw Earnings</DialogTitle>
                <DialogDescription>
                  Enter your bank account or UPI details to withdraw your earnings of ₹{earnings.toLocaleString()}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="upi" className="text-right">
                    UPI / Bank
                  </Label>
                  <Input
                    id="upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" onClick={handleWithdraw}>
                  Initiate Withdrawal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Earnings Chart</CardTitle>
          <CardDescription>Daily earnings projection over the investment period.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))'
                }}
              />
              <Legend />
              <Bar dataKey="earnings" stackId="a" fill={investment.color} name="Earned" />
              <Bar dataKey="projected" stackId="a" fill="hsl(var(--muted))" name="Projected" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

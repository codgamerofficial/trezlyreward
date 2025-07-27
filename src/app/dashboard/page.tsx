
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { differenceInDays, addDays, format } from 'date-fns';

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

  if (!investment) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Card className="max-w-md">
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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline text-primary">Your Investment Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Track your earnings and see your investment grow.
        </p>
      </div>
      
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle>Current Plan: <span style={{ color: investment.color }}>{investment.name}</span></CardTitle>
          <CardDescription>
            Invested ₹{investment.investment.toLocaleString()} on {format(new Date(investment.purchaseDate), 'PPP')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold font-mono text-accent">₹{earnings.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Projected Return</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold font-mono">₹{investment.totalReturn.toLocaleString()}</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="text-xl">Daily Income</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold font-mono">₹{investment.dailyIncome.toLocaleString()}</p>
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
              <XAxis dataKey="name" />
              <YAxis />
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

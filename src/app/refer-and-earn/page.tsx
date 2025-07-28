
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Gift, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const referralData = [
    { id: 1, friend: 'user_a@example.com', status: 'Joined', earnings: '₹50' },
    { id: 2, friend: 'user_b@example.com', status: 'Invested', earnings: '₹250' },
    { id: 3, friend: 'user_c@example.com', status: 'Joined', earnings: '₹50' },
];

export default function ReferAndEarnPage() {
  const [user, setUser] = useState<User | null>(null);
  const [referralCode, setReferralCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const code = `TREAZLY-${user.id.substring(0, 8).toUpperCase()}`;
        setReferralCode(code);
      } else {
        router.push('/login');
      }
    };
    fetchUser();
  }, [router, supabase]);

  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/login?ref=${referralCode}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    toast({ title: 'Referral link copied to clipboard!' });
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on Treazly!',
        text: `Join me on Treazly and let's earn together. Use my referral code: ${referralCode}`,
        url: referralLink,
      }).catch(error => console.error('Error sharing:', error));
    } else {
      handleCopy();
      toast({ description: "Your browser doesn't support direct sharing. Link copied instead." });
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-[80vh]">Loading...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center gap-3">
          <Gift className="w-10 h-10" />
          Refer & Earn
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Invite your friends to Treazly and earn rewards when they join and invest.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link with your friends. You'll earn when they sign up and make their first investment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input value={referralLink} readOnly />
            <Button onClick={handleCopy} size="icon" variant="outline">
              {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button onClick={handleShare} size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
         <CardFooter className="flex flex-col sm:flex-row gap-4 items-start text-center">
            <div className="p-4 bg-background rounded-lg border flex-1 w-full">
                <p className="text-sm text-muted-foreground">Friends Joined</p>
                <p className="text-2xl font-bold font-mono">3</p>
            </div>
             <div className="p-4 bg-background rounded-lg border flex-1 w-full">
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold font-mono text-accent">₹350</p>
            </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>Track the status of your referrals and earnings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Friend</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referralData.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell className="font-medium">{referral.friend}</TableCell>
                  <TableCell>
                    <Badge variant={referral.status === 'Invested' ? 'default' : 'secondary'}>
                      {referral.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-accent">{referral.earnings}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}

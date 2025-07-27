'use client';

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from './ui/button';
import {useToast} from '@/hooks/use-toast';
import {useRouter} from 'next/navigation';

type InvestmentPlan = {
  id: string;
  name: string;
  investment: number;
  dailyIncome: number;
  duration: number;
  totalReturn: number;
  color: string;
};

declare const Razorpay: any;

export function InvestmentPlanCard(plan: InvestmentPlan) {
  const { name, investment, dailyIncome, duration, totalReturn, color } = plan;
  const {toast} = useToast();
  const router = useRouter();

  const handleInvest = async () => {
    // In a real app, you would fetch an order_id from your backend
    // For now, we simulate this.
    
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY, // Enter the Key ID generated from the Dashboard
      amount: investment * 100, // Amount is in currency subunits. Default currency is INR.
      currency: "INR",
      name: "Treazly Inc.",
      description: `Invest in ${name}`,
      image: "https://placehold.co/100x100.png",
      //order_id: "order_9A33XG45g34gkh", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: function (response: any){
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);

        const investmentData = {
          ...plan,
          purchaseDate: new Date().toISOString(),
          paymentId: response.razorpay_payment_id,
        };
        localStorage.setItem('userInvestment', JSON.stringify(investmentData));
        toast({
          title: 'Investment Successful!',
          description: `You have invested in the ${name}.`,
        });
        router.push('/dashboard');
      },
      prefill: {
          name: "PixelPioneer",
          email: "pioneer@example.com",
          contact: "9999999999"
      },
      notes: {
          address: "Treazly Corporate Office"
      },
      theme: {
          color: "#3399cc"
      }
    };

    if (typeof Razorpay === 'undefined') {
      toast({
        title: 'Razorpay not loaded',
        description: 'Please check your internet connection and try again.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!process.env.NEXT_PUBLIC_RAZORPAY_API_KEY) {
      toast({
        title: 'Razorpay Key not configured',
        description: 'The Razorpay API key is missing.',
        variant: 'destructive',
      });
      return;
    }

    const rzp1 = new Razorpay(options);

    rzp1.on('payment.failed', function (response: any){
      // alert(response.error.code);
      // alert(response.error.description);
      // alert(response.error.source);
      // alert(response.error.step);
      // alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);
      toast({
        title: 'Payment Failed',
        description: response.error.description,
        variant: 'destructive',
      });
    });

    rzp1.open();
  };

  return (
    <Card className="group overflow-hidden border-2 transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300" style={{'--plan-color': color, borderColor: 'var(--plan-color)', boxShadow: `0 0 20px -5px var(--plan-color)`} as React.CSSProperties}>
      <CardHeader className="p-4" style={{ background: `linear-gradient(135deg, oklch(from var(--plan-color) l c h / 0.2), oklch(from var(--plan-color) l c h / 0.05))`}}>
        <CardTitle className="font-headline text-2xl" style={{color: 'var(--plan-color)'}}>{name}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
            <p className="text-sm text-muted-foreground">Investment</p>
            <p className="text-4xl font-bold font-mono" style={{color: 'var(--plan-color)'}}>₹{investment.toLocaleString()}</p>
        </div>
        <div className="flex justify-between text-center">
            <div>
                <p className="text-sm text-muted-foreground">Daily Income</p>
                <p className="text-lg font-semibold font-mono">₹{dailyIncome.toLocaleString()}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-lg font-semibold font-mono">{duration} days</p>
            </div>
        </div>
        <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Return</p>
            <p className="text-2xl font-bold font-mono text-accent">₹{totalReturn.toLocaleString()}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" style={{backgroundColor: 'var(--plan-color)', color: 'black'}} onClick={handleInvest}>Invest Now</Button>
      </CardFooter>
    </Card>
  );
}
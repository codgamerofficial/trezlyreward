import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from './ui/button';

type InvestmentPlanCardProps = {
  name: string;
  investment: number;
  dailyIncome: number;
  duration: number;
  totalReturn: number;
  color: string;
};

export function InvestmentPlanCard({
  name,
  investment,
  dailyIncome,
  duration,
  totalReturn,
  color,
}: InvestmentPlanCardProps) {
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
        <Button className="w-full" style={{backgroundColor: 'var(--plan-color)', color: 'black'}}>Invest Now</Button>
      </CardFooter>
    </Card>
  );
}

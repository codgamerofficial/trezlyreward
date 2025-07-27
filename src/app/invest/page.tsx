import {InvestmentPlanCard} from '@/components/investment-plan-card';

const investmentPlans = [
  {
    id: '1',
    name: 'Starter Plan',
    investment: 300,
    dailyIncome: 40,
    duration: 15,
    totalReturn: 300 * 1.5,
    color: 'hsl(140, 70%, 60%)',
  },
  {
    id: '2',
    name: 'Bronze Plan',
    investment: 600,
    dailyIncome: 40,
    duration: 30,
    totalReturn: 600 * 2,
    color: 'hsl(30, 70%, 60%)',
  },
  {
    id: '3',
    name: 'Silver Plan',
    investment: 1000,
    dailyIncome: 40,
    duration: 60,
    totalReturn: 1000 * 2.5,
    color: 'hsl(210, 20%, 70%)',
  },
  {
    id: '4',
    name: 'Gold Plan',
    investment: 2000,
    dailyIncome: 40,
    duration: 100,
    totalReturn: 2000 * 3,
    color: 'hsl(50, 80%, 60%)',
  },
  {
    id: '5',
    name: 'Platinum Plan',
    investment: 5000,
    dailyIncome: 50,
    duration: 200,
    totalReturn: 5000 * 4,
    color: 'hsl(220, 40%, 80%)',
  },
  {
    id: '6',
    name: 'Diamond Plan',
    investment: 10000,
    dailyIncome: 100,
    duration: 200,
    totalReturn: 10000 * 5,
    color: 'hsl(180, 80%, 80%)',
  },
];

export default function InvestPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-4xl font-bold font-headline text-primary">
          Investment Plans
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Choose a plan to start earning passive income from NFTs.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {investmentPlans.map(plan => (
          <InvestmentPlanCard key={plan.id} {...plan} />
        ))}
      </div>
    </div>
  );
}

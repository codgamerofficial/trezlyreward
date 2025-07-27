
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpRight, ArrowDownRight, Briefcase, DollarSign, LineChart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type Asset = {
  id: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  logoUrl: string;
};

type PortfolioAsset = {
  assetId: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
};

const cryptoAssets: Asset[] = [
  { id: 'BTC', name: 'Bitcoin', price: 68000, change24h: 2.5, volume24h: 35000000000, logoUrl: 'https://placehold.co/40x40.png' },
  { id: 'ETH', name: 'Ethereum', price: 3500, change24h: -1.2, volume24h: 18000000000, logoUrl: 'https://placehold.co/40x40.png' },
  { id: 'SOL', name: 'Solana', price: 150, change24h: 5.1, volume24h: 2500000000, logoUrl: 'https://placehold.co/40x40.png' },
];

const stockAssets: Asset[] = [
  { id: 'AAPL', name: 'Apple Inc.', price: 215, change24h: 1.8, volume24h: 90000000, logoUrl: 'https://placehold.co/40x40.png' },
  { id: 'GOOGL', name: 'Alphabet Inc.', price: 180, change24h: -0.5, volume24h: 25000000, logoUrl: 'https://placehold.co/40x40.png' },
  { id: 'TSLA', name: 'Tesla, Inc.', price: 185, change24h: 3.2, volume24h: 85000000, logoUrl: 'https://placehold.co/40x40.png' },
];

export default function TradingPage() {
  const [cashBalance, setCashBalance] = useState(10000); // Initial virtual cash
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedBalance = localStorage.getItem('virtualCashBalance');
    const savedPortfolio = localStorage.getItem('virtualPortfolio');
    if (savedBalance) setCashBalance(JSON.parse(savedBalance));
    if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));
  }, []);

  useEffect(() => {
    localStorage.setItem('virtualCashBalance', JSON.stringify(cashBalance));
    localStorage.setItem('virtualPortfolio', JSON.stringify(portfolio));
  }, [cashBalance, portfolio]);
  
  const handleTradeClick = (asset: Asset, action: 'buy' | 'sell') => {
    setSelectedAsset(asset);
    setTradeAction(action);
    setIsDialogOpen(true);
  };

  const executeTrade = () => {
    if (!selectedAsset || !tradeAmount) return;

    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid amount", variant: 'destructive' });
      return;
    }
    
    const tradeValue = amount * selectedAsset.price;
    const existingAsset = portfolio.find(a => a.assetId === selectedAsset.id);

    if (tradeAction === 'buy') {
      if (tradeValue > cashBalance) {
        toast({ title: "Insufficient funds", description: "You don't have enough virtual cash to make this purchase.", variant: 'destructive' });
        return;
      }
      setCashBalance(prev => prev - tradeValue);
      if (existingAsset) {
        const newAvgPrice = ((existingAsset.avgBuyPrice * existingAsset.quantity) + tradeValue) / (existingAsset.quantity + amount);
        setPortfolio(portfolio.map(a => a.assetId === selectedAsset.id ? { ...a, quantity: a.quantity + amount, avgBuyPrice: newAvgPrice } : a));
      } else {
        setPortfolio([...portfolio, { assetId: selectedAsset.id, name: selectedAsset.name, quantity: amount, avgBuyPrice: selectedAsset.price }]);
      }
      toast({ title: "Purchase Successful", description: `Bought ${amount} of ${selectedAsset.name}` });
    } else { // Sell
      if (!existingAsset || amount > existingAsset.quantity) {
        toast({ title: "Insufficient assets", description: `You don't own enough ${selectedAsset.name} to sell.`, variant: 'destructive' });
        return;
      }
      setCashBalance(prev => prev + tradeValue);
      if (amount === existingAsset.quantity) {
        setPortfolio(portfolio.filter(a => a.assetId !== selectedAsset.id));
      } else {
        setPortfolio(portfolio.map(a => a.assetId === selectedAsset.id ? { ...a, quantity: a.quantity - amount } : a));
      }
      toast({ title: "Sale Successful", description: `Sold ${amount} of ${selectedAsset.name}` });
    }
    
    setTradeAmount('');
    setIsDialogOpen(false);
  };
  
  const portfolioValue = portfolio.reduce((total, asset) => {
    const currentAsset = [...cryptoAssets, ...stockAssets].find(a => a.id === asset.assetId);
    return total + (currentAsset ? currentAsset.price * asset.quantity : 0);
  }, 0);

  const totalValue = cashBalance + portfolioValue;

  const renderAssetList = (assets: Asset[]) => (
    <div className="space-y-4">
      {assets.map(asset => (
        <Card key={asset.id} className="p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={asset.logoUrl} alt={asset.name} className="w-10 h-10" />
              <div>
                <p className="font-bold sm:text-lg">{asset.name} ({asset.id})</p>
                <p className="text-sm font-mono sm:text-base">
                  ${asset.price.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold flex items-center justify-end ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {asset.change24h >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {asset.change24h.toFixed(2)}%
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Vol: ${(asset.volume24h/1_000_000_000).toFixed(2)}B</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={() => handleTradeClick(asset, 'buy')} className="flex-1 bg-green-600 hover:bg-green-700">Buy</Button>
            <Button size="sm" variant="destructive" onClick={() => handleTradeClick(asset, 'sell')} className="flex-1">Sell</Button>
          </div>
        </Card>
      ))}
    </div>
  );
  
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-4xl font-bold font-headline text-primary">
          Virtual Trading Floor
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Practice your trading skills with zero risk.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Portfolio</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
             <div className="p-3 bg-primary/20 rounded-lg"><DollarSign className="w-6 h-6 text-primary"/></div>
            <div>
              <p className="text-muted-foreground">Cash Balance</p>
              <p className="text-xl md:text-2xl font-bold">${cashBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
            <div className="p-3 bg-accent/20 rounded-lg"><Briefcase className="w-6 h-6 text-accent"/></div>
            <div>
              <p className="text-muted-foreground">Portfolio Value</p>
              <p className="text-xl md:text-2xl font-bold">${portfolioValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-background rounded-lg border lg:col-span-1 sm:col-span-2">
            <div className="p-3 bg-secondary rounded-lg"><LineChart className="w-6 h-6 text-secondary-foreground"/></div>
            <div>
              <p className="text-muted-foreground">Total Net Worth</p>
              <p className="text-xl md:text-2xl font-bold">${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
          </div>
        </CardContent>
         {portfolio.length > 0 && (
          <CardFooter className="flex-col items-start pt-4">
            <Separator className="mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your Assets</h3>
            <div className="w-full space-y-2">
                {portfolio.map(asset => {
                    const currentAssetData = [...cryptoAssets, ...stockAssets].find(a => a.id === asset.assetId);
                    return (
                        <div key={asset.assetId} className="flex flex-wrap gap-2 justify-between items-center p-2 bg-background rounded-md border">
                            <div>
                                <p className="font-bold">{asset.name} ({asset.assetId})</p>
                                <p className="text-sm text-muted-foreground">
                                    Qty: {asset.quantity.toLocaleString()} @ avg ${asset.avgBuyPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => currentAssetData && handleTradeClick(currentAssetData, 'sell')}>
                                Trade
                            </Button>
                        </div>
                    )
                })}
            </div>
          </CardFooter>
        )}
      </Card>

      <Tabs defaultValue="crypto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
        </TabsList>
        <TabsContent value="crypto" className="mt-4">
          {renderAssetList(cryptoAssets)}
        </TabsContent>
        <TabsContent value="stocks" className="mt-4">
          {renderAssetList(stockAssets)}
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="capitalize">{tradeAction} {selectedAsset?.name}</DialogTitle>
                <DialogDescription>
                  Current Price: ${selectedAsset?.price.toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Quantity
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    placeholder="e.g., 1.5"
                    className="col-span-3"
                  />
                </div>
                <div className="text-right col-span-4 font-mono">
                    Total: ${(parseFloat(tradeAmount || '0') * (selectedAsset?.price || 0)).toLocaleString()}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button 
                    type="submit" 
                    onClick={executeTrade}
                    className={tradeAction === 'buy' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  Confirm {tradeAction.charAt(0).toUpperCase() + tradeAction.slice(1)}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

    </div>
  );
}

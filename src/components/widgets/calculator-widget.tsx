'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CalculatorWidget() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (value: string) => {
    if (value === '=') {
      try {
        // Using Function constructor for safe evaluation
        const evalResult = new Function('return ' + input)();
        setResult(String(evalResult));
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === 'DEL') {
      setInput(prev => prev.slice(0, -1));
    }
    else {
      setInput(prev => prev + value);
    }
  };

  const buttons = [
    'C', '(', ')', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '=', 'DEL'
  ];

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            readOnly
            value={input}
            placeholder="0"
            className="text-right text-lg font-mono h-10"
          />
          <Input
            type="text"
            readOnly
            value={result}
            placeholder="Result"
            className="text-right text-2xl font-mono font-bold h-12"
          />
          <div className="grid grid-cols-4 gap-2 mt-2">
            {buttons.map(btn => (
              <Button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                variant={
                  ['=', '+', '-', '*', '/'].includes(btn) ? 'default' :
                  btn === 'C' || btn === 'DEL' ? 'destructive' : 'secondary'
                }
                className="text-lg"
              >
                {btn}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

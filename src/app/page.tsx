import {NftCard} from '@/components/nft-card';
import { CalculatorWidget } from '@/components/widgets/calculator-widget';
import { CalendarWidget } from '@/components/widgets/calendar-widget';
import { ClockWidget } from '@/components/widgets/clock-widget';
import { NewsWidget } from '@/components/widgets/news-widget';
import { WeatherWidget } from '@/components/widgets/weather-widget';

const trendingNfts = [
  {
    id: '1',
    name: 'Cybernetic Oracle',
    creator: '0x...a1b2',
    price: '1.5 ETH',
    imageUrl: 'https://placehold.co/400x400.png',
    aiHint: 'cyberpunk oracle',
  },
  {
    id: '2',
    name: 'Aetheric Golem',
    creator: 'Neuromancer',
    price: '3.2 ETH',
    imageUrl: 'https://placehold.co/400x400.png',
    aiHint: 'fantasy golem',
  },
  {
    id: '3',
    name: 'Neon Wanderer',
    creator: 'SynthwaveArtist',
    price: '0.8 ETH',
    imageUrl: 'https://placehold.co/400x400.png',
    aiHint: 'neon wanderer',
  },
  {
    id: '4',
    name: 'Chrono-Shard',
    creator: 'TimeKeeper',
    price: '5.0 ETH',
    imageUrl: 'https://placehold.co/400x400.png',
    aiHint: 'time crystal',
  },
  {
    id: '5',
    name: 'Forest Sprite',
    creator: 'FaeRealm',
    price: '1.1 ETH',
    imageUrl: 'https://placehold.co/400x400.png',
    aiHint: 'fantasy sprite',
  },
  {
    id: '6',
    name: 'Quantum Serpent',
    creator: '0x...c3d4',
    price: '2.7 ETH',
    imageUrl: 'https://placehold.co/400x400.png',
    aiHint: 'quantum snake',
  },
  {
    id: '7',
    name: 'Void Runner',
    creator: 'Starlight',
    price: '0.95 ETH',
    imageUrl: 'https://placehold.co/400x400.png',
    aiHint: 'space runner',
  },
  {
    id: '8',
    name: 'Glimmering Idol',
    creator: 'Ancient-One',
    price: '4.2 ETH',
    imageUrl: 'https://placehold.co/400x400.png',
    aiHint: 'ancient idol',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <ClockWidget />
        <WeatherWidget />
        <NewsWidget />
        <CalendarWidget />
        <CalculatorWidget />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trendingNfts.map((nft, index) => (
          <NftCard key={nft.id} {...nft} priority={index < 4} />
        ))}
      </div>
    </div>
  );
}

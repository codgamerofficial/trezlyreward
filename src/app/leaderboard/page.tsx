import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Card} from '@/components/ui/card';

const leaderboardData = [
  {
    id: 1,
    name: 'PixelPioneer',
    wallet: '0x1234...5678',
    avatarUrl: 'https://placehold.co/100x100.png',
    aiHint: 'avatar abstract',
    volume: '15.8',
    nfts: 87,
    badge: 'Top 1%',
  },
  {
    id: 2,
    name: 'Neuromancer',
    wallet: '0xabcd...ef12',
    avatarUrl: 'https://placehold.co/100x100.png',
    aiHint: 'avatar punk',
    volume: '12.5',
    nfts: 64,
  },
  {
    id: 3,
    name: 'SynthwaveArtist',
    wallet: '0x9876...fedc',
    avatarUrl: 'https://placehold.co/100x100.png',
    aiHint: 'avatar synthwave',
    volume: '11.2',
    nfts: 128,
    badge: 'Rising Star',
  },
  {
    id: 4,
    name: 'FaeRealm',
    wallet: '0x5432...10fe',
    avatarUrl: 'https://placehold.co/100x100.png',
    aiHint: 'avatar fantasy',
    volume: '9.8',
    nfts: 72,
  },
  {
    id: 5,
    name: 'Starlight',
    wallet: '0xcafe...babe',
    avatarUrl: 'https://placehold.co/100x100.png',
    aiHint: 'avatar space',
    volume: '8.1',
    nfts: 99,
  },
  {
    id: 6,
    name: 'Ancient-One',
    wallet: '0xdead...beef',
    avatarUrl: 'https://placehold.co/100x100.png',
    aiHint: 'avatar ancient',
    volume: '7.5',
    nfts: 42,
  },
];

export default function LeaderboardPage() {
  return (
    <div className="w-full">
      <p className="mb-6 text-muted-foreground">
        Top collectors and creators on the platform. Can you make it to the top?
      </p>
      <Card className="bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-right">NFTs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="font-bold text-xl text-primary">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={user.avatarUrl}
                        alt={user.name}
                        data-ai-hint={user.aiHint}
                      />
                      <AvatarFallback>
                        {user.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold font-headline">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.wallet}
                      </p>
                    </div>
                    {user.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-accent/20 text-accent border-accent/30"
                      >
                        {user.badge}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {user.volume} ETH
                </TableCell>
                <TableCell className="text-right font-mono">{user.nfts}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

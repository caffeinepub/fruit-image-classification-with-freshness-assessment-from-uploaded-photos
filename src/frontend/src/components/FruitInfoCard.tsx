import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Leaf, Thermometer, Clock } from 'lucide-react';
import { getFruitInfo } from '../lib/fruitInfo';

interface FruitInfoCardProps {
  fruitType: string;
}

export default function FruitInfoCard({ fruitType }: FruitInfoCardProps) {
  const info = getFruitInfo(fruitType);

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5 text-accent" />
          Fruit Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg capitalize mb-2">{info.name}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {info.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Leaf className="w-4 h-4 text-primary" />
              <span>Varieties</span>
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              {info.varieties}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Thermometer className="w-4 h-4 text-primary" />
              <span>Storage</span>
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              {info.storage}
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-primary" />
              <span>Ripeness Indicators</span>
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              {info.ripenessIndicators}
            </p>
          </div>
        </div>

        {info.taste && (
          <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Taste Profile:</span>{' '}
              <span className="text-muted-foreground">{info.taste}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

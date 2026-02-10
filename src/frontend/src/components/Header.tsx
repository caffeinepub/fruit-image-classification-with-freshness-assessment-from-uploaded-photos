import { Apple } from 'lucide-react';
import AuthBar from './AuthBar';

export default function Header() {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Apple className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">FreshCheck</h1>
              <p className="text-xs text-muted-foreground">Fruit Freshness Analyzer</p>
            </div>
          </div>
          
          <AuthBar />
        </div>
      </div>
    </header>
  );
}

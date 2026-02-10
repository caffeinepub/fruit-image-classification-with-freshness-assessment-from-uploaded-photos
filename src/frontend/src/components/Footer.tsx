import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-card/30 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1.5">
            © 2026. Built with <Heart className="w-3.5 h-3.5 text-destructive fill-destructive" /> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

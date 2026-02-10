import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Droplets, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { AnalysisResult } from '../lib/imageAnalysis';

interface ResultsPanelProps {
  result: AnalysisResult;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const getFreshnessColor = (category: string) => {
    switch (category) {
      case 'Fresh':
        return 'bg-success/10 text-success border-success/20';
      case 'Ripe':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Overripe':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Spoiled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getFreshnessIcon = (category: string) => {
    switch (category) {
      case 'Fresh':
        return <Sparkles className="w-4 h-4" />;
      case 'Ripe':
        return <Droplets className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fruit Classification */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Detected Fruit</h3>
            <Badge variant="outline" className="text-sm">
              {result.confidence}% confidence
            </Badge>
          </div>
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-2xl font-bold text-primary capitalize">
              {result.fruitType}
            </p>
          </div>
        </div>

        {/* Freshness Assessment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Freshness Assessment</h3>
            <Badge variant="outline" className="text-sm">
              {result.freshnessConfidence}% confidence
            </Badge>
          </div>
          <div className={`p-4 border rounded-lg ${getFreshnessColor(result.freshnessCategory)}`}>
            <div className="flex items-center gap-2 mb-2">
              {getFreshnessIcon(result.freshnessCategory)}
              <p className="text-lg font-bold">{result.freshnessCategory}</p>
            </div>
            <p className="text-sm opacity-90">
              {result.freshnessExplanation}
            </p>
          </div>
        </div>

        {/* Collapsible Details Section */}
        <div className="border-t pt-4">
          <Button
            variant="ghost"
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            className="w-full justify-between hover:bg-muted/50"
            aria-expanded={isDetailsExpanded}
            aria-controls="analysis-details"
          >
            <span className="text-sm font-medium">How we decided</span>
            {isDetailsExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>

          {isDetailsExpanded && (
            <div
              id="analysis-details"
              className="mt-4 space-y-3 animate-fade-in"
            >
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <span className="text-sm font-medium text-muted-foreground">Fruit Classification</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Detected Type</span>
                  <span className="text-sm font-semibold capitalize">{result.fruitType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Confidence Level</span>
                  <Badge variant="secondary" className="text-xs">
                    {result.confidence}%
                  </Badge>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <span className="text-sm font-medium text-muted-foreground">Freshness Analysis</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Freshness Score</span>
                  <span className="text-sm font-semibold">{result.freshnessScore}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Confidence Level</span>
                  <Badge variant="secondary" className="text-xs">
                    {result.freshnessConfidence}%
                  </Badge>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <span className="text-xs text-muted-foreground block mb-1">Analysis Details</span>
                  <p className="text-sm">{result.freshnessExplanation}</p>
                </div>
              </div>

              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  💡 Our analysis uses advanced color pattern recognition and visual feature extraction to assess fruit type and quality.
                </p>
              </div>
            </div>
          )}
        </div>

        {result.freshnessCategory === 'Unknown' && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 Tip: Try uploading a clearer image with better lighting for more accurate results.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

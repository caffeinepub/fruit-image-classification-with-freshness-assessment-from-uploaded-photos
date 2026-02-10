import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Save, Loader2, Trash2, LogIn, Clock } from 'lucide-react';
import { useSaveAnalysisResult, useGetHistory, useClearHistory } from '../hooks/useQueries';
import type { AnalysisResult } from '../lib/imageAnalysis';
import { toast } from 'sonner';
import { resultEntryToAnalysisResult } from '../hooks/useQueries';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface HistoryPanelProps {
  analysisResult: AnalysisResult | null;
  isAuthenticated: boolean;
  onSelectHistoryEntry: (result: AnalysisResult) => void;
}

export default function HistoryPanel({ analysisResult, isAuthenticated, onSelectHistoryEntry }: HistoryPanelProps) {
  const { data: history, isLoading: historyLoading } = useGetHistory();
  const saveResult = useSaveAnalysisResult();
  const clearHistory = useClearHistory();

  const handleSave = async () => {
    if (!analysisResult) return;

    try {
      await saveResult.mutateAsync({
        fruit: analysisResult.fruitType,
        confidence: analysisResult.confidence,
        freshnessScore: analysisResult.freshnessScore,
        freshnessConfidence: analysisResult.freshnessConfidence,
      });
      toast.success('Analysis saved to history!');
    } catch (error) {
      toast.error('Failed to save analysis. Please try again.');
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearHistory.mutateAsync();
      toast.success('History cleared successfully!');
    } catch (error) {
      toast.error('Failed to clear history. Please try again.');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFreshnessLabel = (score: number): string => {
    if (score >= 80) return 'Fresh';
    if (score >= 60) return 'Ripe';
    if (score >= 40) return 'Overripe';
    return 'Spoiled';
  };

  const getFreshnessColor = (score: number): string => {
    if (score >= 80) return 'bg-success/10 text-success border-success/20';
    if (score >= 60) return 'bg-primary/10 text-primary border-primary/20';
    if (score >= 40) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-destructive/10 text-destructive border-destructive/20';
  };

  if (!isAuthenticated) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
              <LogIn className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Login Required</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Sign in to save your analysis results and view your history
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            History
          </CardTitle>
          {history && history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear History?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your saved analysis results. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearHistory}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear History
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {analysisResult && (
          <Button
            onClick={handleSave}
            disabled={saveResult.isPending}
            className="w-full"
            variant="outline"
          >
            {saveResult.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Current Analysis
              </>
            )}
          </Button>
        )}

        {historyLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !history || history.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <Clock className="w-12 h-12 mx-auto text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No saved analyses yet</p>
            <p className="text-xs text-muted-foreground">
              Analyze a fruit and save it to build your history
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {history.map((entry, index) => {
              const freshnessScore = Number(entry.freshnessScore);
              const freshnessLabel = getFreshnessLabel(freshnessScore);
              
              return (
                <button
                  key={index}
                  onClick={() => onSelectHistoryEntry(resultEntryToAnalysisResult(entry))}
                  className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary group"
                  aria-label={`View analysis for ${entry.fruit} from ${formatDate(entry.timestamp)}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold capitalize group-hover:text-primary transition-colors">
                      {entry.fruit}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getFreshnessColor(freshnessScore)}`}
                    >
                      {freshnessLabel}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(entry.timestamp)}
                    </span>
                    <span>{Number(entry.confidence)}% confidence</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

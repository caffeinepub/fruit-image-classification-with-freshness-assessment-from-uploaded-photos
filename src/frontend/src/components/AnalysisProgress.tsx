import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';

interface AnalysisStep {
  label: string;
  description: string;
}

interface AnalysisProgressProps {
  currentStep: number;
  status: 'active' | 'completed' | 'error';
  steps: AnalysisStep[];
}

export default function AnalysisProgress({ currentStep, status, steps }: AnalysisProgressProps) {
  const getStepIcon = (stepIndex: number) => {
    if (status === 'error' && stepIndex === currentStep) {
      return <XCircle className="w-5 h-5 text-destructive" />;
    }
    if (stepIndex < currentStep || status === 'completed') {
      return <CheckCircle2 className="w-5 h-5 text-success" />;
    }
    if (stepIndex === currentStep && status === 'active') {
      return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
    }
    return <Circle className="w-5 h-5 text-muted-foreground" />;
  };

  const getStepStatus = (stepIndex: number): 'completed' | 'active' | 'pending' | 'error' => {
    if (status === 'error' && stepIndex === currentStep) return 'error';
    if (stepIndex < currentStep || status === 'completed') return 'completed';
    if (stepIndex === currentStep && status === 'active') return 'active';
    return 'pending';
  };

  return (
    <Card className="shadow-soft border-primary/20 bg-primary/5">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Analysis in Progress</h3>
            {status === 'active' && (
              <Badge variant="outline" className="text-xs">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => {
              const stepStatus = getStepStatus(index);
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    stepStatus === 'active'
                      ? 'bg-primary/10 border border-primary/30'
                      : stepStatus === 'completed'
                        ? 'bg-success/5 border border-success/20'
                        : stepStatus === 'error'
                          ? 'bg-destructive/5 border border-destructive/20'
                          : 'bg-muted/50 border border-transparent'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">{getStepIcon(index)}</div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        stepStatus === 'active'
                          ? 'text-primary'
                          : stepStatus === 'completed'
                            ? 'text-success'
                            : stepStatus === 'error'
                              ? 'text-destructive'
                              : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {status === 'error' && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-xs text-destructive font-medium">
                Analysis failed. Please try again with a different image.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

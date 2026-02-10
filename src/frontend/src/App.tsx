import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import Header from './components/Header';
import Footer from './components/Footer';
import FruitImageUploader from './components/FruitImageUploader';
import ResultsPanel from './components/ResultsPanel';
import FruitInfoCard from './components/FruitInfoCard';
import HistoryPanel from './components/HistoryPanel';
import { analyzeImage } from './lib/imageAnalysis';
import type { AnalysisResult } from './lib/imageAnalysis';
import { useInternetIdentity } from './hooks/useInternetIdentity';

const ANALYSIS_STEPS = [
  { label: 'Loading Image', description: 'Processing image data...' },
  { label: 'Extracting Features', description: 'Analyzing color patterns and textures...' },
  { label: 'Classifying Fruit', description: 'Identifying fruit type...' },
  { label: 'Assessing Freshness', description: 'Evaluating ripeness and quality...' },
];

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState<'active' | 'completed' | 'error'>('active');
  const { identity } = useInternetIdentity();

  const handleFileSelect = (file: File, preview: string) => {
    setSelectedFile(file);
    setPreviewUrl(preview);
    setAnalysisResult(null);
    setError(null);
    setAnalysisStep(0);
    setAnalysisStatus('active');
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisStep(0);
    setAnalysisStatus('active');

    try {
      // Simulate step progression for better UX
      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        setAnalysisStep(i);
        await new Promise((resolve) => setTimeout(resolve, 400));
      }

      const result = await analyzeImage(previewUrl);
      setAnalysisResult(result);
      setAnalysisStatus('completed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again.');
      setAnalysisResult(null);
      setAnalysisStatus('error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
    setAnalysisStep(0);
    setAnalysisStatus('active');
  };

  const handleSelectHistoryEntry = (result: AnalysisResult) => {
    // Load history entry into active view without requiring upload
    setAnalysisResult(result);
    setError(null);
    // Clear upload state when viewing history
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisStep(0);
    setAnalysisStatus('completed');
  };

  const isAuthenticated = !!identity;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex flex-col bg-background relative">
        {/* Background pattern */}
        <div className="fixed inset-0 bg-pattern pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column: Upload and Analysis */}
              <div className="lg:col-span-2 space-y-6">
                <FruitImageUploader
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  previewUrl={previewUrl}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  onReset={handleReset}
                  analysisStep={analysisStep}
                  analysisStatus={analysisStatus}
                  analysisSteps={ANALYSIS_STEPS}
                />

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-fade-in">
                    <p className="text-destructive text-sm font-medium">{error}</p>
                  </div>
                )}

                {analysisResult && (
                  <>
                    <ResultsPanel result={analysisResult} />
                    <FruitInfoCard fruitType={analysisResult.fruitType} />
                  </>
                )}
              </div>

              {/* Right column: History */}
              <div className="lg:col-span-1">
                <HistoryPanel 
                  analysisResult={analysisResult}
                  isAuthenticated={isAuthenticated}
                  onSelectHistoryEntry={handleSelectHistoryEntry}
                />
              </div>
            </div>
          </main>

          <Footer />
        </div>
        
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

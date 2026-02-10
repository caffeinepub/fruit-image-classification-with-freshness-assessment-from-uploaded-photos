import { useCallback, useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AnalysisProgress from './AnalysisProgress';

interface AnalysisStep {
  label: string;
  description: string;
}

interface FruitImageUploaderProps {
  onFileSelect: (file: File, previewUrl: string) => void;
  selectedFile: File | null;
  previewUrl: string | null;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onReset: () => void;
  analysisStep: number;
  analysisStatus: 'active' | 'completed' | 'error';
  analysisSteps: AnalysisStep[];
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function FruitImageUploader({
  onFileSelect,
  selectedFile,
  previewUrl,
  onAnalyze,
  isAnalyzing,
  onReset,
  analysisStep,
  analysisStatus,
  analysisSteps,
}: FruitImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Please upload a JPG, PNG, or WebP image.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB.';
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    setError(null);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onFileSelect(file, result);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDropzoneClick = useCallback(() => {
    if (!selectedFile) {
      fileInputRef.current?.click();
    }
  }, [selectedFile]);

  // Handle paste events
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (selectedFile) return; // Only handle paste when no file is selected

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            handleFile(file);
            e.preventDefault();
          }
          break;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [selectedFile, handleFile]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card className="shadow-soft">
      <CardContent className="p-6">
        {!selectedFile ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleDropzoneClick}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}
            `}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <Upload className="w-10 h-10 text-muted-foreground" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Upload a fruit image</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Drag and drop, click anywhere, or paste (Ctrl/Cmd+V) your image
                </p>
              </div>

              <label htmlFor="file-upload" onClick={(e) => e.stopPropagation()}>
                <Button type="button" variant="outline" asChild>
                  <span className="cursor-pointer">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Choose Image
                  </span>
                </Button>
              </label>
              
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                onChange={handleFileInput}
                className="hidden"
              />

              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, WebP (max 10MB)
              </p>

              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-muted">
              <img
                src={previewUrl!}
                alt="Preview"
                className="w-full h-auto max-h-96 object-contain"
              />
              <Button
                onClick={onReset}
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-full"
                disabled={isAnalyzing}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3 min-w-0">
                <ImageIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
            </div>

            {isAnalyzing && (
              <AnalysisProgress
                currentStep={analysisStep}
                status={analysisStatus}
                steps={analysisSteps}
              />
            )}

            <Button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Fruit'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

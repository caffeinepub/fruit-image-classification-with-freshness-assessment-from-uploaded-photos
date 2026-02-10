export interface AnalysisResult {
  fruitType: string;
  confidence: number;
  freshnessCategory: string;
  freshnessScore: number;
  freshnessConfidence: number;
  freshnessExplanation: string;
}

interface ColorStats {
  avgRed: number;
  avgGreen: number;
  avgBlue: number;
  brightness: number;
  saturation: number;
  uniformity: number;
  darkSpotRatio: number;
}

/**
 * Analyzes an image and returns fruit classification and freshness assessment
 * All processing happens in the browser using canvas-based feature extraction
 */
export async function analyzeImage(imageUrl: string): Promise<AnalysisResult> {
  try {
    const colorStats = await extractColorFeatures(imageUrl);
    const fruitPrediction = classifyFruit(colorStats);
    const freshnessAssessment = assessFreshness(colorStats, fruitPrediction.type);

    return {
      fruitType: fruitPrediction.type,
      confidence: fruitPrediction.confidence,
      freshnessCategory: freshnessAssessment.category,
      freshnessScore: freshnessAssessment.score,
      freshnessConfidence: freshnessAssessment.confidence,
      freshnessExplanation: freshnessAssessment.explanation,
    };
  } catch (error) {
    throw new Error('Failed to analyze image. Please ensure the image is valid and try again.');
  }
}

/**
 * Extracts color-based features from an image using canvas
 */
async function extractColorFeatures(imageUrl: string): Promise<ColorStats> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Resize for faster processing
        const maxSize = 200;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let totalRed = 0, totalGreen = 0, totalBlue = 0;
        let totalBrightness = 0;
        let darkPixels = 0;
        const pixelCount = data.length / 4;

        // Calculate color statistics
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          totalRed += r;
          totalGreen += g;
          totalBlue += b;

          const brightness = (r + g + b) / 3;
          totalBrightness += brightness;

          if (brightness < 60) {
            darkPixels++;
          }
        }

        const avgRed = totalRed / pixelCount;
        const avgGreen = totalGreen / pixelCount;
        const avgBlue = totalBlue / pixelCount;
        const brightness = totalBrightness / pixelCount;

        // Calculate saturation
        const max = Math.max(avgRed, avgGreen, avgBlue);
        const min = Math.min(avgRed, avgGreen, avgBlue);
        const saturation = max === 0 ? 0 : ((max - min) / max) * 100;

        // Calculate color uniformity (inverse of variance)
        let variance = 0;
        for (let i = 0; i < data.length; i += 4) {
          const pixelBrightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          variance += Math.pow(pixelBrightness - brightness, 2);
        }
        const stdDev = Math.sqrt(variance / pixelCount);
        const uniformity = Math.max(0, 100 - (stdDev / 2.55));

        const darkSpotRatio = (darkPixels / pixelCount) * 100;

        resolve({
          avgRed,
          avgGreen,
          avgBlue,
          brightness,
          saturation,
          uniformity,
          darkSpotRatio,
        });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}

/**
 * Classifies fruit based on color features using heuristic rules
 */
function classifyFruit(stats: ColorStats): { type: string; confidence: number } {
  const { avgRed, avgGreen, avgBlue, saturation } = stats;

  // Normalize RGB values
  const total = avgRed + avgGreen + avgBlue;
  const redRatio = avgRed / total;
  const greenRatio = avgGreen / total;
  const blueRatio = avgBlue / total;

  // Heuristic classification based on dominant colors
  const scores: Record<string, number> = {
    apple: 0,
    banana: 0,
    orange: 0,
    strawberry: 0,
    grapes: 0,
    peach: 0,
    pear: 0,
    plum: 0,
  };

  // Red fruits (apple, strawberry)
  if (redRatio > 0.38 && saturation > 30) {
    scores.apple = 70 + (redRatio - 0.38) * 100;
    scores.strawberry = 65 + (redRatio - 0.38) * 80;
  }

  // Yellow fruits (banana, pear)
  if (redRatio > 0.36 && greenRatio > 0.36 && blueRatio < 0.30 && saturation > 25) {
    scores.banana = 75 + (greenRatio - 0.36) * 100;
    scores.pear = 60 + (greenRatio - 0.36) * 80;
  }

  // Orange fruits (orange, peach)
  if (redRatio > 0.37 && greenRatio > 0.34 && saturation > 35) {
    scores.orange = 80 + (redRatio - 0.37) * 120;
    scores.peach = 65 + (redRatio - 0.37) * 90;
  }

  // Purple/blue fruits (grapes, plum)
  if (blueRatio > 0.32 || (redRatio > 0.35 && blueRatio > 0.30)) {
    scores.grapes = 70 + (blueRatio - 0.30) * 100;
    scores.plum = 65 + (blueRatio - 0.30) * 90;
  }

  // Green fruits (pear, grapes)
  if (greenRatio > 0.37 && saturation > 20) {
    scores.pear = Math.max(scores.pear, 70 + (greenRatio - 0.37) * 100);
    scores.grapes = Math.max(scores.grapes, 60 + (greenRatio - 0.37) * 80);
  }

  // Find the fruit with highest score
  let maxScore = 0;
  let predictedFruit = 'apple';

  for (const [fruit, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      predictedFruit = fruit;
    }
  }

  // Ensure confidence is between 60-95%
  const confidence = Math.min(95, Math.max(60, Math.round(maxScore)));

  return { type: predictedFruit, confidence };
}

/**
 * Assesses freshness based on visual features
 */
function assessFreshness(
  stats: ColorStats,
  fruitType: string
): { category: string; score: number; confidence: number; explanation: string } {
  const { brightness, uniformity, darkSpotRatio, saturation } = stats;

  // Base freshness score
  let freshnessScore = 50;

  // High brightness indicates freshness
  if (brightness > 120) {
    freshnessScore += 20;
  } else if (brightness < 80) {
    freshnessScore -= 20;
  }

  // High uniformity indicates freshness
  if (uniformity > 70) {
    freshnessScore += 15;
  } else if (uniformity < 50) {
    freshnessScore -= 15;
  }

  // Dark spots indicate spoilage
  if (darkSpotRatio < 5) {
    freshnessScore += 15;
  } else if (darkSpotRatio > 15) {
    freshnessScore -= 25;
  }

  // Good saturation indicates ripeness
  if (saturation > 40) {
    freshnessScore += 10;
  } else if (saturation < 20) {
    freshnessScore -= 10;
  }

  // Clamp score between 0-100
  freshnessScore = Math.max(0, Math.min(100, freshnessScore));

  // Determine category
  let category: string;
  if (freshnessScore >= 80) {
    category = 'Fresh';
  } else if (freshnessScore >= 60) {
    category = 'Ripe';
  } else if (freshnessScore >= 40) {
    category = 'Overripe';
  } else if (freshnessScore >= 20) {
    category = 'Spoiled';
  } else {
    category = 'Unknown';
  }

  // Generate explanation
  const indicators: string[] = [];
  
  if (uniformity > 70) {
    indicators.push('uniform color distribution');
  } else if (uniformity < 50) {
    indicators.push('uneven coloring');
  }

  if (darkSpotRatio < 5) {
    indicators.push('minimal dark spots');
  } else if (darkSpotRatio > 15) {
    indicators.push('significant browning or dark spots');
  }

  if (brightness > 120) {
    indicators.push('bright appearance');
  } else if (brightness < 80) {
    indicators.push('dull appearance');
  }

  if (saturation > 40) {
    indicators.push('vibrant color');
  } else if (saturation < 20) {
    indicators.push('faded color');
  }

  const explanation = indicators.length > 0
    ? `Based on ${indicators.join(', ')}.`
    : 'Analysis based on overall visual characteristics.';

  // Confidence based on how clear the indicators are
  const confidence = Math.min(90, Math.max(65, 70 + Math.abs(freshnessScore - 50) / 2));

  return {
    category,
    score: Math.round(freshnessScore),
    confidence: Math.round(confidence),
    explanation,
  };
}

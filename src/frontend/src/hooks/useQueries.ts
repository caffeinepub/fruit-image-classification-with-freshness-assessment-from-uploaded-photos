import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { FruitType, type ResultEntry } from '../backend';
import type { AnalysisResult } from '../lib/imageAnalysis';

interface SaveAnalysisParams {
  fruit: string;
  confidence: number;
  freshnessScore: number;
  freshnessConfidence: number;
}

// Map string fruit names to FruitType enum
function mapFruitType(fruit: string): FruitType {
  const fruitMap: Record<string, FruitType> = {
    apple: FruitType.apple,
    banana: FruitType.banana,
    orange: FruitType.orange,
    strawberry: FruitType.strawberry,
    grapes: FruitType.grapes,
    peach: FruitType.peach,
    pear: FruitType.pear,
    plum: FruitType.plum,
  };
  return fruitMap[fruit.toLowerCase()] || FruitType.apple;
}

// Convert backend ResultEntry to frontend AnalysisResult
export function resultEntryToAnalysisResult(entry: ResultEntry): AnalysisResult {
  const freshnessScore = Number(entry.freshnessScore);
  
  // Determine freshness category based on score
  let freshnessCategory: string;
  if (freshnessScore >= 80) {
    freshnessCategory = 'Fresh';
  } else if (freshnessScore >= 60) {
    freshnessCategory = 'Ripe';
  } else if (freshnessScore >= 40) {
    freshnessCategory = 'Overripe';
  } else {
    freshnessCategory = 'Spoiled';
  }

  // Generate explanation based on score
  const freshnessExplanation = `Freshness score of ${freshnessScore}/100 indicates ${freshnessCategory.toLowerCase()} quality.`;

  return {
    fruitType: entry.fruit,
    confidence: Number(entry.confidence),
    freshnessCategory,
    freshnessScore,
    freshnessConfidence: Number(entry.freshnessConfidence),
    freshnessExplanation,
  };
}

export function useGetHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<ResultEntry[]>({
    queryKey: ['history'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveAnalysisResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SaveAnalysisParams) => {
      if (!actor) throw new Error('Actor not available');
      
      const fruitType = mapFruitType(params.fruit);
      
      await actor.saveAnalysisResult(
        fruitType,
        BigInt(params.confidence),
        BigInt(params.freshnessScore),
        BigInt(params.freshnessConfidence)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}

export function useClearHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Clear local cache - backend doesn't have a clear method yet
      queryClient.setQueryData(['history'], []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}

import prisma from "./prisma";

export interface MatchResult {
  diseaseId: string;
  name: string;
  confidence: number;
  matched_symptoms: string[];
  explanation: string;
  severityLevel: string;
}

export async function matchSymptoms(inputSymptomNames: string[]): Promise<MatchResult[]> {
  if (!inputSymptomNames || inputSymptomNames.length === 0) {
    return [];
  }

  // Normalize input symptoms: trim and convert to lowercase
  const normalizedInputs = inputSymptomNames.map((s) => s.trim().toLowerCase());

  // Fetch all diseases with their symptoms from the database
  const diseases = await prisma.disease.findMany({
    include: {
      symptoms: {
        include: {
          symptom: true,
        },
      },
    },
  });

  const results: MatchResult[] = diseases.map((disease) => {
    const diseaseSymptoms = disease.symptoms;
    const diseaseSymptomNames = diseaseSymptoms.map((ds) => ds.symptom.name.toLowerCase());
    
    // Find matching symptoms
    const matched: string[] = [];
    let matchedWeightSum = 0;
    let totalDiseaseWeightSum = 0;

    diseaseSymptoms.forEach((ds) => {
      const nameLower = ds.symptom.name.toLowerCase();
      totalDiseaseWeightSum += ds.frequencyWeight;
      
      // Check if user's input matches this symptom name
      const isMatched = normalizedInputs.some(
        (input) => input === nameLower || nameLower.includes(input) || input.includes(nameLower)
      );

      if (isMatched) {
        matched.push(ds.symptom.name);
        matchedWeightSum += ds.frequencyWeight;
      }
    });

    // Calculate base score: sum of matched weights / sum of total weights
    let baseScore = totalDiseaseWeightSum > 0 ? matchedWeightSum / totalDiseaseWeightSum : 0;

    // Calculate penalty for input symptoms that do not match this disease
    // This prevents a user who selects 20 symptoms from matching every disease with a high score
    let unmatchedInputsCount = 0;
    normalizedInputs.forEach((input) => {
      const isFoundInDisease = diseaseSymptomNames.some(
        (dsName) => dsName === input || dsName.includes(input) || input.includes(dsName)
      );
      if (!isFoundInDisease) {
        unmatchedInputsCount++;
      }
    });

    // Apply a penalty (e.g. 5% penalty per unmatched input, max 50% penalty)
    const penaltyRate = Math.min(0.5, unmatchedInputsCount * 0.05);
    const finalScore = baseScore * (1 - penaltyRate);
    
    // Convert to percentage confidence (0-100)
    let confidence = Math.round(finalScore * 100);

    // Boost confidence slightly if key high-weight symptoms match
    if (matched.length > 0 && confidence < 10) {
      confidence = 10; // Provide at least a baseline score if there's any match
    }

    // Generate educational explanation
    const matchPercent = Math.round((matched.length / diseaseSymptoms.length) * 100);
    const explanation = `Matches ${matched.length} out of ${diseaseSymptoms.length} typical symptoms (${matchPercent}%) for ${disease.name}. Significant matches include: ${matched.join(", ")}.`;

    return {
      diseaseId: disease.id,
      name: disease.name,
      confidence: Math.max(0, Math.min(100, confidence)),
      matched_symptoms: matched,
      explanation,
      severityLevel: disease.severityLevel,
    };
  });

  // Filter out diseases with 0% confidence and sort by confidence (descending)
  return results
    .filter((r) => r.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence);
}

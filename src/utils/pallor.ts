import type { PallorAnalysis } from '../data/types';
import { pallorThresholds } from '../data/medical';

// Offline client-side colorimetry analysis
// Processes RGB pixel data from image ROI (Region of Interest)
// and computes Redness Saturation Ratio and Erythema Index

export function analyzePallor(
  pixelData: Uint8ClampedArray | number[],
  totalPixels: number
): PallorAnalysis {
  let totalRed = 0;
  let totalGreen = 0;
  let totalBlue = 0;
  let totalSaturation = 0;
  let totalBrightness = 0;
  let processedPixels = 0;

  // Sample every 4th pixel for performance (skip alpha channel)
  const stride = 4;
  const step = stride * 1; // Check every pixel, but consider downsampling for large images

  for (let i = 0; i + 3 < pixelData.length; i += step) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];
    // Skip transparent or near-black pixels (background/noise)
    if (r < 10 && g < 10 && b < 10) continue;
    // Skip white/bright pixels (reflections/specular highlights)
    if (r > 240 && g > 240 && b > 240) continue;

    const sum = r + g + b;
    if (sum === 0) continue;

    totalRed += r;
    totalGreen += g;
    totalBlue += b;

    // HSV saturation calculation
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const brightness = max / 255;
    const saturation = max === 0 ? 0 : delta / max;

    totalSaturation += saturation;
    totalBrightness += brightness;
    processedPixels++;
  }

  if (processedPixels === 0) {
    return {
      redRatio: 0,
      avgSaturation: 0,
      avgBrightness: 0,
      totalPixels: 0,
      pallorLevel: 'normal',
      rednessIndex: 0,
      resultText: 'No valid pixels found. Please retake photo under better lighting.',
    };
  }

  const avgRed = totalRed / processedPixels;
  const avgGreen = totalGreen / processedPixels;
  const avgBlue = totalBlue / processedPixels;
  const avgSum = avgRed + avgGreen + avgBlue;

  // Redness Saturation Ratio: R / (R + G + B)
  const redRatio = avgRed / avgSum;

  // Erythema Index: normalized measure of red dominance
  // Higher = more red/healthy, lower = more pale
  const rednessIndex = ((avgRed - Math.max(avgGreen, avgBlue)) / avgSum) * 100;

  const avgSaturation = totalSaturation / processedPixels;
  const avgBrightness = totalBrightness / processedPixels;

  // Determine pallor level based on R_Ratio thresholds
  let pallorLevel: PallorAnalysis['pallorLevel'] = 'normal';
  if (redRatio < pallorThresholds.moderate) {
    pallorLevel = 'severe';
  } else if (redRatio < pallorThresholds.mild) {
    pallorLevel = 'moderate';
  } else if (redRatio < pallorThresholds.normal) {
    pallorLevel = 'mild';
  }

  const resultText =
    pallorLevel === 'normal'
      ? 'Normal Tissue Pigmentation Detected'
      : 'Significant Pallor / Pale Redness Index Detected';

  return {
    redRatio,
    avgSaturation,
    avgBrightness,
    totalPixels: processedPixels,
    pallorLevel,
    rednessIndex,
    resultText,
  };
}

// Convert pallor level to numeric score (0-1)
export function pallorLevelToScore(level: PallorAnalysis['pallorLevel']): number {
  switch (level) {
    case 'normal': return 0;
    case 'mild': return 0.33;
    case 'moderate': return 0.66;
    case 'severe': return 1.0;
    default: return 0;
  }
}

// Calculate weighted symptom risk index (0-1)
export interface SymptomAnswers {
  nausea: number;
  dizziness: number;
  fatigue: number;
  paleSkin: number;
  breathlessness: number;
  heavyBleeding: number;
  chestPain: boolean;
  fainting: boolean;
  extremeBreathlessness: boolean;
}

import { symptomWeights, maxSymptomScore } from '../data/medical';

export function calculateSymptomRisk(answers: SymptomAnswers): number {
  let score = 0;
  for (const sw of symptomWeights) {
    const val = (answers as unknown as Record<string, number | boolean>)[sw.key];
    if (typeof val === 'number') {
      score += sw.weight * (val / 3); // normalize 0-3 to 0-1
    }
  }
  return Math.min(score / maxSymptomScore, 1.0);
}

export function hasSevereSymptoms(answers: SymptomAnswers): boolean {
  return answers.chestPain || answers.fainting || answers.extremeBreathlessness;
}

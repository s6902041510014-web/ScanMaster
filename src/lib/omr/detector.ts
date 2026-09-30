import { Exam } from "@/types";
import { getGridConfig } from "@/lib/omr/gridConfig";

export interface BubbleSample {
  x: number;
  y: number;
  radius: number;
  darkPixels: number;
  totalPixels: number;
  fillRatio: number;
  isFilled: boolean;
}

export interface DetectedGrid {
  studentIdMatrix: BubbleSample[][]; // 8 columns x 10 rows (digits 0-9)
  answerMatrix: BubbleSample[][];    // totalQuestions rows x choicesPerQuestion columns
}

/**
 * Samples pixel intensity within circular bubble regions
 */
function sampleCircularBubble(
  data: Uint8ClampedArray,
  canvasW: number,
  canvasH: number,
  centerX: number,
  centerY: number,
  radius: number
): BubbleSample {
  const r = Math.round(radius);
  const cx = Math.round(centerX);
  const cy = Math.round(centerY);

  let darkCount = 0;
  let totalCount = 0;

  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy <= r * r) {
        const px = cx + dx;
        const py = cy + dy;

        if (px >= 0 && px < canvasW && py >= 0 && py < canvasH) {
          const idx = (py * canvasW + px) * 4;
          const red = data[idx];
          const green = data[idx + 1];
          const blue = data[idx + 2];
          // Grayscale luminance
          const luma = 0.299 * red + 0.587 * green + 0.114 * blue;

          // If pixel is sufficiently dark (pencil/pen mark)
          if (luma < 125) {
            darkCount++;
          }
          totalCount++;
        }
      }
    }
  }

  const fillRatio = totalCount > 0 ? darkCount / totalCount : 0;
  // Threshold: >= 40% dark pixels inside radius denotes a filled bubble
  const isFilled = fillRatio >= 0.40;

  return {
    x: cx,
    y: cy,
    radius: r,
    darkPixels: darkCount,
    totalPixels: totalCount,
    fillRatio,
    isFilled,
  };
}

export function detectBubbles(
  canvas: HTMLCanvasElement,
  exam: Exam
): DetectedGrid {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Unable to get 2D context");

  const w = canvas.width;  // e.g. 1000
  const h = canvas.height; // e.g. 1414
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const config = getGridConfig(exam.layoutId, exam.totalQuestions);

  // Conversion scale from mm to normalized canvas pixels (210mm x 297mm)
  const scaleX = w / config.pageWidth;
  const scaleY = h / config.pageHeight;

  // 1. Detect Student ID Matrix (8 columns x 10 rows)
  const idConfig = config.studentIdGrid;
  const studentIdMatrix: BubbleSample[][] = [];

  for (let col = 0; col < idConfig.columns; col++) {
    const colSamples: BubbleSample[] = [];
    for (let row = 0; row < idConfig.rows; row++) {
      const mmX = idConfig.x + col * idConfig.colSpacing + 2;
      const mmY = idConfig.y + 4 + row * idConfig.rowSpacing;
      const radiusMm = idConfig.bubbleRadius;

      const pxX = mmX * scaleX;
      const pxY = mmY * scaleY;
      const pxR = radiusMm * Math.min(scaleX, scaleY);

      const sample = sampleCircularBubble(data, w, h, pxX, pxY, pxR);
      colSamples.push(sample);
    }
    studentIdMatrix.push(colSamples);
  }

  // 2. Detect Answer Matrix (totalQuestions rows x choicesPerQuestion columns)
  const ansConfig = config.answerGrid;
  const answerMatrix: BubbleSample[][] = [];

  for (let q = 1; q <= exam.totalQuestions; q++) {
    const qRowSamples: BubbleSample[] = [];

    // Find which column on the sheet this question belongs to
    const colIdx = Math.floor((q - 1) / ansConfig.questionsPerCol);
    const qInCol = (q - 1) % ansConfig.questionsPerCol;

    const colStartX = ansConfig.x + colIdx * ansConfig.colWidth;
    const bubbleStartX = colStartX + 9;
    const mmY = ansConfig.y + 4 + qInCol * ansConfig.rowSpacing;

    for (let ch = 0; ch < exam.choicesPerQuestion; ch++) {
      const mmX = bubbleStartX + ch * ansConfig.bubbleSpacing;
      const radiusMm = ansConfig.bubbleRadius;

      const pxX = mmX * scaleX;
      const pxY = mmY * scaleY;
      const pxR = radiusMm * Math.min(scaleX, scaleY);

      const sample = sampleCircularBubble(data, w, h, pxX, pxY, pxR);
      qRowSamples.push(sample);
    }

    answerMatrix.push(qRowSamples);
  }

  return {
    studentIdMatrix,
    answerMatrix,
  };
}

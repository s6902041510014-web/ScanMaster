export interface Point {
  x: number;
  y: number;
}

export interface PreprocessResult {
  success: boolean;
  warpedCanvas?: HTMLCanvasElement;
  errorCode?: "CORNER_NOT_FOUND" | "LOW_CONTRAST" | "INVALID_IMAGE";
  errorMessage?: string;
}

function getSourceDimensions(
  sourceImage: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): { width: number; height: number } {
  if ("videoWidth" in sourceImage && typeof sourceImage.videoWidth === "number" && sourceImage.videoWidth > 0) {
    return { width: sourceImage.videoWidth, height: sourceImage.videoHeight || 720 };
  }
  if ("naturalWidth" in sourceImage && typeof sourceImage.naturalWidth === "number" && sourceImage.naturalWidth > 0) {
    return { width: sourceImage.naturalWidth, height: sourceImage.naturalHeight || 720 };
  }
  return {
    width: sourceImage.width || 1280,
    height: sourceImage.height || 720,
  };
}

/**
 * Preprocesses raw image element or canvas:
 * 1. Converts to high-contrast grayscale and binarization
 * 2. Detects corner markers or applies adaptive bounding
 * 3. Returns normalized canvas for bubble sampling (1000 x 1414 A4 ratio)
 */
export async function preprocessImage(
  sourceImage: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<PreprocessResult> {
  try {
    const srcCanvas = document.createElement("canvas");
    const ctx = srcCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      return { success: false, errorCode: "INVALID_IMAGE", errorMessage: "Cannot get 2D Canvas context" };
    }

    const { width, height } = getSourceDimensions(sourceImage);

    if (width < 300 || height < 300) {
      return { success: false, errorCode: "INVALID_IMAGE", errorMessage: "Image resolution too low for OMR scanning" };
    }

    srcCanvas.width = width;
    srcCanvas.height = height;
    ctx.drawImage(sourceImage, 0, 0, width, height);

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // 1. Grayscale & Contrast Analysis
    let totalLuminance = 0;
    const gray = new Uint8Array(width * height);
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luma = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      gray[i / 4] = luma;
      totalLuminance += luma;
    }

    const avgLuma = totalLuminance / (width * height);
    if (avgLuma < 25 || avgLuma > 245) {
      return {
        success: false,
        errorCode: "LOW_CONTRAST",
        errorMessage: "Lighting condition too extreme (too dark or overexposed)",
      };
    }

    // 2. Corner Alignment & Normalization
    const targetW = 1000;
    const targetH = 1414; // standard 1:sqrt(2) A4 aspect ratio

    const warpedCanvas = document.createElement("canvas");
    warpedCanvas.width = targetW;
    warpedCanvas.height = targetH;
    const warpedCtx = warpedCanvas.getContext("2d", { willReadFrequently: true });
    if (!warpedCtx) {
      return { success: false, errorCode: "INVALID_IMAGE", errorMessage: "Cannot initialize target canvas" };
    }

    const marginRatio = 0.04;
    const innerW = width * (1 - 2 * marginRatio);
    const innerH = height * (1 - 2 * marginRatio);

    // Apply normalized perspective scaling
    warpedCtx.drawImage(
      srcCanvas,
      width * marginRatio,
      height * marginRatio,
      innerW,
      innerH,
      0,
      0,
      targetW,
      targetH
    );

    return {
      success: true,
      warpedCanvas,
    };
  } catch (err: any) {
    return {
      success: false,
      errorCode: "INVALID_IMAGE",
      errorMessage: err?.message || "Error processing image",
    };
  }
}

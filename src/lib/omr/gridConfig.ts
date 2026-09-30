import { LayoutId, ChoiceStyle } from "@/types";

export interface MarkerPosition {
  x: number; // mm from left
  y: number; // mm from top
  size: number; // mm width & height
}

export interface SheetGridDefinition {
  layoutId: LayoutId;
  pageWidth: number;  // 210 mm (A4)
  pageHeight: number; // 297 mm (A4)
  markers: {
    topLeft: MarkerPosition;
    topRight: MarkerPosition;
    bottomLeft: MarkerPosition;
    bottomRight: MarkerPosition;
  };
  studentIdGrid: {
    x: number;
    y: number;
    columns: number; // 8 digits
    rows: number;    // 10 digits (0-9)
    colSpacing: number;
    rowSpacing: number;
    bubbleRadius: number;
  };
  answerGrid: {
    x: number;
    y: number;
    columnsCount: number;      // 1, 2, or 3 columns on sheet
    questionsPerCol: number;
    colWidth: number;
    rowSpacing: number;
    bubbleSpacing: number;
    bubbleRadius: number;
  };
}

export function getGridConfig(layoutId: LayoutId, totalQuestions: number): SheetGridDefinition {
  const markerSize = 10; // 10mm corner boxes
  const margin = 10;

  const baseMarkers = {
    topLeft: { x: margin, y: margin, size: markerSize },
    topRight: { x: 210 - margin - markerSize, y: margin, size: markerSize },
    bottomLeft: { x: margin, y: 297 - margin - markerSize, size: markerSize },
    bottomRight: { x: 210 - margin - markerSize, y: 297 - margin - markerSize, size: markerSize },
  };

  if (layoutId === "SM") {
    // 1-30 questions (Single centered or wide column)
    return {
      layoutId: "SM",
      pageWidth: 210,
      pageHeight: 297,
      markers: baseMarkers,
      studentIdGrid: {
        x: 24,
        y: 60,
        columns: 8,
        rows: 10,
        colSpacing: 8.5,
        rowSpacing: 5.5,
        bubbleRadius: 2.2,
      },
      answerGrid: {
        x: 104,
        y: 60,
        columnsCount: 1,
        questionsPerCol: Math.min(totalQuestions, 30),
        colWidth: 80,
        rowSpacing: 6.2,
        bubbleSpacing: 9.5,
        bubbleRadius: 2.3,
      },
    };
  }

  if (layoutId === "MD") {
    // 31-60 questions (Dual column layout)
    const questionsPerCol = Math.ceil(totalQuestions / 2);
    return {
      layoutId: "MD",
      pageWidth: 210,
      pageHeight: 297,
      markers: baseMarkers,
      studentIdGrid: {
        x: 22,
        y: 56,
        columns: 8,
        rows: 10,
        colSpacing: 8,
        rowSpacing: 5.2,
        bubbleRadius: 2.0,
      },
      answerGrid: {
        x: 22,
        y: 122,
        columnsCount: 2,
        questionsPerCol,
        colWidth: 82,
        rowSpacing: 5.2,
        bubbleSpacing: 8.5,
        bubbleRadius: 2.0,
      },
    };
  }

  // LG Layout: 61-100 questions (3 columns)
  const questionsPerCol = Math.ceil(totalQuestions / 3);
  return {
    layoutId: "LG",
    pageWidth: 210,
    pageHeight: 297,
    markers: baseMarkers,
    studentIdGrid: {
      x: 22,
      y: 52,
      columns: 8,
      rows: 10,
      colSpacing: 7.5,
      rowSpacing: 4.8,
      bubbleRadius: 1.8,
    },
    answerGrid: {
      x: 18,
      y: 114,
      columnsCount: 3,
      questionsPerCol,
      colWidth: 58,
      rowSpacing: 4.8,
      bubbleSpacing: 7.2,
      bubbleRadius: 1.8,
    },
  };
}

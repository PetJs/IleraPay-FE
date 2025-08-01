// src/lib/receiptScanner.ts
import Tesseract from 'tesseract.js';

export interface ReceiptData {
  hospitalName: string | null;
  patientId: string | null;
  amount: number | null;
}

/**
 * OCR the image and extract the three fields.
 */
export async function scanReceipt(file: File): Promise<ReceiptData> {
  console.log("Starting OCR for file:", file.name);

  // 1. Run Tesseract
  const {
    data: { text: rawText },
  } = await Tesseract.recognize(file, 'eng');

  // 2. Normalize whitespace & line breaks
  const text = rawText
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  console.log("OCR raw text:", rawText);
  console.log("OCR normalized text:", text);

  // 3. Extract hospital name after 'Hospital Name'
  const hospitalMatch =
    text.match(/Hospital Name\s*[:\-]\s*(.*?Hospital)/i)?.[1]?.trim() || null;

  // 4. Extract patient ID from formats like 'Patient: #239ADB' or 'Patient ID:'
  const patientMatch =
    text.match(/Patient(?:\sID)?\s*[:\-]\s*#?([A-Za-z0-9]+)/i)?.[1] ||
    null;

  // 5. Extract amount in NGN, USD, or generic currency symbol
  const amountRaw =
    text.match(/(?:₦|NGN|\$)\s*([\d,]+(?:\.\d{2})?)/i)?.[1] ||
    null;
  const amount = amountRaw ? parseFloat(amountRaw.replace(/,/g, '')) : null;

  console.log("OCR Result:", { hospitalMatch, patientMatch, amountRaw });

  return {
    hospitalName: hospitalMatch,
    patientId: patientMatch,
    amount,
  };
}

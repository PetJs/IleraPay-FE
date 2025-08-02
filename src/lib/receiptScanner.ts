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
export async function scanReceipt(file: File, debug = false): Promise<ReceiptData> {
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

  if (debug) {
    return {
      hospitalName: text,
      patientId: text,
      amount: null,
    };
  }

  // 3. Extract hospital name (supporting Hospital, Clinic, Medical Center, Health Centre)
  const hospitalMatch =
    text.match(/(.*?(Hospital|Clinic|Medical\s*Center|Health\s*Centre))/i)?.[1]?.trim() || null;

  // 4. Extract patient ID from variations like 'Patient: #239ADB', 'Patient ID:', 'PatientID -'
  const patientMatch =
    text.match(/Patient(?:\s*ID)?\s*[:\-]?\s*#?([A-Za-z0-9\-]+)/i)?.[1] || null;

  // 5. Extract amount – pick the largest one if multiple matches
  const amounts = [...text.matchAll(/(?:₦|NGN|\$)\s*([\d,]+(?:\.\d{2})?)/gi)].map(m =>
    parseFloat(m[1].replace(/,/g, ''))
  );
  const amount = amounts.length ? Math.max(...amounts) : null;

  console.log("OCR Result:", { hospitalMatch, patientMatch, amount });

  return {
    hospitalName: hospitalMatch,
    patientId: patientMatch,
    amount,
  };
}

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const COLORS = {
  beige: rgb(0.96, 0.93, 0.88),
  pink: rgb(0.95, 0.82, 0.86),
  darkPink: rgb(0.85, 0.60, 0.70),
  text: rgb(0.2, 0.2, 0.2),
  lightText: rgb(0.4, 0.4, 0.4),
};

interface ProductData {
  title?: string | null;
  description?: string | null;
  benefits?: (string | null | undefined)[] | null;
  price_range?: string | null;
  social_caption?: string | null;
}

export async function generateWorkbookPDF(product: ProductData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Load Unicode font (Noto Sans)
  const fontBytes = await fetch('/fonts/NotoSans-Regular.ttf').then(res => res.arrayBuffer());
  const notoSans = await pdfDoc.embedFont(fontBytes);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 60;
  const contentWidth = pageWidth - margin * 2;

  // Page 1: Cover
  const coverPage = pdfDoc.addPage([pageWidth, pageHeight]);
  coverPage.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: COLORS.beige,
  });

  coverPage.drawRectangle({
    x: 0,
    y: pageHeight - 150,
    width: pageWidth,
    height: 150,
    color: COLORS.pink,
  });

  // Title
  const titleSize = 32;
  const title = product.title || 'Untitled Product';
  const titleLines = wrapTextUnicode(title, contentWidth, titleSize, notoSans);
  
  let yPosition = pageHeight - 200;
  titleLines.forEach(line => {
    const lineWidth = notoSans.widthOfTextAtSize(line, titleSize);
    coverPage.drawText(line, {
      x: (pageWidth - lineWidth) / 2,
      y: yPosition,
      size: titleSize,
      font: notoSans,
      color: COLORS.text,
    });
    yPosition -= titleSize + 10;
  });

  coverPage.drawText('Your Personal Workbook', {
    x: margin,
    y: yPosition - 40,
    size: 18,
    font: notoSans,
    color: COLORS.darkPink,
  });

  coverPage.drawRectangle({
    x: margin,
    y: 100,
    width: contentWidth,
    height: 2,
    color: COLORS.pink,
  });

  coverPage.drawText('TrésorAI', {
    x: margin,
    y: 70,
    size: 14,

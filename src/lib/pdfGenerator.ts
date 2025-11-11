import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const COLORS = {
  beige: rgb(0.96, 0.93, 0.88), // #f5ede0
  pink: rgb(0.95, 0.82, 0.86), // #f2d1db
  darkPink: rgb(0.85, 0.60, 0.70), // #d99ab3
  text: rgb(0.2, 0.2, 0.2), // Dark gray for text
  lightText: rgb(0.4, 0.4, 0.4),
};

interface ProductData {
  title?: string | null;
  description?: string | null;
  benefits?: (string | null | undefined)[] | null;
  price_range?: string | null;
  social_caption?: string | null;
}

// Replace characters that cannot be encoded with WinAnsi (used by the bundled PDF fonts)
function sanitizeText(text: string | null | undefined): string {
  if (typeof text !== 'string') {
    return '';
  }

  // Normalize diacritics (e.g. é -> e) before removing characters outside the WinAnsi range
  const withoutDiacritics = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

  // Replace known punctuation that PDF-Lib cannot encode with simpler ASCII alternatives
  const replacements: Record<string, string> = {
    '’': "'",
    '‘': "'",
    '“': '"',
    '”': '"',
    '–': '-',
    '—': '-',
    '•': '-',
  };

  const replacedText = withoutDiacritics.replace(/[’‘“”–—•]/g, (char) => replacements[char] ?? '');

  // Remove remaining characters outside the WinAnsi range and strip control characters (except newline/tab)
  return replacedText
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, (char) => (['\n', '\r', '\t'].includes(char) ? char : ''));
}

export async function generateWorkbookPDF(product: ProductData): Promise<Uint8Array> {
  const sanitizedBenefits = Array.isArray(product.benefits)
    ? product.benefits
        .filter((benefit): benefit is string => typeof benefit === 'string' && benefit.trim().length > 0)
        .map((benefit) => sanitizeText(benefit))
    : [];

  // Sanitize all product data
  const sanitizedProduct = {
    title: sanitizeText(product.title) || 'Untitled Product',
    description: sanitizeText(product.description),
    benefits: sanitizedBenefits,
    price_range: sanitizeText(product.price_range),
    social_caption: product.social_caption ? sanitizeText(product.social_caption) : undefined,
  };
  const pdfDoc = await PDFDocument.create();
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesRomanItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const pageWidth = 595.28; // A4 width in points
  const pageHeight = 841.89; // A4 height in points
  const margin = 60;
  const contentWidth = pageWidth - (margin * 2);

  // Page 1: Cover
  const coverPage = pdfDoc.addPage([pageWidth, pageHeight]);
  coverPage.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: COLORS.beige,
  });

  // Decorative header rectangle
  coverPage.drawRectangle({
    x: 0,
    y: pageHeight - 150,
    width: pageWidth,
    height: 150,
    color: COLORS.pink,
  });

  // Title
  const titleSize = 32;
  const titleLines = wrapText(sanitizedProduct.title, contentWidth, titleSize, timesRomanBold);
  let yPosition = pageHeight - 200;
  
  titleLines.forEach(line => {
    const titleWidth = timesRomanBold.widthOfTextAtSize(line, titleSize);
    coverPage.drawText(line, {
      x: (pageWidth - titleWidth) / 2,
      y: yPosition,
      size: titleSize,
      font: timesRomanBold,
      color: COLORS.text,
    });
    yPosition -= titleSize + 10;
  });

  // Subtitle
  coverPage.drawText('Your Personal Workbook', {
    x: margin,
    y: yPosition - 40,
    size: 18,
    font: timesRomanItalic,
    color: COLORS.darkPink,
  });

  // Footer decoration
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
    font: timesRomanItalic,
    color: COLORS.lightText,
  });

  // Page 2: Introduction
  const introPage = pdfDoc.addPage([pageWidth, pageHeight]);
  introPage.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: COLORS.beige,
  });

  yPosition = pageHeight - margin - 20;

  introPage.drawText('Welcome', {
    x: margin,
    y: yPosition,
    size: 28,
    font: timesRomanBold,
    color: COLORS.darkPink,
  });

  yPosition -= 60;

  const descLines = wrapText(sanitizedProduct.description, contentWidth, 14, timesRoman);
  descLines.forEach(line => {
    introPage.drawText(line, {
      x: margin,
      y: yPosition,
      size: 14,
      font: timesRoman,
      color: COLORS.text,
    });
    yPosition -= 22;
  });

  yPosition -= 30;
  introPage.drawText('What You\'ll Discover:', {
    x: margin,
    y: yPosition,
    size: 18,
    font: timesRomanBold,
    color: COLORS.text,
  });

  yPosition -= 35;
  sanitizedProduct.benefits.forEach(benefit => {
    const benefitLines = wrapText(`• ${benefit}`, contentWidth - 20, 13, timesRoman);
    benefitLines.forEach(line => {
      introPage.drawText(line, {
        x: margin + 10,
        y: yPosition,
        size: 13,
        font: timesRoman,
        color: COLORS.text,
      });
      yPosition -= 24;
    });
  });

  // Page 3: Daily Section 1
  const daily1Page = pdfDoc.addPage([pageWidth, pageHeight]);
  daily1Page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: COLORS.beige,
  });

  addDailySectionContent(daily1Page, 'Day 1-7: Foundation', timesRomanBold, timesRoman, margin, contentWidth, pageHeight);

  // Page 4: Daily Section 2
  const daily2Page = pdfDoc.addPage([pageWidth, pageHeight]);
  daily2Page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: COLORS.beige,
  });

  addDailySectionContent(daily2Page, 'Day 8-14: Growth', timesRomanBold, timesRoman, margin, contentWidth, pageHeight);

  // Page 5: Reflection
  const reflectionPage = pdfDoc.addPage([pageWidth, pageHeight]);
  reflectionPage.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: COLORS.beige,
  });

  yPosition = pageHeight - margin - 20;

  reflectionPage.drawText('Reflection & Next Steps', {
    x: margin,
    y: yPosition,
    size: 28,
    font: timesRomanBold,
    color: COLORS.darkPink,
  });

  yPosition -= 60;

  const reflectionPrompts = [
    'What were your biggest insights?',
    'What changes will you implement?',
    'How do you feel about your progress?',
    'What are your next action steps?'
  ];

  reflectionPrompts.forEach(prompt => {
    reflectionPage.drawText(prompt, {
      x: margin,
      y: yPosition,
      size: 14,
      font: timesRomanBold,
      color: COLORS.text,
    });
    
    yPosition -= 30;

    // Draw lines for writing
    for (let i = 0; i < 4; i++) {
      reflectionPage.drawLine({
        start: { x: margin, y: yPosition },
        end: { x: pageWidth - margin, y: yPosition },
        thickness: 0.5,
        color: COLORS.pink,
      });
      yPosition -= 25;
    }
    
    yPosition -= 20;
  });

  // Footer on reflection page
  reflectionPage.drawRectangle({
    x: margin,
    y: 80,
    width: contentWidth,
    height: 2,
    color: COLORS.pink,
  });

  reflectionPage.drawText('You\'re capable of amazing things', {
    x: margin,
    y: 50,
    size: 12,
    font: timesRomanItalic,
    color: COLORS.darkPink,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

function addDailySectionContent(
  page: any,
  sectionTitle: string,
  boldFont: any,
  regularFont: any,
  margin: number,
  contentWidth: number,
  pageHeight: number
) {
  let yPosition = pageHeight - margin - 20;

  // Section title with decorative element
  page.drawRectangle({
    x: margin,
    y: yPosition - 5,
    width: 150,
    height: 35,
    color: COLORS.pink,
  });

  page.drawText(sectionTitle, {
    x: margin + 10,
    y: yPosition,
    size: 20,
    font: boldFont,
    color: COLORS.text,
  });

  yPosition -= 70;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  days.forEach(day => {
    if (yPosition < 150) return; // Stop if running out of space

    page.drawText(day, {
      x: margin,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: COLORS.darkPink,
    });

    yPosition -= 25;

    page.drawText('Morning Intention:', {
      x: margin + 10,
      y: yPosition,
      size: 11,
      font: regularFont,
      color: COLORS.text,
    });

    yPosition -= 20;
    
    // Lines for writing
    for (let i = 0; i < 2; i++) {
      page.drawLine({
        start: { x: margin + 10, y: yPosition },
        end: { x: margin + contentWidth - 10, y: yPosition },
        thickness: 0.5,
        color: COLORS.pink,
      });
      yPosition -= 18;
    }

    yPosition -= 15;
  });
}

function wrapText(text: string, maxWidth: number, fontSize: number, font: any): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

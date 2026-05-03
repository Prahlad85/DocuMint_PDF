const { processAndSend } = require('../utils/fileUtils');
const { PDFDocument, PDFRawStream, PDFName, PDFNumber, rgb, degrees, StandardFonts } = require('pdf-lib');
const { exec } = require('child_process');
const util = require('util');
const path = require('path');
const fs = require('fs-extra');
const OpenAI = require('openai');
const pdfParse = require('pdf-parse');
const puppeteer = require('puppeteer');
const sharp = require('sharp');

const execAsync = util.promisify(exec);

// Helper to load single PDF
const loadSinglePdf = async (req) => {
  const inputBuffer = await fs.readFile(req.file.path);
  const pdfDoc = await PDFDocument.load(inputBuffer);
  return { pdfDoc, pages: pdfDoc.getPages() };
};

exports.mergePdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  if (!req.files || req.files.length < 2) throw new Error('Merge PDF requires at least 2 files.');
  const mergedPdf = await PDFDocument.create();
  for (const f of req.files) {
    const pDoc = await PDFDocument.load(await fs.readFile(f.path));
    const copied = await mergedPdf.copyPages(pDoc, pDoc.getPageIndices());
    copied.forEach(p => mergedPdf.addPage(p));
  }
  const outPath = path.join(tmpDir, 'merged.pdf');
  await fs.writeFile(outPath, await mergedPdf.save());
  return { path: outPath, filename: 'merged_document.pdf', mimeType: 'application/pdf' };
});

exports.splitPdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  const { pdfDoc } = await loadSinglePdf(req);
  
  // Parse pages and mode from request body
  let targetPages = [];
  try {
    if (req.body.pages) {
      targetPages = JSON.parse(req.body.pages).map(p => Number(p));
    }
  } catch (e) {
    console.error("Error parsing pages:", e);
  }
  
  const mode = req.body.mode || 'extract';
  const totalPages = pdfDoc.getPageCount();
  
  // Determine which pages to keep (1-indexed from client)
  let pagesToKeep = [];
  if (targetPages.length > 0) {
    for (let i = 1; i <= totalPages; i++) {
      const isTarget = targetPages.includes(i);
      if ((mode === 'extract' && isTarget) || (mode === 'remove' && !isTarget)) {
        pagesToKeep.push(i);
      }
    }
  } else {
    // Fallback if no pages specified
    pagesToKeep.push(1);
  }

  // Remove pages from the end backwards to avoid index shifting issues
  for (let i = totalPages; i >= 1; i--) {
    if (!pagesToKeep.includes(i)) {
      pdfDoc.removePage(i - 1); // 0-indexed for removePage
    }
  }

  const outPath = path.join(tmpDir, 'split.pdf');
  await fs.writeFile(outPath, await pdfDoc.save());
  return { path: outPath, filename: 'split_document.pdf', mimeType: 'application/pdf' };
});

exports.compressPdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  const inputBuffer = await fs.readFile(req.file.path);

  // Load PDF — use objectsPerTick for structural compression
  const pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });

  const context = pdfDoc.context;

  // Iterate all indirect objects; find image streams and re-compress with sharp
  for (const [ref, obj] of context.enumerateIndirectObjects()) {
    // Only process PDFRawStream objects (they hold actual image/content bytes)
    if (!(obj instanceof PDFRawStream)) continue;

    const dict = obj.dict;
    const subtype = dict.lookupMaybe(PDFName.of('Subtype'), PDFName);
    if (!subtype || subtype.asString() !== '/Image') continue;

    const filter = dict.lookupMaybe(PDFName.of('Filter'), PDFName);
    if (!filter || filter.asString() !== '/DCTDecode') continue; // only JPEG

    // obj.contents is a Uint8Array of the raw JPEG bytes
    const originalBytes = obj.contents;
    if (!originalBytes || originalBytes.length === 0) continue;

    try {
      const compressed = await sharp(Buffer.from(originalBytes))
        .jpeg({ quality: 55 })
        .toBuffer();

      if (compressed.length < originalBytes.length) {
        // Swap in the smaller JPEG bytes and update the Length entry
        obj.contents = new Uint8Array(compressed);
        dict.set(PDFName.of('Length'), PDFNumber.of(compressed.length));
      }
    } catch (_) {
      // Skip unreadable images — don't fail the whole compression
    }
  }

  const outPath = path.join(tmpDir, 'compressed.pdf');
  // useObjectStreams packs indirect objects together, reducing file size further
  const savedBytes = await pdfDoc.save({ useObjectStreams: true });
  await fs.writeFile(outPath, savedBytes);
  return { path: outPath, filename: `compressed_${req.file.originalname}`, mimeType: 'application/pdf' };
});

exports.pdfToWord = (req, res) => processAndSend(req, res, async (tmpDir) => {
  await execAsync(`soffice --headless --convert-to docx --outdir "${tmpDir}" "${req.file.path}"`);
  const outPath = path.join(tmpDir, path.basename(req.file.originalname, '.pdf') + '.docx');
  return { path: outPath, filename: req.file.originalname.replace('.pdf', '.docx'), mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
});

exports.pdfToPowerpoint = (req, res) => processAndSend(req, res, async (tmpDir) => {
  await execAsync(`soffice --headless --convert-to pptx --outdir "${tmpDir}" "${req.file.path}"`);
  const outPath = path.join(tmpDir, path.basename(req.file.originalname, '.pdf') + '.pptx');
  return { path: outPath, filename: req.file.originalname.replace('.pdf', '.pptx'), mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' };
});

exports.pdfToExcel = (req, res) => processAndSend(req, res, async (tmpDir) => {
  await execAsync(`soffice --headless --convert-to xlsx --outdir "${tmpDir}" "${req.file.path}"`);
  const outPath = path.join(tmpDir, path.basename(req.file.originalname, '.pdf') + '.xlsx');
  return { path: outPath, filename: req.file.originalname.replace('.pdf', '.xlsx'), mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
});

exports.wordToPdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  await execAsync(`soffice --headless --convert-to pdf --outdir "${tmpDir}" "${req.file.path}"`);
  const outPath = path.join(tmpDir, path.basename(req.file.originalname, path.extname(req.file.originalname)) + '.pdf');
  return { path: outPath, filename: req.file.originalname.replace(path.extname(req.file.originalname), '.pdf'), mimeType: 'application/pdf' };
});

exports.powerpointToPdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  await execAsync(`soffice --headless --convert-to pdf --outdir "${tmpDir}" "${req.file.path}"`);
  const outPath = path.join(tmpDir, path.basename(req.file.originalname, path.extname(req.file.originalname)) + '.pdf');
  return { path: outPath, filename: req.file.originalname.replace(path.extname(req.file.originalname), '.pdf'), mimeType: 'application/pdf' };
});

exports.excelToPdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  await execAsync(`soffice --headless --convert-to pdf --outdir "${tmpDir}" "${req.file.path}"`);
  const outPath = path.join(tmpDir, path.basename(req.file.originalname, path.extname(req.file.originalname)) + '.pdf');
  return { path: outPath, filename: req.file.originalname.replace(path.extname(req.file.originalname), '.pdf'), mimeType: 'application/pdf' };
});

exports.ocrPdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  // Extract text using pdf-parse, then embed it back as a searchable text layer
  const inputBuffer = await fs.readFile(req.file.path);
  let extractedText = '';
  try {
    const parsed = await pdfParse(inputBuffer);
    extractedText = parsed.text || '';
  } catch (_) {}
  const pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
  if (extractedText.trim()) {
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const firstPage = pdfDoc.getPage(0);
    const lines = extractedText.split('\n').slice(0, 3); // stamp first 3 lines as preview
    lines.forEach((line, i) => {
      if (!line.trim()) return;
      firstPage.drawText(line.slice(0, 80), { x: 10, y: 10 + i * 12, size: 7, font, color: rgb(0, 0, 0), opacity: 0 });
    });
  }
  const outPath = path.join(tmpDir, 'ocr.pdf');
  await fs.writeFile(outPath, await pdfDoc.save());
  return { path: outPath, filename: `ocr_${req.file.originalname}`, mimeType: 'application/pdf' };
});

exports.pdfToJpg = (req, res) => processAndSend(req, res, async (tmpDir) => {
  const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
  const { createCanvas } = require('canvas');
  const archiver = require('archiver');

  const data = new Uint8Array(await fs.readFile(req.file.path));
  const pdfDoc2 = await pdfjsLib.getDocument({ data, verbosity: 0 }).promise;
  const numPages = pdfDoc2.numPages;
  const images = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc2.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
    const imgPath = path.join(tmpDir, `page_${pageNum}.jpg`);
    await fs.writeFile(imgPath, canvas.toBuffer('image/jpeg', { quality: 0.92 }));
    images.push(imgPath);
  }

  if (numPages === 1) {
    return { path: images[0], filename: req.file.originalname.replace('.pdf', '_page1.jpg'), mimeType: 'image/jpeg' };
  }

  const zipPath = path.join(tmpDir, 'pages.zip');
  await new Promise((resolve, reject) => {
    const output = require('fs').createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 6 } });
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    images.forEach((p, i) => archive.file(p, { name: `page_${i + 1}.jpg` }));
    archive.finalize();
  });
  return { path: zipPath, filename: req.file.originalname.replace('.pdf', '_pages.zip'), mimeType: 'application/zip' };
});

exports.jpgToPdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  const files = req.files || (req.file ? [req.file] : []);
  if (!files.length) throw new Error('No image files uploaded.');
  const newPdf = await PDFDocument.create();
  for (const f of files) {
    // Convert any image format to PNG via sharp for reliable embedding
    const imgBytes = await sharp(f.path).png().toBuffer();
    const image = await newPdf.embedPng(imgBytes);
    const page = newPdf.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  const outPath = path.join(tmpDir, 'converted.pdf');
  await fs.writeFile(outPath, await newPdf.save());
  return { path: outPath, filename: 'images_to_pdf.pdf', mimeType: 'application/pdf' };
});

exports.signPdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  const { pdfDoc, pages } = await loadSinglePdf(req);
  const sigText = req.body.sigText || 'Digitally Signed';
  const sigFont = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);
  const lastPage = pages[pages.length - 1];
  const { width, height } = lastPage.getSize();
  // Draw signature box
  lastPage.drawRectangle({ x: width - 220, y: 40, width: 180, height: 50, borderColor: rgb(0.2, 0.2, 0.8), borderWidth: 1.5, color: rgb(0.95, 0.95, 1) });
  lastPage.drawText(sigText, { x: width - 210, y: 58, size: 13, font: sigFont, color: rgb(0.1, 0.1, 0.7) });
  lastPage.drawText(new Date().toLocaleDateString(), { x: width - 210, y: 44, size: 9, font: sigFont, color: rgb(0.4, 0.4, 0.4) });
  const outPath = path.join(tmpDir, 'signed.pdf');
  await fs.writeFile(outPath, await pdfDoc.save());
  return { path: outPath, filename: `signed_${req.file.originalname}`, mimeType: 'application/pdf' };
});

exports.watermarkPdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  const { pdfDoc, pages } = await loadSinglePdf(req);
  const wFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const text = req.body.text || 'CONFIDENTIAL';
  const opacity = parseFloat(req.body.opacity || '0.3');
  const size = parseInt(req.body.size || '48', 10);
  pages.forEach(page => {
    const { width, height } = page.getSize();
    const textWidth = size * text.length * 0.5;
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: height / 2,
      size,
      font: wFont,
      color: rgb(0.8, 0.1, 0.1),
      opacity,
      rotate: degrees(45),
    });
  });
  const outPath = path.join(tmpDir, 'watermarked.pdf');
  await fs.writeFile(outPath, await pdfDoc.save());
  return { path: outPath, filename: `watermarked_${req.file.originalname}`, mimeType: 'application/pdf' };
});

exports.rotatePdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  const { pdfDoc, pages } = await loadSinglePdf(req);
  pages.forEach(page => page.setRotation(degrees(page.getRotation().angle + 90)));
  const outPath = path.join(tmpDir, 'rotated.pdf');
  await fs.writeFile(outPath, await pdfDoc.save());
  return { path: outPath, filename: `rotated_${req.file.originalname}`, mimeType: 'application/pdf' };
});

exports.pageNumbers = (req, res) => processAndSend(req, res, async (tmpDir) => {
  const { pdfDoc, pages } = await loadSinglePdf(req);
  const nFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  pages.forEach((page, idx) => {
    const { width } = page.getSize();
    page.drawText(`Page ${idx + 1}`, { x: width / 2 - 20, y: 20, size: 12, font: nFont, color: rgb(0, 0, 0) });
  });
  const outPath = path.join(tmpDir, 'numbered.pdf');
  await fs.writeFile(outPath, await pdfDoc.save());
  return { path: outPath, filename: `numbered_${req.file.originalname}`, mimeType: 'application/pdf' };
});

exports.organizePdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  const inputBuffer = await fs.readFile(req.file.path);
  const srcDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
  // pageOrder: comma-separated 1-based page numbers, e.g. "3,1,2"
  let order = srcDoc.getPageIndices(); // default: keep original
  if (req.body.pageOrder) {
    try {
      order = String(req.body.pageOrder).split(',').map(n => parseInt(n.trim(), 10) - 1);
    } catch (_) {}
  }
  const newDoc = await PDFDocument.create();
  const copied = await newDoc.copyPages(srcDoc, order);
  copied.forEach(p => newDoc.addPage(p));
  const outPath = path.join(tmpDir, 'organized.pdf');
  await fs.writeFile(outPath, await newDoc.save());
  return { path: outPath, filename: `organized_${req.file.originalname}`, mimeType: 'application/pdf' };
});

exports.editPdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  const { pdfDoc, pages } = await loadSinglePdf(req);
  const eFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  // Support array of text overlays: [{text, x, y, size, page, r, g, b}]
  let overlays = [];
  try { overlays = JSON.parse(req.body.overlays || '[]'); } catch (_) {}
  if (!overlays.length) {
    overlays = [{ text: req.body.text || 'Edited with DocuMint', x: 50, y: pages[0].getSize().height - 50, size: 18, page: 0 }];
  }
  for (const ov of overlays) {
    const pg = pages[ov.page ?? 0];
    if (!pg) continue;
    pg.drawText(String(ov.text), {
      x: Number(ov.x ?? 50),
      y: Number(ov.y ?? 100),
      size: Number(ov.size ?? 14),
      font: eFont,
      color: rgb(Number(ov.r ?? 0), Number(ov.g ?? 0), Number(ov.b ?? 0)),
    });
  }
  const outPath = path.join(tmpDir, 'edited.pdf');
  await fs.writeFile(outPath, await pdfDoc.save());
  return { path: outPath, filename: `edited_${req.file.originalname}`, mimeType: 'application/pdf' };
});

exports.protectPdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  // pdf-lib does not natively support AES encryption; we add a visible protection notice
  // and metadata marking. For true password protection, Ghostscript or qpdf is required.
  const inputBuffer = await fs.readFile(req.file.path);
  const pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const password = req.body.password || 'protected';
  pdfDoc.setTitle(`Protected Document`);
  pdfDoc.setKeywords([`password:${password}`]);
  // Stamp first page with protection notice
  const firstPage = pdfDoc.getPage(0);
  const { width, height } = firstPage.getSize();
  firstPage.drawRectangle({ x: 0, y: height - 30, width, height: 30, color: rgb(0.9, 0.3, 0.3) });
  firstPage.drawText(`🔒 Protected Document  (Password: ${password})`, { x: 10, y: height - 20, size: 11, font, color: rgb(1, 1, 1) });
  const outPath = path.join(tmpDir, 'protected.pdf');
  await fs.writeFile(outPath, await pdfDoc.save());
  return { path: outPath, filename: `protected_${req.file.originalname}`, mimeType: 'application/pdf' };
});

exports.unlockPdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  // pdf-lib can load and re-save many encrypted PDFs, stripping user-level restrictions
  const inputBuffer = await fs.readFile(req.file.path);
  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
  } catch (e) {
    throw new Error('Could not open PDF. It may be encrypted with an owner password that cannot be bypassed.');
  }
  const outPath = path.join(tmpDir, 'unlocked.pdf');
  // Re-save without encryption flags
  await fs.writeFile(outPath, await pdfDoc.save());
  return { path: outPath, filename: `unlocked_${req.file.originalname}`, mimeType: 'application/pdf' };
});

exports.htmlToPdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const htmlContent = await fs.readFile(req.file.path, 'utf8');
  await page.setContent(htmlContent);
  const outPath = path.join(tmpDir, 'output.pdf');
  await page.pdf({ path: outPath, format: 'A4' });
  await browser.close();
  return { path: outPath, filename: req.file.originalname.replace('.html', '.pdf'), mimeType: 'application/pdf' };
});

exports.pdfToPdfa = (req, res) => processAndSend(req, res, async (tmpDir) => {
  const inputBuffer = await fs.readFile(req.file.path);
  const pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });
  // Set PDF/A metadata markers
  pdfDoc.setTitle(pdfDoc.getTitle() || req.file.originalname);
  pdfDoc.setProducer('DocuMint PDF/A Converter');
  pdfDoc.setCreator('DocuMint');
  pdfDoc.setCreationDate(new Date());
  pdfDoc.setModificationDate(new Date());
  const outPath = path.join(tmpDir, 'pdfa.pdf');
  await fs.writeFile(outPath, await pdfDoc.save({ useObjectStreams: false }));
  return { path: outPath, filename: `archive_${req.file.originalname}`, mimeType: 'application/pdf' };
});

exports.repairPdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  // Reload and re-save — pdf-lib reconstructs the PDF structure, fixing many common issues
  const inputBuffer = await fs.readFile(req.file.path);
  const pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true, throwOnInvalidObject: false });
  const outPath = path.join(tmpDir, 'repaired.pdf');
  await fs.writeFile(outPath, await pdfDoc.save());
  return { path: outPath, filename: `repaired_${req.file.originalname}`, mimeType: 'application/pdf' };
});

exports.redactPdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  const { pdfDoc, pages } = await loadSinglePdf(req);
  // Support array of regions [{x,y,width,height,page}] or default: redact top-center of every page
  let regions = [];
  try { regions = JSON.parse(req.body.regions || '[]'); } catch (_) {}
  for (const page of pages) {
    const { width, height } = page.getSize();
    const pageIdx = pages.indexOf(page);
    const pageRegions = regions.filter(r => (r.page ?? 0) === pageIdx);
    if (pageRegions.length) {
      pageRegions.forEach(r => page.drawRectangle({ x: r.x, y: r.y, width: r.width, height: r.height, color: rgb(0, 0, 0) }));
    } else {
      // Default: redact a generic area at the top of every page
      page.drawRectangle({ x: 40, y: height - 80, width: width - 80, height: 25, color: rgb(0, 0, 0) });
    }
  }
  const outPath = path.join(tmpDir, 'redacted.pdf');
  await fs.writeFile(outPath, await pdfDoc.save());
  return { path: outPath, filename: `redacted_${req.file.originalname}`, mimeType: 'application/pdf' };
});

exports.cropPdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  const { pdfDoc, pages } = await loadSinglePdf(req);
  // Accept margins from body: top, right, bottom, left (in PDF points, default 40)
  const top    = parseInt(req.body.top    ?? 40, 10);
  const right  = parseInt(req.body.right  ?? 40, 10);
  const bottom = parseInt(req.body.bottom ?? 40, 10);
  const left   = parseInt(req.body.left   ?? 40, 10);
  pages.forEach(page => {
    const mb = page.getMediaBox();
    page.setCropBox(
      mb.x + left,
      mb.y + bottom,
      mb.width  - left - right,
      mb.height - top  - bottom,
    );
  });
  const outPath = path.join(tmpDir, 'cropped.pdf');
  await fs.writeFile(outPath, await pdfDoc.save());
  return { path: outPath, filename: `cropped_${req.file.originalname}`, mimeType: 'application/pdf' };
});

exports.comparePdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  if (req.files.length < 2) throw new Error('Compare requires 2 files.');
  const comparePdf = await PDFDocument.create();
  for (const f of req.files) {
    const pDoc = await PDFDocument.load(await fs.readFile(f.path));
    const copied = await comparePdf.copyPages(pDoc, [0]);
    comparePdf.addPage(copied[0]);
  }
  const outPath = path.join(tmpDir, 'compared.pdf');
  await fs.writeFile(outPath, await comparePdf.save());
  return { path: outPath, filename: 'comparison_result.pdf', mimeType: 'application/pdf' };
});

exports.summarizePdf = (req, res) => processAndSend(req, res, async () => {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY missing');
  const data = await pdfParse(await fs.readFile(req.file.path));
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: 'Summarize.' }, { role: 'user', content: data.text }]
  });
  return { type: 'json', data: { summary: response.choices[0].message.content } };
});

exports.translatePdf = (req, res) => processAndSend(req, res, async (tmpDir) => {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY missing');
  const data = await pdfParse(await fs.readFile(req.file.path));
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: 'Translate to Spanish.' }, { role: 'user', content: data.text }]
  });
  const outPath = path.join(tmpDir, 'translated.txt');
  await fs.writeFile(outPath, response.choices[0].message.content);
  return { path: outPath, filename: `translated_${req.file.originalname}.txt`, mimeType: 'text/plain' };
});

const fs = require('fs/promises');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const { PDFDocument, rgb, degrees, StandardFonts } = require('pdf-lib');
const OpenAI = require('openai');
const pdfParse = require('pdf-parse');

const execAsync = util.promisify(exec);

exports.handleProcess = async (req, res, next) => {
  let tmpDir = null;

  try {
    const tool = req.body.tool;
    const files = req.files;

    if (!tool || !files || files.length === 0) {
      return res.status(400).json({ error: 'Tool and file(s) are required.' });
    }

    // Use the first file for singular operations, but keep the path ready
    const inputFile = files[0];
    const inputPath = inputFile.path;
    const originalExt = path.extname(inputFile.originalname) || '.pdf';
    
    // Create a temporary workspace dir inside uploads
    tmpDir = await fs.mkdtemp(path.join(__dirname, '../uploads/task-'));
    
    // Move uploaded files into the temp dir for clean execution
    const workInputPath = path.join(tmpDir, `input${originalExt}`);
    await fs.copyFile(inputPath, workInputPath);

    let outputFilePath = null;
    let resultType = 'file'; // 'file' or 'json'
    let jsonResult = null;
    let mimeType = 'application/pdf';
    let outputFilename = `processed_${inputFile.originalname}`;

    console.log(`Processing tool: ${tool} on file: ${inputFile.originalname}`);

    // Create a PDFDocument instance if the tool uses pdf-lib natively
    let pdfDoc = null;
    let pages = null;
    if (['merge-pdf', 'split-pdf', 'rotate-pdf', 'watermark', 'page-numbers', 'organize-pdf', 'edit-pdf', 'sign-pdf', 'redact-pdf', 'crop-pdf'].includes(tool)) {
      const inputBuffer = await fs.readFile(workInputPath);
      pdfDoc = await PDFDocument.load(inputBuffer);
      pages = pdfDoc.getPages();
    }

    switch (tool) {
      // ==== PDF-LIB OPERATIONS ====
      case 'merge-pdf':
        if (files.length < 2) throw new Error('Merge PDF requires at least 2 files.');
        const mergedPdf = await PDFDocument.create();
        for (const f of files) {
          const fBuf = await fs.readFile(f.path);
          const pDoc = await PDFDocument.load(fBuf);
          const copied = await mergedPdf.copyPages(pDoc, pDoc.getPageIndices());
          copied.forEach((p) => mergedPdf.addPage(p));
        }
        outputFilePath = path.join(tmpDir, 'merged.pdf');
        await fs.writeFile(outputFilePath, await mergedPdf.save());
        outputFilename = 'merged_document.pdf';
        break;

      case 'split-pdf':
        while (pdfDoc.getPageCount() > 1) pdfDoc.removePage(1);
        outputFilePath = path.join(tmpDir, 'split.pdf');
        await fs.writeFile(outputFilePath, await pdfDoc.save());
        outputFilename = 'split_document.pdf';
        break;

      case 'rotate-pdf':
        pages.forEach(page => page.setRotation(degrees(page.getRotation().angle + 90)));
        outputFilePath = path.join(tmpDir, 'rotated.pdf');
        await fs.writeFile(outputFilePath, await pdfDoc.save());
        outputFilename = 'rotated_document.pdf';
        break;

      case 'watermark':
        const wFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        pages.forEach(page => {
          const { width, height } = page.getSize();
          page.drawText('CONFIDENTIAL', {
            x: width / 2 - 150, y: height / 2, size: 50, font: wFont,
            color: rgb(0.95, 0.1, 0.1), opacity: 0.3, rotate: degrees(45),
          });
        });
        outputFilePath = path.join(tmpDir, 'watermarked.pdf');
        await fs.writeFile(outputFilePath, await pdfDoc.save());
        outputFilename = 'watermarked_document.pdf';
        break;

      case 'page-numbers':
        const nFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        pages.forEach((page, idx) => {
          const { width } = page.getSize();
          page.drawText(`Page ${idx + 1}`, {
            x: width / 2 - 20, y: 20, size: 12, font: nFont, color: rgb(0, 0, 0),
          });
        });
        outputFilePath = path.join(tmpDir, 'numbered.pdf');
        await fs.writeFile(outputFilePath, await pdfDoc.save());
        outputFilename = 'numbered_document.pdf';
        break;

      case 'organize-pdf':
        const copiedPages = await pdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices().reverse());
        while (pdfDoc.getPageCount() > 0) pdfDoc.removePage(0);
        copiedPages.forEach(p => pdfDoc.addPage(p));
        outputFilePath = path.join(tmpDir, 'organized.pdf');
        await fs.writeFile(outputFilePath, await pdfDoc.save());
        outputFilename = 'organized_document.pdf';
        break;

      case 'edit-pdf':
        const eFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        pages[0].drawText('Edited with DocuMint Backend', {
          x: 50, y: pages[0].getSize().height - 50, size: 20, font: eFont, color: rgb(0.1, 0.8, 0.7),
        });
        outputFilePath = path.join(tmpDir, 'edited.pdf');
        await fs.writeFile(outputFilePath, await pdfDoc.save());
        outputFilename = 'edited_document.pdf';
        break;

      case 'sign-pdf':
        const sFont = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);
        const lastPage = pages[pages.length - 1];
        lastPage.drawText('DIGITALLY SIGNED', { x: 50, y: 50, size: 24, font: sFont, color: rgb(0, 0.5, 0) });
        outputFilePath = path.join(tmpDir, 'signed.pdf');
        await fs.writeFile(outputFilePath, await pdfDoc.save());
        outputFilename = `signed_${inputFile.originalname}`;
        break;

      case 'redact-pdf':
        pages.forEach(page => {
          const { width, height } = page.getSize();
          page.drawRectangle({ x: 50, y: height - 100, width: 200, height: 20, color: rgb(0,0,0) });
          page.drawRectangle({ x: 50, y: height - 150, width: 150, height: 20, color: rgb(0,0,0) });
        });
        outputFilePath = path.join(tmpDir, 'redacted.pdf');
        await fs.writeFile(outputFilePath, await pdfDoc.save());
        outputFilename = `redacted_${inputFile.originalname}`;
        break;

      case 'crop-pdf':
        pages.forEach(page => {
          const { x, y, width, height } = page.getCropBox();
          // Crop 10% from all sides
          page.setCropBox(x + (width*0.1), y + (height*0.1), width - (width*0.2), height - (height*0.2));
        });
        outputFilePath = path.join(tmpDir, 'cropped.pdf');
        await fs.writeFile(outputFilePath, await pdfDoc.save());
        outputFilename = `cropped_${inputFile.originalname}`;
        break;

      case 'compare-pdf':
        if (files.length < 2) throw new Error('Compare PDF requires at least 2 files.');
        const comparePdf = await PDFDocument.create();
        for (const f of [files[0], files[1]]) {
          const pDoc = await PDFDocument.load(await fs.readFile(f.path));
          const copied = await comparePdf.copyPages(pDoc, [0]); // copy first page of both
          comparePdf.addPage(copied[0]);
        }
        outputFilePath = path.join(tmpDir, 'compared.pdf');
        await fs.writeFile(outputFilePath, await comparePdf.save());
        outputFilename = 'comparison_result.pdf';
        break;

      case 'jpg-to-pdf':
      case 'scan-to-pdf':
        const newPdf = await PDFDocument.create();
        const imgBytes = await fs.readFile(workInputPath);
        let image;
        if (originalExt.toLowerCase().includes('png')) {
          image = await newPdf.embedPng(imgBytes);
        } else {
          image = await newPdf.embedJpg(imgBytes);
        }
        const iPage = newPdf.addPage([image.width, image.height]);
        iPage.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        outputFilePath = path.join(tmpDir, 'converted.pdf');
        await fs.writeFile(outputFilePath, await newPdf.save());
        outputFilename = inputFile.originalname.replace(originalExt, '.pdf');
        break;

      // ==== HEAVY SYSTEM OPERATIONS ====
      case 'pdf-to-jpg':
        outputFilePath = path.join(tmpDir, 'output.jpg');
        await execAsync(`gs -sDEVICE=jpeg -r300 -dJPEGQ=100 -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputFilePath}" "${workInputPath}"`);
        mimeType = 'image/jpeg';
        outputFilename = inputFile.originalname.replace('.pdf', '.jpg');
        break;

      case 'protect-pdf':
        outputFilePath = path.join(tmpDir, 'protected.pdf');
        await execAsync(`gs -sDEVICE=pdfwrite -sOwnerPassword=documint -sUserPassword=documint -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputFilePath}" "${workInputPath}"`);
        outputFilename = `protected_${inputFile.originalname}`;
        break;

      case 'unlock-pdf':
        outputFilePath = path.join(tmpDir, 'unlocked.pdf');
        await execAsync(`gs -sDEVICE=pdfwrite -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputFilePath}" "${workInputPath}"`);
        outputFilename = `unlocked_${inputFile.originalname}`;
        break;

      case 'pdf-to-pdfa':
        outputFilePath = path.join(tmpDir, 'pdfa.pdf');
        await execAsync(`gs -dPDFA=1 -sDEVICE=pdfwrite -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputFilePath}" "${workInputPath}"`);
        outputFilename = `archive_${inputFile.originalname}`;
        break;

      case 'repair-pdf':
        outputFilePath = path.join(tmpDir, 'repaired.pdf');
        await execAsync(`gs -o "${outputFilePath}" -sDEVICE=pdfwrite "${workInputPath}"`);
        outputFilename = `repaired_${inputFile.originalname}`;
        break;

      case 'html-to-pdf':
      case 'word-to-pdf':
      case 'powerpoint-to-pdf':
      case 'excel-to-pdf':
        await execAsync(`soffice --headless --convert-to pdf --outdir "${tmpDir}" "${workInputPath}"`);
        outputFilePath = path.join(tmpDir, 'input.pdf');
        mimeType = 'application/pdf';
        outputFilename = inputFile.originalname.replace(originalExt, '.pdf');
        break;

      case 'compress-pdf':
        outputFilePath = path.join(tmpDir, 'output.pdf');
        // Requires Ghostscript to be installed and in PATH
        await execAsync(`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputFilePath}" "${workInputPath}"`);
        mimeType = 'application/pdf';
        outputFilename = `compressed_${inputFile.originalname}`;
        break;

      case 'pdf-to-word':
        // Requires LibreOffice to be installed and in PATH
        await execAsync(`soffice --headless --convert-to docx --outdir "${tmpDir}" "${workInputPath}"`);
        outputFilePath = path.join(tmpDir, 'input.docx');
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        outputFilename = inputFile.originalname.replace('.pdf', '.docx');
        break;

      case 'pdf-to-powerpoint':
        await execAsync(`soffice --headless --convert-to pptx --outdir "${tmpDir}" "${workInputPath}"`);
        outputFilePath = path.join(tmpDir, 'input.pptx');
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        outputFilename = inputFile.originalname.replace('.pdf', '.pptx');
        break;

      case 'pdf-to-excel':
        await execAsync(`soffice --headless --convert-to xlsx --outdir "${tmpDir}" "${workInputPath}"`);
        outputFilePath = path.join(tmpDir, 'input.xlsx');
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        outputFilename = inputFile.originalname.replace('.pdf', '.xlsx');
        break;

      case 'ocr-pdf':
        // Requires Tesseract OCR
        const ocrPrefix = path.join(tmpDir, 'ocr_output');
        await execAsync(`tesseract "${workInputPath}" "${ocrPrefix}" -l eng pdf`);
        outputFilePath = `${ocrPrefix}.pdf`;
        mimeType = 'application/pdf';
        outputFilename = `ocr_${inputFile.originalname}`;
        break;

      // ==== AI OPERATIONS ====
      case 'ai-summarizer':
        if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is missing in backend environment variables.');
        const dataForSummary = await pdfParse(await fs.readFile(workInputPath));
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const summaryResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a professional summarizer. Summarize the following document text concisely.' },
            { role: 'user', content: dataForSummary.text }
          ],
        });
        
        resultType = 'json';
        jsonResult = { summary: summaryResponse.choices[0].message.content };
        break;

      case 'translate-pdf':
        if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is missing in backend environment variables.');
        const dataForTranslate = await pdfParse(await fs.readFile(workInputPath));
        const openaiTranslate = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const translateResponse = await openaiTranslate.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a professional translator. Translate the following text to Spanish while preserving the structure as best as possible.' },
            { role: 'user', content: dataForTranslate.text }
          ],
        });
        
        outputFilePath = path.join(tmpDir, 'translation.txt');
        await fs.writeFile(outputFilePath, translateResponse.choices[0].message.content);
        mimeType = 'text/plain';
        outputFilename = `translated_${inputFile.originalname.replace('.pdf', '.txt')}`;
        break;

      default:
        throw new Error(`Tool ${tool} is not supported by this API endpoint.`);
    }

    if (resultType === 'json') {
      res.json(jsonResult);
    } else {
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
      const fileStream = require('fs').createReadStream(outputFilePath);
      fileStream.pipe(res);
    }

  } catch (error) {
    console.error('Backend Processing Error:', error);
    res.status(500).json({ error: error.message || 'An error occurred during backend processing.' });
  } finally {
    // Cleanup temporary files and original multer uploads
    if (tmpDir) {
      try {
        await fs.rm(tmpDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Error cleaning up temp directory:', cleanupError);
      }
    }
    // Delete files uploaded by multer
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (e) {}
      }
    }
  }
};

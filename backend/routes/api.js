const express = require('express');
const multer = require('multer');
const path = require('path');
const toolController = require('../controllers/toolController');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
// General upload (PDFs)
const upload = multer({ storage });
// Image upload — accepts any mimetype (jpg, png, webp, gif, tiff, bmp, heic, etc.)
const uploadImage = multer({ storage });
// Signature upload — accepts image + PDF together
const uploadSign = multer({ storage });

router.post('/merge', upload.array('file'), toolController.mergePdf);
router.post('/split', upload.single('file'), toolController.splitPdf);
router.post('/compress', upload.single('file'), toolController.compressPdf);
router.post('/convert/pdf-to-word', upload.single('file'), toolController.pdfToWord);
router.post('/convert/word-to-pdf', upload.single('file'), toolController.wordToPdf);
router.post('/convert/pdf-to-powerpoint', upload.single('file'), toolController.pdfToPowerpoint);
router.post('/convert/powerpoint-to-pdf', upload.single('file'), toolController.powerpointToPdf);
router.post('/convert/pdf-to-excel', upload.single('file'), toolController.pdfToExcel);
router.post('/convert/excel-to-pdf', upload.single('file'), toolController.excelToPdf);
router.post('/ocr', upload.single('file'), toolController.ocrPdf);
router.post('/pdf-to-jpg', upload.single('file'), toolController.pdfToJpg);
router.post('/jpg-to-pdf', uploadImage.array('file'), toolController.jpgToPdf);
router.post('/scan-to-pdf', uploadImage.array('file'), toolController.jpgToPdf);
router.post('/watermark', upload.single('file'), toolController.watermarkPdf);
router.post('/rotate', upload.single('file'), toolController.rotatePdf);
router.post('/page-numbers', upload.single('file'), toolController.pageNumbers);
router.post('/organize', upload.single('file'), toolController.organizePdf);
router.post('/edit', upload.single('file'), toolController.editPdf);
router.post('/sign', upload.single('file'), toolController.signPdf);
router.post('/protect', upload.single('file'), toolController.protectPdf);
router.post('/unlock', upload.single('file'), toolController.unlockPdf);
router.post('/html-to-pdf', upload.single('file'), toolController.htmlToPdf);
router.post('/pdf-to-pdfa', upload.single('file'), toolController.pdfToPdfa);
router.post('/repair', upload.single('file'), toolController.repairPdf);
router.post('/redact', upload.single('file'), toolController.redactPdf);
router.post('/crop', upload.single('file'), toolController.cropPdf);
router.post('/compare', upload.array('file', 2), toolController.comparePdf);
router.post('/summarize', upload.single('file'), toolController.summarizePdf);
router.post('/translate', upload.single('file'), toolController.translatePdf);

module.exports = router;


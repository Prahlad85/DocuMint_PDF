import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolProcessor from "@/components/ToolProcessor";
import { notFound } from 'next/navigation';

// A simple dictionary mapping slug to tool info
const toolsData = {
  "merge-pdf": { title: "Merge PDF", description: "Combine multiple PDFs into one unified document." },
  "split-pdf": { title: "Split PDF", description: "Extract pages or separate one PDF into multiple files." },
  "compress-pdf": { title: "Compress PDF", description: "Reduce file size while optimizing for maximal PDF quality." },
  "pdf-to-word": { title: "PDF to Word", description: "Convert your PDF to an easy-to-edit DOCX file." },
  "pdf-to-powerpoint": { title: "PDF to PowerPoint", description: "Turn your PDF files into easy to edit PPTX slideshows." },
  "pdf-to-excel": { title: "PDF to Excel", description: "Pull data straight from PDFs into Excel spreadsheets." },
  "word-to-pdf": { title: "Word to PDF", description: "Make DOC and DOCX files easy to read by converting them to PDF." },
  "powerpoint-to-pdf": { title: "PowerPoint to PDF", description: "Make PPT and PPTX slideshows easy to view by converting them to PDF." },
  "excel-to-pdf": { title: "Excel to PDF", description: "Make EXCEL spreadsheets easy to read by converting them to PDF." },
  "edit-pdf": { title: "Edit PDF", description: "Add text, images, shapes or freehand annotations to a PDF." },
  "pdf-to-jpg": { title: "PDF to JPG", description: "Convert each PDF page into a JPG or extract all images contained in a PDF." },
  "jpg-to-pdf": { title: "JPG to PDF", description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins." },
  "sign-pdf": { title: "Sign PDF", description: "Sign a document and request signatures from others." },
  "watermark": { title: "Watermark", description: "Stamp an image or text over your PDF in seconds." },
  "rotate-pdf": { title: "Rotate PDF", description: "Rotate your PDFs the way you need them." },
  "html-to-pdf": { title: "HTML to PDF", description: "Convert webpages in HTML to PDF." },
  "unlock-pdf": { title: "Unlock PDF", description: "Remove PDF password security, giving you the freedom to use your PDFs as you want." },
  "protect-pdf": { title: "Protect PDF", description: "Encrypt your PDF with a password to keep sensitive data confidential." },
  "organize-pdf": { title: "Organize PDF", description: "Sort pages of your PDF file however you like." },
  "pdf-to-pdfa": { title: "PDF to PDF/A", description: "Convert PDF documents to PDF/A for archiving and long-term preservation." },
  "repair-pdf": { title: "Repair PDF", description: "Repair a damaged PDF and recover data from corrupt PDF." },
  "page-numbers": { title: "Page Numbers", description: "Add page numbers into PDFs with ease." },
  "scan-to-pdf": { title: "Scan to PDF", description: "Capture document scans from your mobile device and send them instantly to your browser." },
  "ocr-pdf": { title: "OCR PDF", description: "Make your scanned PDF searchable and selectable." },
  "compare-pdf": { title: "Compare PDF", description: "Compare two PDF documents to spot the differences." },
  "redact-pdf": { title: "Redact PDF", description: "Permanently remove sensitive text and graphics from your PDF." },
  "crop-pdf": { title: "Crop PDF", description: "Trim PDF margins, change PDF page size." },
  "ai-summarizer": { title: "AI Summarizer", description: "Get quick summaries of long PDF documents using advanced AI." },
  "translate-pdf": { title: "Translate PDF", description: "Instantly translate your PDF documents to any language." }
};

export default async function ToolPage({ params }) {
  const { tool } = await params;
  
  const toolInfo = toolsData[tool];

  if (!toolInfo) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 bg-muted/20">
        <div className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{toolInfo.title}</h1>
              <p className="text-xl text-muted-foreground">{toolInfo.description}</p>
            </div>
            
            <ToolProcessor toolType={tool} toolInfo={toolInfo} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}



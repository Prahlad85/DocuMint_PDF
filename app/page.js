"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import { 
  FileText, Merge, Split, FileArchive, FileDown, 
  FileUp, Image, PenTool, Edit3, Shield, 
  Unlock, Type, AlignLeft, Bot, Languages, 
  Layers, Settings, Search, EyeOff, Crop
} from "lucide-react";

const tools = [
  { title: "Merge PDF", description: "Combine multiple PDFs into one unified document.", icon: Merge, href: "/tools/merge-pdf" },
  { title: "Split PDF", description: "Extract pages or separate one PDF into multiple files.", icon: Split, href: "/tools/split-pdf" },
  { title: "Compress PDF", description: "Reduce file size while optimizing for maximal PDF quality.", icon: FileArchive, href: "/tools/compress-pdf" },
  { title: "PDF to Word", description: "Convert your PDF to an easy-to-edit DOCX file.", icon: FileText, href: "/tools/pdf-to-word" },
  { title: "PDF to PowerPoint", description: "Turn your PDF files into easy to edit PPTX slideshows.", icon: FileUp, href: "/tools/pdf-to-powerpoint" },
  { title: "PDF to Excel", description: "Pull data straight from PDFs into Excel spreadsheets.", icon: FileDown, href: "/tools/pdf-to-excel" },
  { title: "Word to PDF", description: "Make DOC and DOCX files easy to read by converting them to PDF.", icon: Type, href: "/tools/word-to-pdf" },
  { title: "PowerPoint to PDF", description: "Make PPT and PPTX slideshows easy to view by converting them to PDF.", icon: FileUp, href: "/tools/powerpoint-to-pdf" },
  { title: "Excel to PDF", description: "Make EXCEL spreadsheets easy to read by converting them to PDF.", icon: FileDown, href: "/tools/excel-to-pdf" },
  { title: "Edit PDF", description: "Add text, images, shapes or freehand annotations to a PDF.", icon: Edit3, href: "/tools/edit-pdf" },
  { title: "PDF to JPG", description: "Convert each PDF page into a JPG or extract all images contained in a PDF.", icon: Image, href: "/tools/pdf-to-jpg" },
  { title: "JPG to PDF", description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.", icon: Image, href: "/tools/jpg-to-pdf" },
  { title: "Sign PDF", description: "Sign a document and request signatures from others.", icon: PenTool, href: "/tools/sign-pdf" },
  { title: "Watermark", description: "Stamp an image or text over your PDF in seconds.", icon: Layers, href: "/tools/watermark" },
  { title: "Rotate PDF", description: "Rotate your PDFs the way you need them.", icon: Settings, href: "/tools/rotate-pdf" },
  { title: "HTML to PDF", description: "Convert webpages in HTML to PDF.", icon: FileText, href: "/tools/html-to-pdf" },
  { title: "Unlock PDF", description: "Remove PDF password security, giving you the freedom to use your PDFs as you want.", icon: Unlock, href: "/tools/unlock-pdf" },
  { title: "Protect PDF", description: "Encrypt your PDF with a password to keep sensitive data confidential.", icon: Shield, href: "/tools/protect-pdf" },
  { title: "Organize PDF", description: "Sort pages of your PDF file however you like.", icon: Layers, href: "/tools/organize-pdf" },
  { title: "PDF to PDF/A", description: "Convert PDF documents to PDF/A for archiving and long-term preservation.", icon: FileArchive, href: "/tools/pdf-to-pdfa" },
  { title: "Repair PDF", description: "Repair a damaged PDF and recover data from corrupt PDF.", icon: Settings, href: "/tools/repair-pdf" },
  { title: "Page Numbers", description: "Add page numbers into PDFs with ease.", icon: FileText, href: "/tools/page-numbers" },
  { title: "Scan to PDF", description: "Capture document scans from your mobile device and send them instantly to your browser.", icon: Search, href: "/tools/scan-to-pdf" },
  { title: "OCR PDF", description: "Make your scanned PDF searchable and selectable.", icon: AlignLeft, href: "/tools/ocr-pdf" },
  { title: "Compare PDF", description: "Compare two PDF documents to spot the differences.", icon: FileText, href: "/tools/compare-pdf" },
  { title: "Redact PDF", description: "Permanently remove sensitive text and graphics from your PDF.", icon: EyeOff, href: "/tools/redact-pdf" },
  { title: "Crop PDF", description: "Trim PDF margins, change PDF page size.", icon: Crop, href: "/tools/crop-pdf" },
  { title: "AI Summarizer", description: "Get quick summaries of long PDF documents using advanced AI.", icon: Bot, href: "/tools/ai-summarizer" },
  { title: "Translate PDF", description: "Instantly translate your PDF documents to any language.", icon: Languages, href: "/tools/translate-pdf" }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden bg-background">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6">
              Every tool you need to work with PDFs <br className="hidden md:block" />
              <span className="text-primary">in one place</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              All tools are 100% free and easy to use. Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#tools" className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/20 text-lg">
                Explore All Tools
              </a>
              <a href="/tools/merge-pdf" className="px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/80 transition text-lg">
                Try Merge PDF
              </a>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Most Popular PDF Tools</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                29 tools to convert, compress, and edit PDFs for free. Try it out today.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tools.map((tool, index) => (
                <ToolCard key={index} {...tool} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

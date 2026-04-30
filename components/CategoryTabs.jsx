"use client";
import { useState } from 'react';
import ToolCard from "@/components/ToolCard";
import { 
  FileText, Merge, Split, FileArchive, FileDown, 
  FileUp, Image, PenTool, Edit3, Shield, 
  Unlock, Type, AlignLeft, Bot, Languages, 
  Layers, Settings, Search, EyeOff, Crop
} from "lucide-react";

const toolsData = [
  { category: "Organize PDF", title: "Merge PDF", description: "Combine multiple PDFs into one unified document.", icon: Merge, href: "/tools/merge-pdf" },
  { category: "Organize PDF", title: "Split PDF", description: "Extract pages or separate one PDF into multiple files.", icon: Split, href: "/tools/split-pdf" },
  { category: "Optimize PDF", title: "Compress PDF", description: "Reduce file size while optimizing for maximal PDF quality.", icon: FileArchive, href: "/tools/compress-pdf" },
  { category: "Convert PDF", title: "PDF to Word", description: "Convert your PDF to an easy-to-edit DOCX file.", icon: FileText, href: "/tools/pdf-to-word" },
  { category: "Convert PDF", title: "PDF to PowerPoint", description: "Turn your PDF files into easy to edit PPTX slideshows.", icon: FileUp, href: "/tools/pdf-to-powerpoint" },
  { category: "Convert PDF", title: "PDF to Excel", description: "Pull data straight from PDFs into Excel spreadsheets.", icon: FileDown, href: "/tools/pdf-to-excel" },
  { category: "Convert PDF", title: "Word to PDF", description: "Make DOC and DOCX files easy to read by converting them to PDF.", icon: Type, href: "/tools/word-to-pdf" },
  { category: "Convert PDF", title: "PowerPoint to PDF", description: "Make PPT and PPTX slideshows easy to view by converting them to PDF.", icon: FileUp, href: "/tools/powerpoint-to-pdf" },
  { category: "Convert PDF", title: "Excel to PDF", description: "Make EXCEL spreadsheets easy to read by converting them to PDF.", icon: FileDown, href: "/tools/excel-to-pdf" },
  { category: "Edit PDF", title: "Edit PDF", description: "Add text, images, shapes or freehand annotations to a PDF.", icon: Edit3, href: "/tools/edit-pdf" },
  { category: "Convert PDF", title: "PDF to JPG", description: "Convert each PDF page into a JPG or extract all images contained in a PDF.", icon: Image, href: "/tools/pdf-to-jpg" },
  { category: "Convert PDF", title: "JPG to PDF", description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.", icon: Image, href: "/tools/jpg-to-pdf" },
  { category: "Edit PDF", title: "Sign PDF", description: "Sign a document and request signatures from others.", icon: PenTool, href: "/tools/sign-pdf" },
  { category: "Edit PDF", title: "Watermark", description: "Stamp an image or text over your PDF in seconds.", icon: Layers, href: "/tools/watermark" },
  { category: "Organize PDF", title: "Rotate PDF", description: "Rotate your PDFs the way you need them.", icon: Settings, href: "/tools/rotate-pdf" },
  { category: "Convert PDF", title: "HTML to PDF", description: "Convert webpages in HTML to PDF.", icon: FileText, href: "/tools/html-to-pdf" },
  { category: "PDF Security", title: "Unlock PDF", description: "Remove PDF password security, giving you the freedom to use your PDFs as you want.", icon: Unlock, href: "/tools/unlock-pdf" },
  { category: "PDF Security", title: "Protect PDF", description: "Encrypt your PDF with a password to keep sensitive data confidential.", icon: Shield, href: "/tools/protect-pdf" },
  { category: "Organize PDF", title: "Organize PDF", description: "Sort pages of your PDF file however you like.", icon: Layers, href: "/tools/organize-pdf" },
  { category: "Convert PDF", title: "PDF to PDF/A", description: "Convert PDF documents to PDF/A for archiving and long-term preservation.", icon: FileArchive, href: "/tools/pdf-to-pdfa" },
  { category: "Optimize PDF", title: "Repair PDF", description: "Repair a damaged PDF and recover data from corrupt PDF.", icon: Settings, href: "/tools/repair-pdf" },
  { category: "Edit PDF", title: "Page Numbers", description: "Add page numbers into PDFs with ease.", icon: FileText, href: "/tools/page-numbers" },
  { category: "Convert PDF", title: "Scan to PDF", description: "Capture document scans from your mobile device and send them instantly to your browser.", icon: Search, href: "/tools/scan-to-pdf" },
  { category: "PDF Intelligence", title: "OCR PDF", description: "Make your scanned PDF searchable and selectable.", icon: AlignLeft, href: "/tools/ocr-pdf" },
  { category: "Workflows", title: "Compare PDF", description: "Compare two PDF documents to spot the differences.", icon: FileText, href: "/tools/compare-pdf" },
  { category: "PDF Security", title: "Redact PDF", description: "Permanently remove sensitive text and graphics from your PDF.", icon: EyeOff, href: "/tools/redact-pdf" },
  { category: "Organize PDF", title: "Crop PDF", description: "Trim PDF margins, change PDF page size.", icon: Crop, href: "/tools/crop-pdf" },
  { category: "PDF Intelligence", title: "AI Summarizer", description: "Get quick summaries of long PDF documents using advanced AI.", icon: Bot, href: "/tools/ai-summarizer" },
  { category: "PDF Intelligence", title: "Translate PDF", description: "Instantly translate your PDF documents to any language.", icon: Languages, href: "/tools/translate-pdf" }
];

const categories = [
  "All",
  "Workflows",
  "Organize PDF",
  "Optimize PDF",
  "Convert PDF",
  "Edit PDF",
  "PDF Security",
  "PDF Intelligence"
];

export default function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTools = activeCategory === "All" 
    ? toolsData 
    : toolsData.filter(tool => tool.category === activeCategory);

  return (
    <div className="w-full">
      <div className="flex overflow-x-auto pb-4 mb-8 hide-scrollbar justify-start md:justify-center">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </div>
      
      {filteredTools.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No tools found in this category.
        </div>
      )}
    </div>
  );
}

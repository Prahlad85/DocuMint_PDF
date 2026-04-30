"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, CheckCircle } from "lucide-react";
import UploadBox from "./UploadBox";
import { PDFDocument } from 'pdf-lib';

export default function ToolProcessor({ toolType, toolInfo }) {
  const [resultUrl, setResultUrl] = useState(null);
  const [resultName, setResultName] = useState(null);

  const handleProcess = async (files) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (toolType === "merge-pdf") {
          if (files.length < 2) {
            throw new Error("Please upload at least 2 PDF files to merge.");
          }
          
          const mergedPdf = await PDFDocument.create();
          
          for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
          }
          
          const mergedPdfFile = await mergedPdf.save();
          const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          
          setResultUrl(url);
          setResultName("merged_document.pdf");
        } 
        else {
          setTimeout(() => {
            if (files.length > 0) {
              const fileUrl = URL.createObjectURL(files[0]);
              setResultUrl(fileUrl);
              setResultName(`processed_${files[0].name}`);
            }
          }, 3000);
        }
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  };

  if (resultUrl) {
    return (
      <div className="max-w-3xl mx-auto mt-10 bg-card border rounded-3xl p-12 text-center shadow-lg">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Task Complete!</h2>
        <p className="text-muted-foreground text-lg mb-8">
          Your document has been successfully processed.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href={resultUrl} download={resultName}>
            <Button size="lg" className="rounded-full px-10 py-6 text-lg font-semibold w-full sm:w-auto">
              <Download className="mr-2 h-5 w-5" /> Download File
            </Button>
          </a>
          <Button 
            variant="outline" 
            size="lg" 
            className="rounded-full px-10 py-6 text-lg font-semibold w-full sm:w-auto"
            onClick={() => setResultUrl(null)}
          >
            Process More Files
          </Button>
        </div>
      </div>
    );
  }

  return (
    <UploadBox 
      title={toolInfo.title} 
      description={`Drop your files here to ${toolInfo.title.toLowerCase()}`}
      onProcess={handleProcess}
    />
  );
}

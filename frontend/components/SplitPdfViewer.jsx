"use client";
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from "@/components/ui/button";
import { Check, Scissors } from "lucide-react";

// Set worker url
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function SplitPdfViewer({ file, onProcessSplit }) {
  const [numPages, setNumPages] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [mode, setMode] = useState('extract'); // 'extract' or 'remove'

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const togglePage = (pageNumber) => {
    setSelectedPages(prev => {
      if (prev.includes(pageNumber)) {
        return prev.filter(p => p !== pageNumber);
      } else {
        return [...prev, pageNumber];
      }
    });
  };

  const handleProcess = () => {
    if (selectedPages.length === 0) {
      alert("Please select at least one page.");
      return;
    }
    onProcessSplit(file, selectedPages, mode);
  };

  return (
    <div className="flex flex-col items-center mt-8 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between w-full mb-6 items-center bg-card p-4 rounded-xl border shadow-sm">
        <div>
          <h3 className="text-xl font-semibold mb-1">Select Pages to Split</h3>
          <p className="text-muted-foreground text-sm">
            {selectedPages.length} pages selected
          </p>
        </div>
        
        <div className="flex gap-4 mt-4 md:mt-0">
          <Button 
            onClick={() => setMode('extract')} 
            variant={mode === 'extract' ? 'default' : 'outline'}
          >
            <Check className="w-4 h-4 mr-2" />
            Extract Selected
          </Button>
          <Button 
            onClick={() => setMode('remove')}
            variant={mode === 'remove' ? 'destructive' : 'outline'}
          >
            <Scissors className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
          <Button onClick={handleProcess} size="lg" className="ml-4 px-8">
            Process Split
          </Button>
        </div>
      </div>

      <div className="bg-muted/30 w-full p-4 md:p-6 rounded-xl border overflow-auto">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 justify-items-center"
        >
          {Array.from(new Array(numPages), (el, index) => {
            const pageNumber = index + 1;
            const isSelected = selectedPages.includes(pageNumber);
            
            return (
              <div 
                key={`page_${pageNumber}`} 
                className={`relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden w-full max-w-[200px] flex justify-center ${isSelected ? 'ring-4 ring-primary shadow-xl scale-[1.02]' : 'ring-1 ring-border shadow-sm hover:shadow-md'}`}
                onClick={() => togglePage(pageNumber)}
              >
                <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                  {pageNumber}
                </div>
                
                {isSelected && (
                  <div className="absolute inset-0 z-10 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
                      {mode === 'extract' ? <Check className="w-6 h-6 md:w-8 md:h-8" /> : <Scissors className="w-6 h-6 md:w-8 md:h-8" />}
                    </div>
                  </div>
                )}

                <div className="pointer-events-none w-full">
                  <Page 
                    pageNumber={pageNumber} 
                    width={200}
                    className="w-full flex justify-center [&>canvas]:!w-full [&>canvas]:!h-auto"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              </div>
            );
          })}
        </Document>
        
        {!numPages && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
}

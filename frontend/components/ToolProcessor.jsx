"use client";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import UploadBox from "./UploadBox";
import dynamic from 'next/dynamic';

const SplitPdfViewer = dynamic(() => import('./SplitPdfViewer'), { ssr: false });

export default function ToolProcessor({ toolType, toolInfo }) {
  const [resultUrl, setResultUrl] = useState(null);
  const [resultName, setResultName] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mergedFiles, setMergedFiles] = useState([]); // persists files for "add more" in merge-pdf

  const handleProcess = async (files, additionalParams = {}) => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append('file', file);
      }
      Object.entries(additionalParams).forEach(([key, value]) => {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      });

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

      const apiRoutes = {
        'merge-pdf': '/api/merge',
        'split-pdf': '/api/split',
        'compress-pdf': '/api/compress',
        'pdf-to-word': '/api/convert/pdf-to-word',
        'pdf-to-powerpoint': '/api/convert/pdf-to-powerpoint',
        'pdf-to-excel': '/api/convert/pdf-to-excel',
        'word-to-pdf': '/api/convert/word-to-pdf',
        'powerpoint-to-pdf': '/api/convert/powerpoint-to-pdf',
        'excel-to-pdf': '/api/convert/excel-to-pdf',
        'ocr-pdf': '/api/ocr',
        'pdf-to-jpg': '/api/pdf-to-jpg',
        'jpg-to-pdf': '/api/jpg-to-pdf',
        'scan-to-pdf': '/api/scan-to-pdf',
        'watermark': '/api/watermark',
        'rotate-pdf': '/api/rotate',
        'page-numbers': '/api/page-numbers',
        'organize-pdf': '/api/organize',
        'edit-pdf': '/api/edit',
        'sign-pdf': '/api/sign',
        'protect-pdf': '/api/protect',
        'unlock-pdf': '/api/unlock',
        'html-to-pdf': '/api/html-to-pdf',
        'pdf-to-pdfa': '/api/pdf-to-pdfa',
        'repair-pdf': '/api/repair',
        'redact-pdf': '/api/redact',
        'crop-pdf': '/api/crop',
        'compare-pdf': '/api/compare',
        'ai-summarizer': '/api/summarize',
        'translate-pdf': '/api/translate',
      };

      const endpoint = apiRoutes[toolType] || `/api/${toolType.replace('-pdf', '')}`;
      const fullUrl = `${API_BASE}${endpoint}`;

      const response = await fetch(fullUrl, {
        method: 'POST',
        body: formData,
      });


      if (!response.ok) {
        let errMsg = `Server error (${response.status})`;
        try {
          const errData = await response.json();
          errMsg = errData.error || errMsg;
        } catch {
          // non-JSON error body
          errMsg = `HTTP ${response.status} — ${response.statusText || 'Backend request failed'}`;
        }
        throw new Error(errMsg);
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        setResultUrl(URL.createObjectURL(blob));
        setResultName(`result_${files[0].name}.json`);
      } else {
        const blob = await response.blob();
        const disposition = response.headers.get('Content-Disposition');
        let filename = `processed_${files[0].name}`;
        if (disposition && disposition.indexOf('filename=') !== -1) {
          const matches = /filename="([^"]*)"/.exec(disposition);
          if (matches && matches[1]) filename = matches[1];
        }
        setResultUrl(URL.createObjectURL(blob));
        setResultName(filename);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onFilesSelected = (files) => {
    if (toolType === 'split-pdf') {
      setUploadedFiles(files);
    } else {
      handleProcess(files);
    }
  };

  // Always clear uploadedFiles when split is done, whether success or failure
  const handleSplitProcess = async (file, pages, mode) => {
    try {
      await handleProcess([file], { pages, mode });
    } finally {
      setUploadedFiles(null);
    }
  };

  const resetAll = () => {
    setResultUrl(null);
    setResultName(null);
    setUploadedFiles(null);
    setErrorMsg(null);
    setMergedFiles([]);
  };

  // For merge-pdf: go back to upload box keeping no pre-loaded files (UploadBox manages its own state)
  const addMoreAndMerge = () => {
    setResultUrl(null);
    setResultName(null);
    setErrorMsg(null);
    // uploadedFiles stays null — UploadBox starts fresh and user adds more files
  };

  // ── Render States (strict priority order) ──────────────────────────────────

  // Scroll to top whenever state changes
  useEffect(() => {
    if (isProcessing || errorMsg || resultUrl) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isProcessing, errorMsg, resultUrl]);

  // 1. Processing spinner — shown during API call
  if (isProcessing) {
    return (
      <div className="max-w-lg mx-auto mt-4 bg-card border rounded-2xl p-6 text-center shadow-md">
        <div className="flex justify-center mb-4 text-primary">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
        <h2 className="text-xl font-bold mb-2">Processing...</h2>
        <p className="text-muted-foreground text-sm">
          Please wait while we process your document.
        </p>
      </div>
    );
  }

  // 2. Error state — backend failed or network issue
  if (errorMsg) {
    return (
      <div className="max-w-lg mx-auto mt-4 bg-card border rounded-2xl p-6 text-center shadow-md">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold mb-2">Processing Failed</h2>
        <p className="text-muted-foreground text-sm mb-5">{errorMsg}</p>
        <Button size="sm" className="rounded-full px-6 font-semibold" onClick={resetAll}>
          Try Again
        </Button>
      </div>
    );
  }

  // 3. Success / Download screen
  if (resultUrl) {
    return (
      <div className="max-w-lg mx-auto mt-4 bg-card border rounded-2xl p-6 text-center shadow-md">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold mb-2">Task Complete!</h2>
        <p className="text-muted-foreground text-sm mb-5">
          Your document has been successfully processed.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 flex-wrap">
          <a href={resultUrl} download={resultName}>
            <Button size="sm" className="rounded-full px-6 font-semibold w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" /> Download File
            </Button>
          </a>
          {toolType === 'merge-pdf' && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-6 font-semibold w-full sm:w-auto border-primary/50 text-primary hover:bg-primary/10"
              onClick={addMoreAndMerge}
            >
              <span className="text-base leading-none mr-1">+</span> Add More Files
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-6 font-semibold w-full sm:w-auto"
            onClick={resetAll}
          >
            Process More Files
          </Button>
        </div>
      </div>
    );
  }

  // 4. Split PDF page-picker
  if (uploadedFiles && toolType === 'split-pdf') {
    return <SplitPdfViewer file={uploadedFiles[0]} onProcessSplit={handleSplitProcess} />;
  }

  // 5. Default upload box
  const imageOnlyTools = ['jpg-to-pdf', 'scan-to-pdf'];
  const acceptTypes = imageOnlyTools.includes(toolType) ? 'image/*,.jpg,.jpeg,.png,.webp,.bmp,.tiff,.gif' : undefined;

  return (
    <UploadBox
      title={toolInfo.title}
      description={`Drop your files here to ${toolInfo.title.toLowerCase()}`}
      onProcess={onFilesSelected}
      acceptTypes={acceptTypes}
    />
  );
}

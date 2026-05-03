"use client";

import { useState, useRef } from "react";
import { UploadCloud, File, X, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

export default function UploadBox({ title, description, onProcess, processingText = "Processing...", acceptTypes }) {
  // acceptTypes: e.g. "image/*" or ".pdf,application/pdf" — defaults to PDF only
  const accept = acceptTypes || ".pdf,application/pdf";
  const isPdfOnly = !acceptTypes || acceptTypes.includes('pdf');
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError("");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    setError("");
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    let validFiles = newFiles;
    if (isPdfOnly) {
      validFiles = newFiles.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
      if (validFiles.length !== newFiles.length) {
        setError('Some files were rejected. Please upload valid PDF files.');
      }
    }
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const startProcessing = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setProgress(10);
    
    // Simulate processing steps
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 10;
      });
    }, 500);

    try {
      await onProcess(files);
      setProgress(100);
    } catch (err) {
      setError(err.message || "An error occurred during processing.");
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div 
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 ${
          isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-muted-foreground/20 bg-card hover:border-primary/50 hover:bg-muted/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
            <UploadCloud className="w-7 h-7 text-primary" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-1">{title || "Select PDF files"}</h3>
            <p className="text-muted-foreground text-sm">
              {description || "Drag and drop your PDFs here"}
            </p>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileInput} 
            className="hidden" 
            multiple 
            accept={accept}
          />
          
          <Button 
            size="default" 
            className="rounded-full px-8 py-2 text-sm font-semibold shadow-md shadow-primary/20 hover:scale-105 transition-transform"
            onClick={() => fileInputRef.current?.click()}
          >
            Select PDF files
          </Button>
          <p className="text-xs text-muted-foreground">or drop files here</p>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-lg">Selected Files ({files.length})</h4>
            {!isProcessing && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-4 gap-2 border-dashed border-primary/50 text-primary hover:bg-primary/10"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-lg leading-none">+</span> Add More Files
              </Button>
            )}
          </div>
          <div className="space-y-3 mb-6">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-card border rounded-xl shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <File className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium truncate max-w-[200px] sm:max-w-md">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={isProcessing}>
                  <X className="w-5 h-5 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          {isProcessing ? (
            <div className="space-y-4 bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{processingText}</span>
                <span className="text-primary font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-16 py-6 text-lg font-bold rounded-xl"
                onClick={startProcessing}
              >
                {title || "Process Files"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

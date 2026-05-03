"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Merge, Split, FileArchive, FileText, FileUp, FileDown, Type, Edit3, Image, PenTool, Layers, Settings, Unlock, Shield, AlignLeft, Bot, Languages, EyeOff, Crop, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const tools = [
  { title: "Merge PDF", icon: Merge, href: "/tools/merge-pdf", category: "Organize" },
  { title: "Split PDF", icon: Split, href: "/tools/split-pdf", category: "Organize" },
  { title: "Compress PDF", icon: FileArchive, href: "/tools/compress-pdf", category: "Optimize" },
  { title: "PDF to Word", icon: FileText, href: "/tools/pdf-to-word", category: "Convert" },
  { title: "Word to PDF", icon: Type, href: "/tools/word-to-pdf", category: "Convert" },
  { title: "PDF to JPG", icon: Image, href: "/tools/pdf-to-jpg", category: "Convert" },
  { title: "JPG to PDF", icon: Image, href: "/tools/jpg-to-pdf", category: "Convert" },
  { title: "Sign PDF", icon: PenTool, href: "/tools/sign-pdf", category: "Edit" },
  { title: "Edit PDF", icon: Edit3, href: "/tools/edit-pdf", category: "Edit" },
  { title: "Watermark", icon: Layers, href: "/tools/watermark", category: "Edit" },
  { title: "Unlock PDF", icon: Unlock, href: "/tools/unlock-pdf", category: "Security" },
  { title: "Protect PDF", icon: Shield, href: "/tools/protect-pdf", category: "Security" },
  { title: "OCR PDF", icon: AlignLeft, href: "/tools/ocr-pdf", category: "Intelligence" },
  { title: "AI Summarizer", icon: Bot, href: "/tools/ai-summarizer", category: "Intelligence" },
  { title: "Translate PDF", icon: Languages, href: "/tools/translate-pdf", category: "Intelligence" },
  { title: "Rotate PDF", icon: Settings, href: "/tools/rotate-pdf", category: "Organize" },
  { title: "Organize PDF", icon: Layers, href: "/tools/organize-pdf", category: "Organize" },
  { title: "Redact PDF", icon: EyeOff, href: "/tools/redact-pdf", category: "Security" },
  { title: "Crop PDF", icon: Crop, href: "/tools/crop-pdf", category: "Organize" },
];

export default function CommandSearch({ open, setOpen }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const filteredTools = query === "" 
    ? tools.slice(0, 6) 
    : tools.filter((tool) => 
        tool.title.toLowerCase().includes(query.toLowerCase()) || 
        tool.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (href) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden border-none shadow-2xl bg-background/80 backdrop-blur-xl sm:max-w-[550px] hide-close-button">
        <div className="flex items-center border-b px-4 h-14 relative">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <input
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground h-full"
            placeholder="Search for PDF tools (e.g. Merge, Split)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        
        <div className="max-h-[350px] overflow-y-auto p-2 slick-scrollbar">
          {filteredTools.length > 0 ? (
            <div className="space-y-1">
              <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {query ? "Search Results" : "Suggested Tools"}
              </div>
              {filteredTools.map((tool) => (
                <button
                  key={tool.href}
                  onClick={() => handleSelect(tool.href)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left group"
                >
                  <div className="p-2 rounded-md bg-muted group-hover:bg-background transition-colors">
                    <tool.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-medium truncate">{tool.title}</div>
                    <div className="text-[10px] text-muted-foreground">{tool.category}</div>
                  </div>
                  <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    Open →
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <div className="inline-flex p-3 rounded-full bg-muted mb-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No tools found for "{query}"</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-t text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 rounded border bg-background">↵</kbd> Select</span>
            <span><kbd className="px-1 rounded border bg-background">↑↓</kbd> Navigate</span>
          </div>
          <div>DocuMint Search</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Sun, Moon, Waves, Coffee, Search, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginDialog, SignUpDialog } from '@/components/AuthDialogs';
import { useTheme } from '@/components/ThemeProvider';
import CommandSearch from '@/components/CommandSearch';

const themes = [
  { id: "light",     label: "Light",     icon: Sun,    color: "#ffffff", border: "#d1d5db" },
  { id: "dark",      label: "Dark",      icon: Moon,   color: "#000000", border: "#374151" },
  { id: "blue-gray", label: "Blue",      icon: Waves,  color: "#0f1923", border: "#1e3a5f" },
  { id: "yellow",    label: "Warm",      icon: Coffee, color: "#fefce8", border: "#d97706" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const lastTouchTime = useRef(0);
  const menuRef = useRef(null);
  const themeRef = useRef(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Close mobile menu on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      // Don't close if clicking inside the menu or on a dialog/portal
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      if (e.target.closest('[role="dialog"]') || e.target.closest('[data-radix-portal]')) return;
      
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => { 
      document.removeEventListener('mousedown', handler); 
      document.removeEventListener('touchstart', handler); 
    };
  }, [isOpen]);

  // Close theme dropdown on outside click
  useEffect(() => {
    if (!themeOpen) return;
    const handler = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        if (e.target.closest('[role="dialog"]') || e.target.closest('[data-radix-portal]')) return;
        setThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [themeOpen]);

  const handleTouchEnd = useCallback(() => {
    lastTouchTime.current = Date.now();
    setIsOpen(prev => !prev);
  }, []);

  const handleClick = useCallback(() => {
    // Throttle reduced to 200ms for faster feel
    if (Date.now() - lastTouchTime.current < 200) return;
    setIsOpen(prev => !prev);
  }, []);

  const handleNavClick = useCallback((href) => {
    setIsOpen(false);
    router.push(href);
    // Instant scroll for faster navigation
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [router]);

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  return (
    <nav ref={menuRef} className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button onClick={() => handleNavClick('/')} className="cursor-pointer flex items-center space-x-2 group">
            <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary tracking-tight">DocuMint</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-baseline space-x-1">
            {[
              { label: "Merge PDF", href: "/tools/merge-pdf" },
              { label: "Split PDF", href: "/tools/split-pdf" },
              { label: "Compress PDF", href: "/tools/compress-pdf" },
              { label: "Convert PDF", href: "/tools/convert-pdf" },
              { label: "All PDF Tools", href: "/tools" },
            ].map(({ label, href }) => (
              <button
                key={href}
                onClick={() => handleNavClick(href)}
                className="cursor-pointer hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-2">
            {/* Quick Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="group flex items-center gap-2 lg:w-64 px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 text-muted-foreground transition-all duration-300 mr-2 shadow-sm hover:shadow-md"
            >
              <Search className="h-4 w-4 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium">Search tools...</span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-50 ml-auto">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <div ref={themeRef} className="relative">
              <button
                onClick={() => setThemeOpen(p => !p)}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium hover:bg-muted transition-colors"
                title="Switch theme"
              >
                <span
                  className="w-3 h-3 rounded-full border inline-block transition-colors"
                  style={{ background: mounted ? currentTheme.color : 'transparent', borderColor: mounted ? currentTheme.border : 'transparent' }}
                />
                <span className={mounted ? "opacity-100" : "opacity-0 transition-none"}>
                  {mounted ? currentTheme.label : "Theme"}
                </span>
              </button>
              {themeOpen && (
                <div className="absolute right-0 top-10 bg-popover border rounded-xl shadow-lg p-1 min-w-[130px] z-50 animate-in fade-in zoom-in-95 duration-100">
                  {themes.map(t => (
                    <button
                      key={t.id}
                      onClick={() => { 
                        setTheme(t.id); 
                        setThemeOpen(false); 
                      }}
                      className={`cursor-pointer w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-muted transition-colors ${theme === t.id ? 'bg-muted' : ''}`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border shrink-0"
                        style={{ background: t.color, borderColor: t.border }}
                      />
                      {t.label}
                      {theme === t.id && <span className="ml-auto text-primary">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <LoginDialog>
              <Button variant="ghost" className="cursor-pointer">Login</Button>
            </LoginDialog>
            <SignUpDialog>
              <Button className="cursor-pointer">Sign Up</Button>
            </SignUpDialog>
          </div>

          {/* Mobile: search + theme + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Search Button - Expanded */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden flex items-center gap-2 flex-1 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-muted-foreground mr-2"
            >
              <Search className="h-4 w-4" />
              <span className="text-xs">Search...</span>
            </button>
            {/* Theme Toggle - Desktop only */}
            <div className="hidden md:flex gap-1">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`relative cursor-pointer w-5 h-5 rounded-full border border-border/50 flex items-center justify-center transition-none active:scale-95 ${theme === t.id ? 'scale-110 ring-2 ring-offset-1 ring-offset-background' : 'opacity-80'}`}
                  style={{ background: t.color }}
                >
                  {theme === t.id && (
                    <Check className="h-3 w-3" style={{ color: t.border }} strokeWidth={4} />
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleClick}
              onTouchEnd={handleTouchEnd}
              className="cursor-pointer p-2 text-foreground hover:bg-muted rounded-md transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Absolute to prevent layout shift (Speed fix) */}
      {isOpen && (
        <div 
          className="md:hidden absolute top-16 left-0 w-full border-b shadow-xl z-[60] bg-background/80 animate-in fade-in slide-in-from-top-1 duration-200"
          style={{ backdropFilter: 'blur(36px)', WebkitBackdropFilter: 'blur(36px)' }}
        >
          <div className="flex flex-col p-4 space-y-1">
            {[
              { label: "Merge PDF", href: "/tools/merge-pdf" },
              { label: "Split PDF", href: "/tools/split-pdf" },
              { label: "Compress PDF", href: "/tools/compress-pdf" },
              { label: "Convert PDF", href: "/tools/convert-pdf" },
              { label: "All PDF Tools", href: "/tools" },
            ].map(({ label, href }) => (
              <button
                key={href}
                onClick={() => handleNavClick(href)}
                className="w-full text-left p-3 rounded-xl hover:bg-muted transition-colors font-medium"
              >
                {label}
              </button>
            ))}
            <div className="pt-4 flex flex-col gap-2">
              <LoginDialog><Button variant="ghost" className="w-full justify-start h-12">Login</Button></LoginDialog>
              <SignUpDialog><Button className="w-full justify-start h-12">Sign Up</Button></SignUpDialog>
            </div>

            {/* Mobile Theme Selection */}
            <div className="pt-6 pb-2 border-t mt-4">
              <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                Select Theme
              </p>
              <div className="flex gap-4 px-3">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`relative cursor-pointer w-8 h-8 rounded-full border border-border flex items-center justify-center transition-none active:scale-95 ${theme === t.id ? 'scale-110 ring-2 ring-offset-2 ring-offset-background' : 'opacity-80'}`}
                    style={{ background: t.color }}
                  >
                    {theme === t.id && (
                      <Check className="h-4 w-4" style={{ color: t.border }} strokeWidth={4} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Command Palette */}
      <CommandSearch open={searchOpen} setOpen={setSearchOpen} />
    </nav>
  );
}

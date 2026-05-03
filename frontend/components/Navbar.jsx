"use client";
import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Sun, Moon, Waves, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginDialog, SignUpDialog } from '@/components/AuthDialogs';
import { useTheme } from '@/components/ThemeProvider';

const themes = [
  { id: "light",     label: "Light",     icon: Sun,    color: "#ffffff", border: "#d1d5db" },
  { id: "dark",      label: "Dark",      icon: Moon,   color: "#000000", border: "#374151" },
  { id: "blue-gray", label: "Blue",      icon: Waves,  color: "#0f1923", border: "#1e3a5f" },
  { id: "yellow",    label: "Warm",      icon: Coffee, color: "#fefce8", border: "#d97706" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const lastTouchTime = useRef(0);
  const menuRef = useRef(null);
  const themeRef = useRef(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Close mobile menu on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
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
      if (themeRef.current && !themeRef.current.contains(e.target)) setThemeOpen(false);
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
          <button onClick={() => handleNavClick('/')} className="cursor-pointer flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">DocuMint</span>
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
            {/* Theme Toggle */}
            <div ref={themeRef} className="relative">
              <button
                onClick={() => setThemeOpen(p => !p)}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium hover:bg-muted transition-colors"
                title="Switch theme"
              >
                <span
                  className="w-3 h-3 rounded-full border inline-block"
                  style={{ background: currentTheme.color, borderColor: currentTheme.border }}
                />
                {currentTheme.label}
              </button>
              {themeOpen && (
                <div className="absolute right-0 top-10 bg-popover border rounded-xl shadow-lg p-1 min-w-[130px] z-50 animate-in fade-in zoom-in-95 duration-100">
                  {themes.map(t => (
                    <button
                      key={t.id}
                      onClick={() => { setTheme(t.id); setThemeOpen(false); }}
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

          {/* Mobile: theme + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex gap-1">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`cursor-pointer w-5 h-5 rounded-full border transition-transform active:scale-90 ${theme === t.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : 'border-border'}`}
                  style={{ background: t.color }}
                />
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
          </div>
        </div>
      )}
    </nav>
  );
}

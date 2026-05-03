"use client";
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useRef, useEffect } from 'react';
import { LoginDialog, SignUpDialog } from '@/components/AuthDialogs';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const lastTouchTime = useRef(0);
  const menuRef = useRef(null);
  const router = useRouter();

  // Close menu on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  const handleTouchEnd = useCallback(() => {
    lastTouchTime.current = Date.now();
    setIsOpen(prev => !prev);
  }, []);

  const handleClick = useCallback(() => {
    if (Date.now() - lastTouchTime.current < 500) return;
    setIsOpen(prev => !prev);
  }, []);

  // Navigate + scroll to top
  const handleNavClick = useCallback((href) => {
    setIsOpen(false);
    router.push(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [router]);

  return (
    <nav ref={menuRef} className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => handleNavClick('/')} className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">DocuMint</span>
            </button>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button onClick={() => handleNavClick('/tools/merge-pdf')} className="hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Merge PDF</button>
              <button onClick={() => handleNavClick('/tools/split-pdf')} className="hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Split PDF</button>
              <button onClick={() => handleNavClick('/tools/compress-pdf')} className="hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Compress PDF</button>
              <button onClick={() => handleNavClick('/tools/convert-pdf')} className="hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Convert PDF</button>
              <button onClick={() => handleNavClick('/tools')} className="hover:text-primary px-3 py-2 rounded-md text-sm font-medium">All PDF Tools</button>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <LoginDialog>
              <Button variant="ghost">Login</Button>
            </LoginDialog>
            <SignUpDialog>
              <Button>Sign Up</Button>
            </SignUpDialog>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              onClick={handleClick}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: 'manipulation' }}
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted focus:outline-none focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <button onClick={() => handleNavClick('/tools/merge-pdf')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-muted">Merge PDF</button>
            <button onClick={() => handleNavClick('/tools/split-pdf')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-muted">Split PDF</button>
            <button onClick={() => handleNavClick('/tools/compress-pdf')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-muted">Compress PDF</button>
            <button onClick={() => handleNavClick('/tools/convert-pdf')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-muted">Convert PDF</button>
            <button onClick={() => handleNavClick('/tools')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-muted">All PDF Tools</button>
            <div className="flex flex-col space-y-2 mt-4 px-3">
              <LoginDialog>
                <Button variant="ghost" className="w-full justify-start">Login</Button>
              </LoginDialog>
              <SignUpDialog>
                <Button className="w-full justify-start">Sign Up</Button>
              </SignUpDialog>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

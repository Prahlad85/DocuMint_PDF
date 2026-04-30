"use client";
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { LoginDialog, SignUpDialog } from '@/components/AuthDialogs';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">DocuMint</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/tools/merge-pdf" className="hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Merge PDF</Link>
              <Link href="/tools/split-pdf" className="hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Split PDF</Link>
              <Link href="/tools/compress-pdf" className="hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Compress PDF</Link>
              <Link href="/tools/convert-pdf" className="hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Convert PDF</Link>
              <Link href="/tools" className="hover:text-primary px-3 py-2 rounded-md text-sm font-medium">All PDF Tools</Link>
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
          <div className="-mr-2 flex md:hidden">
            <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link href="/tools/merge-pdf" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-muted">Merge PDF</Link>
            <Link href="/tools/split-pdf" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-muted">Split PDF</Link>
            <Link href="/tools/compress-pdf" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-muted">Compress PDF</Link>
            <Link href="/tools/convert-pdf" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-muted">Convert PDF</Link>
            <Link href="/tools" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-muted">All PDF Tools</Link>
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

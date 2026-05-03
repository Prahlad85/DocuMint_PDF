"use client";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Detect if the app is running in standalone mode (PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    if (!isStandalone) {
      setShow(false);
      return;
    }
    
    // Only show on first load of the session
    const hasSeen = sessionStorage.getItem("dm-splash-seen");

    if (hasSeen) {
      setShow(false);
      return;
    }

    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("dm-splash-seen", "true");
      }, 500); // fade duration
    }, 2000); // show duration

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-primary transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex flex-col items-center animate-in zoom-in duration-700">
        <div className="bg-white p-6 rounded-3xl shadow-2xl mb-6">
          <FileText className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tighter">DocuMint</h1>
        <div className="mt-4 flex gap-1">
          <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
      
      <div className="absolute bottom-12 text-center">
        <p className="text-white/60 text-xs font-medium tracking-widest uppercase mb-1">Created by</p>
        <p className="text-white text-sm font-semibold">Prahlad Kumar</p>
      </div>
    </div>
  );
}

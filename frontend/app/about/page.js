import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Target, Heart, Zap } from "lucide-react";

export const metadata = {
  title: "About Us - DocuMint",
  description: "Learn about DocuMint - the free PDF toolkit built for everyone.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              About <span className="text-primary">DocuMint</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              DocuMint is a free, powerful PDF toolkit designed to make working with PDFs simple, fast, and accessible for everyone — no installations, no sign-ups required.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Heart, title: "Free Forever", desc: "All 29 tools are completely free to use. No hidden charges." },
                { icon: Zap, title: "Fast & Reliable", desc: "Process your documents in seconds with our powerful backend." },
                { icon: Target, title: "Privacy First", desc: "Your files are deleted from our servers immediately after processing." },
                { icon: Users, title: "Built for Everyone", desc: "From students to professionals — DocuMint works for all." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-card border rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>DocuMint was created out of frustration with expensive, bloated PDF software that locked essential features behind paywalls. We believed everyone deserves access to professional-grade PDF tools.</p>
              <p>Today, DocuMint offers 29 tools — from merging and splitting PDFs to AI-powered summarization and translation — all completely free and powered by modern technology.</p>
              <p>We are a small, passionate team dedicated to keeping DocuMint fast, private, and free for everyone.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

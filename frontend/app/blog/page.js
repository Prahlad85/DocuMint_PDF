import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Blog - DocuMint",
  description: "Tips, guides and updates from the DocuMint team.",
};

const posts = [
  {
    slug: "how-to-compress-pdf",
    title: "How to Compress a PDF Without Losing Quality",
    excerpt: "Learn the best techniques to reduce your PDF file size while keeping images and text crisp and clear.",
    date: "May 1, 2025",
    readTime: "4 min read",
    category: "Guide",
  },
  {
    slug: "merge-pdf-guide",
    title: "The Ultimate Guide to Merging PDF Files",
    excerpt: "Whether you have 2 or 20 PDFs, merging them into one professional document is easier than you think.",
    date: "April 25, 2025",
    readTime: "5 min read",
    category: "Guide",
  },
  {
    slug: "pdf-vs-word",
    title: "PDF vs Word: When to Use Which Format",
    excerpt: "Choosing between PDF and DOCX can make a big difference. Here's when to use each format.",
    date: "April 18, 2025",
    readTime: "3 min read",
    category: "Tips",
  },
  {
    slug: "protect-pdf-password",
    title: "How to Password Protect Your PDF Files",
    excerpt: "Keep your sensitive documents secure by adding password protection in just a few clicks.",
    date: "April 10, 2025",
    readTime: "3 min read",
    category: "Security",
  },
  {
    slug: "ocr-pdf-guide",
    title: "What is OCR and Why Does Your PDF Need It?",
    excerpt: "OCR (Optical Character Recognition) turns scanned images into searchable, selectable text. Here's how it works.",
    date: "April 3, 2025",
    readTime: "6 min read",
    category: "Technology",
  },
  {
    slug: "ai-pdf-summarizer",
    title: "Save Hours with AI PDF Summarization",
    excerpt: "DocuMint's AI Summarizer can distill a 50-page report into a concise summary in under a minute.",
    date: "March 28, 2025",
    readTime: "4 min read",
    category: "AI",
  },
];

const categoryColors = {
  Guide: "bg-blue-100 text-blue-700",
  Tips: "bg-green-100 text-green-700",
  Security: "bg-red-100 text-red-700",
  Technology: "bg-purple-100 text-purple-700",
  AI: "bg-amber-100 text-amber-700",
};

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              DocuMint <span className="text-primary">Blog</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Tips, guides, and updates to help you get the most out of your PDF workflow.
            </p>
          </div>
        </section>

        <section className="py-4 pb-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {posts.map((post) => (
                <article key={post.slug} className="bg-card border rounded-2xl p-6 flex flex-col hover:shadow-md transition-shadow">
                  <div className="mb-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[post.category] || "bg-muted text-muted-foreground"}`}>
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold mb-2 leading-snug">{post.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3 mt-auto">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="flex items-center gap-1 text-primary font-medium hover:underline text-xs">
                      Read <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

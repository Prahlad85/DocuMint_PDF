import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryTabs from "@/components/CategoryTabs";

export const metadata = {
  title: "All PDF Tools - DocuMint",
  description: "Browse all our free PDF tools to merge, split, compress, and convert PDFs.",
};

export default function ToolsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 bg-muted/20">
        <div className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">All PDF Tools</h1>
              <p className="text-xl text-muted-foreground">
                Make use of our collection of PDF tools to process digital documents and streamline your workflow seamlessly.
              </p>
            </div>
            
            <CategoryTabs />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

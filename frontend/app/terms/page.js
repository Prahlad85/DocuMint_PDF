import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service - DocuMint",
  description: "Read DocuMint's Terms of Service before using our platform.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-14 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Terms of Service</h1>
            <p className="text-muted-foreground text-sm mb-10">Last updated: May 1, 2025</p>

            <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">1. Acceptance of Terms</h2>
                <p>By accessing or using DocuMint ("the Service") at <strong>docu2mint.vercel.app</strong>, you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">2. Description of Service</h2>
                <p>DocuMint provides a free, browser-based PDF toolkit including tools for merging, splitting, compressing, converting, editing, and otherwise manipulating PDF documents.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">3. Acceptable Use</h2>
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Upload illegal, harmful, or copyrighted content without authorization.</li>
                  <li>Attempt to reverse engineer or disrupt the Service.</li>
                  <li>Use the Service for any commercial purpose without written permission.</li>
                  <li>Upload malicious files or attempt to harm the platform.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">4. File Uploads & Processing</h2>
                <p>Files uploaded to DocuMint are processed for the sole purpose of completing the requested operation. Files are automatically deleted from our servers after processing. You are responsible for ensuring you have the right to upload and process any files you submit.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">5. Disclaimer of Warranties</h2>
                <p>The Service is provided "as is" without warranties of any kind. DocuMint does not guarantee that the Service will be error-free, uninterrupted, or that results will be accurate in all cases.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">6. Limitation of Liability</h2>
                <p>DocuMint shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the Service, including loss of data or documents.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">7. Intellectual Property</h2>
                <p>All content, branding, and code on the DocuMint platform are the intellectual property of DocuMint. You may not copy, reproduce, or distribute any part of the Service without express written permission.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">8. Modifications to Terms</h2>
                <p>We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">9. Governing Law</h2>
                <p>These Terms shall be governed by applicable law. Any disputes shall be resolved through good-faith negotiation before pursuing legal remedies.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">10. Contact</h2>
                <p>For questions about these Terms, contact us at <strong>support@documint.app</strong>.</p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

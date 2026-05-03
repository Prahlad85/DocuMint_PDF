import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy - DocuMint",
  description: "Read DocuMint's privacy policy to understand how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-14 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground text-sm mb-10">Last updated: May 1, 2025</p>

            <div className="prose prose-neutral max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
              
              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">1. Overview</h2>
                <p>DocuMint ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our services at <strong>docu2mint.vercel.app</strong>.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">2. Information We Collect</h2>
                <p>We collect minimal information necessary to provide our services:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Uploaded Files:</strong> PDF and document files you upload for processing. These are stored temporarily and deleted immediately after processing.</li>
                  <li><strong>Usage Data:</strong> Anonymous analytics data such as pages visited and tools used, to improve our service.</li>
                  <li><strong>Contact Information:</strong> Name and email address if you contact us voluntarily.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">3. How We Use Your Data</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>To process your PDF documents and return results to you.</li>
                  <li>To improve and maintain our services.</li>
                  <li>To respond to your support queries.</li>
                  <li>We do <strong>not</strong> sell your data to third parties.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">4. File Storage & Deletion</h2>
                <p>All uploaded files are processed in temporary storage and <strong>automatically deleted</strong> within minutes of processing. We do not permanently store your documents.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">5. Cookies</h2>
                <p>We use essential cookies to ensure the website functions correctly. We do not use tracking or advertising cookies.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">6. Third-Party Services</h2>
                <p>Our services are hosted on Vercel and Render. File processing may use third-party libraries. These providers have their own privacy policies.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">7. Your Rights</h2>
                <p>You have the right to access, correct, or delete any personal data we hold about you. Contact us at <strong>support@documint.app</strong> for any requests.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">8. Changes to This Policy</h2>
                <p>We may update this Privacy Policy periodically. Changes will be posted on this page with an updated date.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-2">9. Contact</h2>
                <p>For privacy-related questions, contact us at <strong>support@documint.app</strong>.</p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

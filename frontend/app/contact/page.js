import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MessageCircle, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us - DocuMint",
  description: "Get in touch with the DocuMint team for support or inquiries.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a question, feedback, or need help? We'd love to hear from you.
            </p>
          </div>
        </section>

        <section className="py-4 pb-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-4xl mx-auto">
              {/* Contact Info */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Get In Touch</h2>
                <p className="text-muted-foreground">Our team typically responds within 24 hours on business days.</p>
                {[
                  { icon: Mail, label: "Email", value: "support@documint.app" },
                  { icon: MessageCircle, label: "Live Chat", value: "Available on the website" },
                  { icon: MapPin, label: "Location", value: "Remote-first global team" },
                  { icon: Clock, label: "Response Time", value: "Within 24 business hours" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-muted-foreground text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Form */}
              <div className="bg-card border rounded-2xl p-6 space-y-4">
                <h2 className="text-xl font-bold">Send a Message</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type="text" placeholder="Your name" className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" placeholder="your@email.com" className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <input type="text" placeholder="How can we help?" className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea rows={4} placeholder="Write your message..." className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                  </div>
                  <button className="w-full bg-primary text-primary-foreground rounded-lg py-2 text-sm font-semibold hover:bg-primary/90 transition">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

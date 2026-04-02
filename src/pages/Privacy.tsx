import Layout from "@/components/layout/Layout";

export default function Privacy() {
  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-8">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-xs font-mono text-muted-foreground mb-10">Last updated: April 1, 2026</p>

            <div className="space-y-8 text-muted-foreground text-[15px] leading-relaxed">
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-3">1. Information We Collect</h2>
                <p>We collect information you provide directly to us, including name, email address, phone number, company name, and project details when you fill out forms, request proposals, or contact us. We also automatically collect certain information when you visit our website, including IP address, browser type, device information, and pages visited.</p>
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-3">2. How We Use Your Information</h2>
                <p>We use the information we collect to provide and improve our services, respond to inquiries and proposals, send marketing communications (with your consent), analyze website usage and performance, and comply with legal obligations.</p>
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-3">3. Information Sharing</h2>
                <p>We do not sell your personal information to third parties. We may share information with trusted service providers who assist in our operations, when required by law, or with your explicit consent.</p>
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-3">4. Data Security</h2>
                <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-3">5. Cookies</h2>
                <p>We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user behavior. You can control cookies through your browser settings.</p>
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-3">6. Your Rights</h2>
                <p>Depending on your location, you may have the right to access, correct, delete, or port your personal data. You may also opt out of marketing communications at any time. We comply with GDPR, DPDP Act (India), and regional MENA data protection regulations.</p>
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-3">7. Contact Us</h2>
                <p>For privacy-related inquiries, please contact us at privacy@digitalpenta.com or write to our registered office in New Delhi, India.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
